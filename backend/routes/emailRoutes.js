// const express = require("express");
// const router = express.Router();
// const Email = require("../models/Email");

// router.post("/submit", async (req, res) => {
//   try {
//     const { content } = req.body;

//     if (!content || !content.trim()) {
//       return res.status(400).json({ error: "Email content is required" });
//     }

//     const newEmail = new Email({ content: content.trim() });
//     await newEmail.save();

//     res.status(201).json({ success: true, message: "Email stored successfully" });
//   } catch (error) {
//     console.error("❌ Email submit error:", error);
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const Email = require("../models/Email");

// ✅ Phishing keywords commonly found in phishing emails
const PHISHING_KEYWORDS = [
  "verify your account", "confirm your password", "update your billing",
  "click here to login", "your account has been suspended", "unusual activity",
  "enter your credentials", "reset your password immediately",
  "you have won", "claim your prize", "urgent action required",
  "your account will be closed", "verify your identity", "bank account",
  "credit card details", "social security", "wire transfer",
  "nigerian prince", "lottery winner", "free gift", "act now",
  "limited time offer", "verify now", "confirm your email",
  "suspended account", "unauthorized access", "security alert"
];

// ✅ Analyze email content for phishing signals
const analyzeEmail = (content) => {
  const lower = content.toLowerCase();
  const matchedKeywords = PHISHING_KEYWORDS.filter(kw => lower.includes(kw));

  const score = Math.min(matchedKeywords.length * 0.15, 0.95);
  const isPhishing = score > 0.3;

  return {
    isPhishing,
    score: isPhishing ? score : 0.1,
    matchedKeywords,
    result: isPhishing ? "Suspicious ⚠️" : "Safe ✅"
  };
};

router.post("/submit", async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Email content is required" });
    }

    // ✅ Analyze before storing
    const analysis = analyzeEmail(content.trim());

    const newEmail = new Email({
      content: content.trim(),
      status: analysis.isPhishing ? "flagged" : "pending"
    });

    await newEmail.save();

    res.status(201).json({
      success: true,
      message: "Email analyzed successfully",
      result: analysis.result,
      score: analysis.score,
      matchedKeywords: analysis.matchedKeywords,
      isPhishing: analysis.isPhishing
    });

  } catch (error) {
    console.error("❌ Email submit error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;