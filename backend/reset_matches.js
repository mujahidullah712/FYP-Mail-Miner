require("dotenv").config();
const mongoose = require("mongoose");
const Email = require("./models/emailModel");
const Scenario = require("./models/scenarioModel");

const reset = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Email.updateMany({}, { $set: { matchedScenarios: [] } });
    await Scenario.deleteMany({});

    console.log("✅ Old scenarios and wrong matches cleared successfully");

    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Reset failed:", err);
  }
};

reset();