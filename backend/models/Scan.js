const mongoose = require("mongoose");

const scanSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  result: {
    type: String,
    enum: ["Safe", "Phishing", "Suspicious"],
    required: true
  },
  score: {
    type: Number,
    min: 0,
    max: 1
  },
  source: {
    type: String,
    enum: ["blacklist", "dataset", "ml_model", "rules"],
    default: "rules"
  },
  checkedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Scan", scanSchema);
