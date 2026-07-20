const Scenario = require("../models/scenarioModel");
const Email = require("../models/emailModel");
const fs = require("fs");
const pdfParse = require("pdf-parse");

// Get all scenarios of logged-in user
exports.getScenarios = async (req, res) => {
  try {
    const scenarios = await Scenario.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: scenarios.length,
      data: scenarios,
    });
  } catch (error) {
    console.error("Fetch Scenarios Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Create new scenario
exports.createScenario = async (req, res) => {
  try {
    const { name, keywords } = req.body;

    const keywordArray = keywords
      .split(",")
      .map((k) => k.trim().toLowerCase())
      .filter((k) => k.length > 0);

    // Step 1: Delete previous scenarios of this user
    await Scenario.deleteMany({ user: req.user.id });

    // Step 2: Reset old important/matched emails back to remaining
    // Spam emails will stay spam
    await Email.updateMany(
      { user: req.user.id, category: { $ne: "spam" } },
      {
        $set: {
          matchedScenarios: [],
          category: "other",
        },
      }
    );

    // Step 3: Save latest active scenario
    const scenario = await Scenario.create({
      user: req.user.id,
      name,
      keywords: keywordArray,
    });

    res.status(201).json({
      success: true,
      data: scenario,
      message:
        "Scenario saved. Previous results cleared. Background sweep initiated.",
    });

    // Step 4: Start fresh scenario matching
    retroactiveSweep(scenario, req.user.id);
  } catch (error) {
    console.error("Create Scenario Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Clean text
const normalizeText = (text = "") => {
  return text
    .toLowerCase()
    .replace(/\bintership\b/g, "internship")
    .replace(/\bcgpa\b/g, "gpa")
    .replace(/[^a-z0-9.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

// Extract GPA values from email/scenario text
const extractGpaValues = (text = "") => {
  const values = [];
  const clean = normalizeText(text);

  const patterns = [
    /(?:gpa|cgpa)\s*(?:is|=|:|above|greater than|at least|minimum|min)?\s*([0-4](?:\.\d{1,2})?)/gi,
    /([0-4](?:\.\d{1,2})?)\s*(?:gpa|cgpa)/gi,
  ];

  for (const pattern of patterns) {
    let match;

    while ((match = pattern.exec(clean)) !== null) {
      const num = parseFloat(match[1]);

      if (!Number.isNaN(num) && num >= 0 && num <= 4) {
        values.push(num);
      }
    }
  }

  return values;
};

// Extract required GPA from scenario
const extractRequiredGpa = (text = "") => {
  const values = extractGpaValues(text);
  return values.length > 0 ? values[0] : null;
};

// Main scenario matching function
const retroactiveSweep = async (scenario, userId) => {
  try {
    console.log(`Starting background sweep for Scenario: ${scenario.name}`);

    // Do not scan spam emails
    const emails = await Email.find({
      user: userId,
      category: { $ne: "spam" },
    });

    const stopWords = new Set([
      "i",
      "me",
      "my",
      "we",
      "you",
      "your",
      "need",
      "want",
      "wants",
      "find",
      "show",
      "get",
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "if",
      "for",
      "with",
      "is",
      "are",
      "was",
      "were",
      "to",
      "from",
      "in",
      "on",
      "at",
      "of",
      "by",
      "all",
      "emails",
      "email",
      "about",
      "such",
      "which",
      "student",
      "students",
      "candidate",
      "candidates",
      "required",
      "requirement",
      "looking",
    ]);

    const rawPrompt = normalizeText(
      `${scenario.name} ${scenario.keywords.join(" ")}`
    );

    const requiredGpa = extractRequiredGpa(rawPrompt);

    // This supports normal words and registration numbers like 22MDBCS199
    let promptTokens = rawPrompt.match(/[a-z0-9.]+/g) || [];

    promptTokens = [
      ...new Set(
        promptTokens.filter((word) => {
          if (stopWords.has(word)) return false;

          // If GPA condition exists, do not treat "gpa" or the GPA number as normal keyword
          if (requiredGpa !== null) {
            if (word === "gpa" || word === "cgpa") return false;
            if (/^[0-4](\.\d{1,2})?$/.test(word)) return false;
          }

          return word.length >= 3 || ["cv", "hr", "cs"].includes(word);
        })
      ),
    ];

    console.log(`Required GPA: ${requiredGpa ?? "No GPA condition"}`);
    console.log(`Strong keywords: [${promptTokens.join(", ")}]`);

    let matchedCount = 0;

    for (let email of emails) {
      let extractionBuffer = `${email.subject || ""} ${email.snippet || ""} ${
        email.body || ""
      }`;

      // Include attachment file names and PDF text if available
      if (email.attachments && email.attachments.length > 0) {
        for (let file of email.attachments) {
          extractionBuffer += ` ${file.filename || ""} `;

          if (file.filename && file.filename.toLowerCase().endsWith(".pdf")) {
            try {
              if (file.path && fs.existsSync(file.path)) {
                const dataBuffer = fs.readFileSync(file.path);
                const parsed = await pdfParse(dataBuffer);
                extractionBuffer += ` ${parsed.text || ""} `;
              }
            } catch (err) {
              console.log("PDF parse skipped for:", file.filename, err.message);
            }
          }
        }
      }

      const cleanEmailText = normalizeText(extractionBuffer);

      // This also supports registration numbers like 22MDBCS199
      const emailTokens = new Set(cleanEmailText.match(/[a-z0-9.]+/g) || []);

      const emailGpas = extractGpaValues(cleanEmailText);

      const gpaMatched =
        requiredGpa === null || emailGpas.some((gpa) => gpa >= requiredGpa);

      const hits = promptTokens.filter((token) => emailTokens.has(token));

      let requiredHits = 0;

      if (promptTokens.length === 0) {
        requiredHits = 0;
      } else if (promptTokens.length <= 2) {
        requiredHits = promptTokens.length;
      } else {
        requiredHits = Math.max(2, Math.ceil(promptTokens.length * 0.6));
      }

      const keywordMatched =
        promptTokens.length === 0 || hits.length >= requiredHits;

      if (gpaMatched && keywordMatched) {
        email.matchedScenarios.push(scenario._id);

        // Main update:
        // Scenario matched emails will appear in Important Emails section
        email.category = "important";

        await email.save();
        matchedCount++;
      }
    }

    console.log(
      `Background sweep completed. Correctly flagged ${matchedCount} emails for ${scenario.name}`
    );
  } catch (err) {
    console.error("Failed retro sweep:", err);
  }
};