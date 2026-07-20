const mongoose = require('mongoose');

const scenarioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  keywords: {
    type: [String],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Scenario', scenarioSchema);
