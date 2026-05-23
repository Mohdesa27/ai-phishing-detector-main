const fs = require("fs");
const path = require("path");

let phishingDomains = new Set();
let phishingUrls = new Set();

// ✅ Trusted domains — well-known legitimate websites
const TRUSTED_DOMAINS = new Set([
  "google.com", "youtube.com", "facebook.com", "twitter.com", "x.com",
  "instagram.com", "linkedin.com", "microsoft.com", "apple.com",
  "amazon.com", "netflix.com", "github.com", "stackoverflow.com",
  "wikipedia.org", "reddit.com", "gmail.com", "outlook.com",
  "yahoo.com", "bing.com", "dropbox.com", "zoom.us", "slack.com",
  "whatsapp.com", "telegram.org", "discord.com", "twitch.tv",
  "adobe.com", "cloudflare.com", "wordpress.com", "shopify.com"
]);

// ✅ Keywords that indicate a suspicious path even on trusted domains
const SUSPICIOUS_PATH_KEYWORDS = [
  "login", "verify", "account", "secure", "update", "confirm",
  "bank", "password", "signin", "credential", "validate", "authenticate",
  "recover", "unlock", "billing", "payment", "submit", "authorize"
];

// ✅ Extract clean domain from any URL
const getDomain = (url) => {
  try {
    const fullUrl = url.startsWith("http") ? url : "https://" + url;
    const parsed = new URL(fullUrl);
    return parsed.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return url.toLowerCase().replace(/^www\./, "").split("/")[0];
  }
};

// ✅ Check if URL path contains suspicious keywords
const hasSuspiciousPath = (url) => {
  return SUSPICIOUS_PATH_KEYWORDS.some((keyword) =>
    url.toLowerCase().includes(keyword)
  );
};

// ✅ Load phishing_site_urls.csv — format: URL,Label
const loadDataset = () => {
  try {
    const filePath = path.join(
      __dirname,
      "../../ml-service/data/phishing_site_urls.csv"
    );

    const data = fs.readFileSync(filePath, "utf-8");
    const lines = data.split("\n");

    // Skip header row
    lines.slice(1).forEach((line) => {
      const parts = line.trim().split(",");
      const label = parts[parts.length - 1]?.toLowerCase();
      const url = parts.slice(0, parts.length - 1).join(",").trim().toLowerCase();

      if (!url || url === "url") return;

      if (label === "bad" || label === "1") {
        const domain = getDomain(url);

        // ✅ Never add trusted domains to phishing list
        if (!TRUSTED_DOMAINS.has(domain)) {
          phishingUrls.add(url);
          phishingDomains.add(domain);
        }
      }
    });

    console.log(`✅ Dataset loaded: ${phishingUrls.size} phishing URLs, ${phishingDomains.size} domains`);
  } catch (err) {
    console.error("❌ Dataset load error:", err.message);
  }
};

// ✅ Check URL against dataset — 3 levels of matching
const checkDataset = (url) => {
  const cleanUrl = url.toLowerCase().trim();
  const domain = getDomain(cleanUrl);

  // ─────────────────────────────────────────────────────
  // TRUSTED DOMAIN HANDLING
  // Even trusted domains can be used in phishing attacks
  // e.g. google.com/login/verify-account is suspicious
  // ─────────────────────────────────────────────────────
  if (TRUSTED_DOMAINS.has(domain)) {
    if (hasSuspiciousPath(cleanUrl)) {
      // Trusted domain BUT suspicious path — flag it
      console.log("⚠️ Trusted domain with suspicious path:", cleanUrl);
      return { matched: true, confidence: 0.75, source: "dataset" };
    }

    // Truly clean trusted domain — safe
    console.log("✅ Trusted domain, skipping dataset check:", domain);
    return null;
  }

  // ─────────────────────────────────────────────────────
  // Level 1: Exact full URL match
  // ─────────────────────────────────────────────────────
  if (phishingUrls.has(cleanUrl)) {
    console.log("🚨 DATASET MATCH (full URL):", cleanUrl);
    return { matched: true, confidence: 0.99, source: "dataset" };
  }

  // ─────────────────────────────────────────────────────
  // Level 2: Exact domain match
  // ─────────────────────────────────────────────────────
  if (phishingDomains.has(domain)) {
    console.log("🚨 DATASET MATCH (domain):", domain);
    return { matched: true, confidence: 0.97, source: "dataset" };
  }

  // ─────────────────────────────────────────────────────
  // Level 3: Partial match
  // Known phishing domain appears inside submitted URL
  // Min length 6 to avoid short false matches
  // ─────────────────────────────────────────────────────
// ✅ NEW — only match real subdomains, not random substrings
for (let phishDomain of phishingDomains) {
  if (phishDomain.length > 10 && domain.endsWith("." + phishDomain)) {
    console.log("🚨 DATASET MATCH (subdomain):", phishDomain);
    return { matched: true, confidence: 0.90, source: "dataset" };
  }
}

  return null;
};

module.exports = { loadDataset, checkDataset };