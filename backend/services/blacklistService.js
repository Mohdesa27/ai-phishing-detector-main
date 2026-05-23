const fs = require("fs");
const path = require("path");

// Set is O(1) lookup — faster than array includes()
let blacklist = new Set();

// ✅ Extract clean domain from any URL
const getDomain = (url) => {
  try {
    const parsed = new URL(url.startsWith("http") ? url : "https://" + url);
    return parsed.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return url.toLowerCase().replace(/^www\./, "");
  }
};

// ✅ Load blacklist.json ONCE on server start
const loadBlacklist = () => {
  try {
    const filePath = path.join(__dirname, "../data/blacklist.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const list = JSON.parse(raw);

    list.forEach((entry) => {
      const domain = getDomain(entry.trim());
      if (domain) blacklist.add(domain);
    });

    console.log(`🚨 Blacklist loaded: ${blacklist.size} domains`);
  } catch (err) {
    console.error("❌ Blacklist load error:", err.message);
  }
};

// ✅ Check if URL domain is in blacklist
const checkBlacklist = (url) => {
  const domain = getDomain(url);
  console.log("🔍 Blacklist check for domain:", domain);

  if (blacklist.has(domain)) {
    console.log("🚨 BLACKLIST MATCH:", domain);
    return { matched: true, confidence: 0.95, source: "blacklist" };
  }

  return null;
};

module.exports = checkBlacklist;
module.exports.loadBlacklist = loadBlacklist;
