const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Email = require("./models/emailModel");

const flushEmails = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const result = await Email.deleteMany({});
    console.log(`Successfully purged ${result.deletedCount} emails from the database.`);

    process.exit(0);
  } catch (error) {
    console.error("Flush Failed:", error);
    process.exit(1);
  }
};

flushEmails();
