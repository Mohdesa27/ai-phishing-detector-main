// ✅ mlService.js — calls Python FastAPI with rule-based fallback

const ML_SERVICE_URL = "http://127.0.0.1:8000/predict";
const ML_TIMEOUT_MS = 3000; // 3 second timeout

// ✅ Suspicious keywords for rule-based detection
const SUSPICIOUS_WORDS = [
  "login", "verify", "secure", "account", "bank",
  "update", "free", "bonus", "offer", "click",
  "confirm", "password", "signin", "ebayisapi",
  "webscr", "paypal", "credential"
];

const SUSPICIOUS_TLDS = [".xyz", ".tk", ".ml", ".ga", ".cf", ".gq"];

// ✅ Rule-based fallback
const ruleBasedCheck = (url) => {
  const lower = url.toLowerCase();
  let score = 0;

  // Keyword check
  for (const word of SUSPICIOUS_WORDS) {
    if (lower.includes(word)) {
      score += 0.2;
      break; // one match is enough to flag
    }
  }

  // Suspicious TLD
  for (const tld of SUSPICIOUS_TLDS) {
    if (lower.includes(tld)) score += 0.3;
  }

  // Long URL
  if (url.length > 100) score += 0.2;

  // Has IP address instead of domain
  if (/(\d{1,3}\.){3}\d{1,3}/.test(url)) score += 0.4;

  // Has @ symbol (URL obfuscation trick)
  if (url.includes("@")) score += 0.3;

  // Many subdomains
  const dotCount = (url.match(/\./g) || []).length;
  if (dotCount > 4) score += 0.2;

  const confidence = Math.min(score, 0.95);

  return {
    prediction: confidence > 0.4 ? 1 : 0,
    confidence: confidence > 0.4 ? confidence : 0.1,
    source: "rules"
  };
};

// ✅ Try calling Python ML service, fallback to rules if unavailable
const getMLPrediction = async (url) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), ML_TIMEOUT_MS);

    const response = await fetch(ML_SERVICE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    const data = await response.json();

    console.log("🧠 ML Service response:", data);

    return {
      prediction: data.prediction,
      confidence: data.prediction === 1 ? 0.92 : 0.15,
      source: "ml_model"
    };

  } catch (err) {
    // ML service not running — use rule-based fallback
    console.warn("⚠️ ML service unavailable, using rule-based fallback:", err.message);
    return ruleBasedCheck(url);
  }
};

module.exports = getMLPrediction;
