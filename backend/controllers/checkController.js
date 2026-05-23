const getMLPrediction = require("../services/mlService");
const checkBlacklist = require("../services/blacklistService");
const { checkDataset } = require("../services/datasetService");
const Scan = require("../models/Scan");

const checkURL = async (req, res) => {
  try {
    const url = req.body.url;

    if (!url || typeof url !== "string") {
      return res.status(400).json({
        success: false,
        result: "Invalid",
        score: 0,
        message: "No URL provided"
      });
    }

    // ✅ Normalize URL
    const fixedURL = url.startsWith("http") ? url.trim() : "https://" + url.trim();
    console.log("🔍 Checking URL:", fixedURL);

    // ─────────────────────────────────────────────
    // 1️⃣  BLACKLIST CHECK (blacklist.json — fast)
    // ─────────────────────────────────────────────
    const blacklistResult = checkBlacklist(fixedURL);

    if (blacklistResult && blacklistResult.matched) {
      await Scan.create({
        url: fixedURL,
        result: "Suspicious",
        score: blacklistResult.confidence,
        source: "blacklist",
        checkedAt: new Date()
      });

      return res.json({
        success: true,
        result: "Suspicious ⚠️",
        score: blacklistResult.confidence,
        source: "blacklist",
        message: "URL matched known phishing blacklist"
      });
    }

    // ─────────────────────────────────────────────
    // 2️⃣  DATASET CHECK (phishing_site_urls.csv)
    // ─────────────────────────────────────────────
    const datasetResult = checkDataset(fixedURL);

    if (datasetResult && datasetResult.matched) {
      await Scan.create({
        url: fixedURL,
        result: "Suspicious",
        score: datasetResult.confidence,
        source: "dataset",
        checkedAt: new Date()
      });

      return res.json({
        success: true,
        result: "Suspicious ⚠️",
        score: datasetResult.confidence,
        source: "dataset",
        message: "URL matched phishing dataset"
      });
    }

    // ─────────────────────────────────────────────
    // 3️⃣  ML MODEL + RULE-BASED CHECK
    // ─────────────────────────────────────────────
    const mlResult = await getMLPrediction(fixedURL);

    const resultText = mlResult.prediction === 1 ? "Phishing 🚨" : "Safe ✅";

    await Scan.create({
      url: fixedURL,
      result: resultText.includes("Phishing") ? "Phishing" : "Safe",
      score: mlResult.confidence,
      source: mlResult.source,
      checkedAt: new Date()
    });

    return res.json({
      success: true,
      result: resultText,
      score: mlResult.confidence,
      source: mlResult.source
    });

  } catch (error) {
    console.error("❌ checkURL Error:", error);
    res.status(500).json({
      success: false,
      result: "Error",
      score: 0,
      message: "Internal server error"
    });
  }
};

// ✅ Get scan history
const getScanHistory = async (req, res) => {
  try {
    const scans = await Scan.find()
      .sort({ checkedAt: -1 })
      .limit(50);

    res.json({ success: true, data: scans });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { checkURL, getScanHistory };
