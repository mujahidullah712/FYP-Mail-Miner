const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    messageId: {
      type: String,
      required: true,
      unique: true,
    },

    subject: {
      type: String,
      default: "",
    },

    from: {
      type: String,
      default: "",
    },

    snippet: {
      type: String,
      default: "",
    },

    body: {
      type: String,
      default: "",
    },

    labels: {
      type: [String],
      default: [],
    },

    category: {
      type: String,
      enum: ["all", "spam", "important", "other"],
      default: "other",
    },

    matchedScenarios: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Scenario",
      },
    ],

    attachments: [
      {
        filename: {
          type: String,
          default: "",
        },
        mimeType: {
          type: String,
          default: "",
        },
        size: {
          type: Number,
          default: 0,
        },
        path: {
          type: String,
          default: "",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Email", emailSchema);