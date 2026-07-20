const { google } = require("googleapis");
const Email = require("../models/emailModel");
const fs = require("fs");
const path = require("path");

// Categorization using Gmail labels
// Important emails are NOT decided here now.
// Important emails will be decided by scenarioController.js.
function categorizeEmail(labels = []) {
  if (labels.includes("SPAM")) return "spam";
  return "other";
}

// Decode Gmail base64url data
function decodeBase64Url(data = "") {
  try {
    return Buffer.from(
      data.replace(/-/g, "+").replace(/_/g, "/"),
      "base64"
    ).toString("utf-8");
  } catch (err) {
    return "";
  }
}

// Extract email body text from Gmail payload
function extractEmailBody(payload = {}) {
  let bodyText = [];

  const walkParts = (part) => {
    if (!part) return;

    const mimeType = part.mimeType || "";

    if (
      part.body &&
      part.body.data &&
      (mimeType === "text/plain" || mimeType === "text/html")
    ) {
      let decoded = decodeBase64Url(part.body.data);

      // Remove HTML tags if email body is HTML
      decoded = decoded.replace(/<[^>]*>/g, " ");

      bodyText.push(decoded);
    }

    if (part.parts && part.parts.length > 0) {
      part.parts.forEach(walkParts);
    }
  };

  walkParts(payload);

  return bodyText.join(" ").replace(/\s+/g, " ").trim();
}

// Extract attachments from Gmail payload
function extractAttachments(payload = {}) {
  let extracted = [];

  const walkParts = (part) => {
    if (!part) return;

    if (part.filename && part.body && part.body.attachmentId) {
      extracted.push({
        filename: part.filename,
        mimeType: part.mimeType,
        attachmentId: part.body.attachmentId,
        size: part.body.size,
      });
    }

    if (part.parts && part.parts.length > 0) {
      part.parts.forEach(walkParts);
    }
  };

  walkParts(payload);

  return extracted;
};

// Basic route response
exports.fetchEmails = async (req, res) => {
  res.status(200).json({
    message: "Background sync launched successfully!",
  });
};

// Get All Emails
exports.getAllEmails = async (req, res) => {
  try {
    const emails = await Email.find({ user: req.user.id })
      .populate("matchedScenarios")
      .sort({ createdAt: -1 });

    res.status(200).json(emails);
  } catch (err) {
    console.error("Failed to get emails:", err);
    res.status(500).json({ message: "Failed to get emails" });
  }
};

// Spam Emails
exports.getSpamEmails = async (req, res) => {
  try {
    const emails = await Email.find({
      user: req.user.id,
      category: "spam",
    })
      .populate("matchedScenarios")
      .sort({ createdAt: -1 });

    res.status(200).json(emails);
  } catch (err) {
    console.error("Failed to get spam emails:", err);
    res.status(500).json({ message: "Failed to get spam emails" });
  }
};

// Important Emails
// These are emails matched by the active scenario.
// scenarioController.js changes category to "important".
exports.getImportantEmails = async (req, res) => {
  try {
    const emails = await Email.find({
      user: req.user.id,
      category: "important",
    })
      .populate("matchedScenarios")
      .sort({ createdAt: -1 });

    res.status(200).json(emails);
  } catch (err) {
    console.error("Failed to get important emails:", err);
    res.status(500).json({ message: "Failed to get important emails" });
  }
};

// Remaining Emails
// These are emails that are not spam and not matched by current scenario.
exports.getRemainingEmails = async (req, res) => {
  try {
    const emails = await Email.find({
      user: req.user.id,
      category: { $nin: ["spam", "important"] },
      matchedScenarios: { $size: 0 },
    })
      .populate("matchedScenarios")
      .sort({ createdAt: -1 });

    res.status(200).json(emails);
  } catch (err) {
    console.error("Failed to get remaining emails:", err);
    res.status(500).json({ message: "Failed to get remaining emails" });
  }
};

// Scenario Emails
exports.getEmailsByScenario = async (req, res) => {
  try {
    const emails = await Email.find({
      user: req.user.id,
      matchedScenarios: req.params.id,
    })
      .populate("matchedScenarios")
      .sort({ createdAt: -1 });

    res.status(200).json(emails);
  } catch (err) {
    console.error("Scenario mail fetch error:", err);
    res.status(500).json({ message: "Failed to get scenario emails" });
  }
};

// Sync Gmail emails in background with pagination and attachments
exports.syncEmailsInBackground = async (userId, tokens) => {
  try {
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "postmessage"
    );

    oAuth2Client.setCredentials(tokens);

    const gmail = google.gmail({
      version: "v1",
      auth: oAuth2Client,
    });

    // For demo, 500 is faster.
    // For full sync, 2000 or 2500 can be used.
    const MAX_EMAILS_TO_SYNC = 2500;
    const PAGE_SIZE = 500;

    let allMessages = [];
    let pageToken = null;

    console.log("📩 Gmail background sync started...");

    do {
      const remaining = MAX_EMAILS_TO_SYNC - allMessages.length;

      if (remaining <= 0) break;

      const response = await gmail.users.messages.list({
        userId: "me",
        maxResults: Math.min(PAGE_SIZE, remaining),
        pageToken: pageToken || undefined,
        includeSpamTrash: true,
      });

      const messages = response.data.messages || [];

      allMessages = allMessages.concat(messages);
      pageToken = response.data.nextPageToken || null;

      console.log(`Fetched ${allMessages.length} email IDs so far...`);
    } while (pageToken && allMessages.length < MAX_EMAILS_TO_SYNC);

    console.log(`Total Gmail email IDs fetched: ${allMessages.length}`);

    let savedCount = 0;
    let skippedCount = 0;

    const uploadDir = path.join(__dirname, "..", "uploads", "attachments");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    for (let msg of allMessages) {
      const exists = await Email.findOne({
        user: userId,
        messageId: msg.id,
      });

      if (exists) {
        skippedCount++;
        continue;
      }

      const emailData = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
        format: "full",
      });

      const payload = emailData.data.payload || {};
      const headers = payload.headers || [];

      const subject =
        headers.find((h) => h.name === "Subject")?.value || "";

      const from =
        headers.find((h) => h.name === "From")?.value || "";

      const snippet = emailData.data.snippet || "";
      const labels = emailData.data.labelIds || [];

      // Only spam is categorized from Gmail labels.
      // Other emails remain "other" until scenario matching marks them important.
      const category = categorizeEmail(labels);

      const body = extractEmailBody(payload);

      const foundAttachments = extractAttachments(payload);

      let attachmentsData = [];

      for (let att of foundAttachments) {
        try {
          const attachmentData = await gmail.users.messages.attachments.get({
            userId: "me",
            messageId: msg.id,
            id: att.attachmentId,
          });

          const base64Data = attachmentData.data.data
            .replace(/-/g, "+")
            .replace(/_/g, "/");

          const buffer = Buffer.from(base64Data, "base64");

          const safeFileName = att.filename.replace(/[<>:"/\\|?*]/g, "_");
          const uniqueFilename = `${msg.id}-${safeFileName}`;
          const filePath = path.join(uploadDir, uniqueFilename);

          fs.writeFileSync(filePath, buffer);

          attachmentsData.push({
            filename: att.filename,
            mimeType: att.mimeType,
            size: att.size,
            path: filePath,
          });
        } catch (attErr) {
          console.error(
            `Failed to download attachment ${att.filename}:`,
            attErr.message
          );
        }
      }

      await Email.create({
        user: userId,
        messageId: msg.id,
        subject,
        from,
        snippet,
        body,
        labels,
        category,
        attachments: attachmentsData,
      });

      savedCount++;
    }

    console.log("✅ Gmail background sync completed");
    console.log(`Saved new emails: ${savedCount}`);
    console.log(`Skipped existing emails: ${skippedCount}`);
  } catch (err) {
    console.error("Background sync failed:", err);
  }
};