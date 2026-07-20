const express = require("express");
const router = express.Router();

const {
  fetchEmails,
  getAllEmails,
  getSpamEmails,
  getImportantEmails,
  getRemainingEmails,
  getEmailsByScenario,
} = require("../controllers/emailController");

const { protect } = require("../middleware/authMiddleware");

// Email routes
router.get("/fetch", protect, fetchEmails);
router.get("/all", protect, getAllEmails);
router.get("/spam", protect, getSpamEmails);
router.get("/important", protect, getImportantEmails);
router.get("/remaining", protect, getRemainingEmails);
router.get("/scenario/:id", protect, getEmailsByScenario);

module.exports = router;