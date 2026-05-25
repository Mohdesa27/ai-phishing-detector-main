const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "reviewed", "flagged"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Email", emailSchema);
