const BACKEND_URL = "http://localhost:5000/api/check";

// ✅ Extension never scans these — backend already whitelists them
// but this saves unnecessary API calls
const TRUSTED_HOSTS = new Set([
  "google.com", "youtube.com", "facebook.com", "twitter.com", "x.com",
  "instagram.com", "linkedin.com", "microsoft.com", "apple.com",
  "amazon.com", "netflix.com", "github.com", "stackoverflow.com",
  "wikipedia.org", "reddit.com", "gmail.com", "outlook.com",
  "yahoo.com", "bing.com", "dropbox.com", "zoom.us", "slack.com",
  "whatsapp.com", "telegram.org", "discord.com", "twitch.tv",
  "adobe.com", "cloudflare.com", "wordpress.com", "shopify.com",
  "accounts.google.com", "mail.google.com", "drive.google.com"
]);

const getDomain = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
};

const isTrusted = (url) => {
  const domain = getDomain(url);
  // Check exact match AND parent domain match
  // e.g. mail.google.com → google.com is trusted
  return TRUSTED_HOSTS.has(domain) ||
    [...TRUSTED_HOSTS].some(h => domain.endsWith("." + h));
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const url = tab.url;

    // Skip non-HTTP pages
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      console.log("⏭️ Skipping non-HTTP URL:", url);
      return;
    }

    // ✅ Skip trusted hosts — no need to scan Google, YouTube etc.
    if (isTrusted(url)) {
      console.log("✅ Trusted host, skipping scan:", getDomain(url));
      return;
    }

    fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("📡 API Response:", data);

        // ✅ Only notify for actual threats
        if (data.result && (data.result.includes("Phishing") || data.result.includes("Suspicious"))) {
          const isSuspicious = data.result.includes("Suspicious");

          chrome.notifications.create(`alert-${tabId}`, {
            type: "basic",
            iconUrl: "icon.png",
            title: isSuspicious ? "⚠️ Suspicious Website" : "🚨 Phishing Detected",
            message: isSuspicious
              ? "This URL matched a known phishing blacklist!"
              : "This website has been identified as a phishing attempt!",
            priority: 2
          });
        }

        // ✅ Send result to popup
        chrome.runtime.sendMessage({
          result: data.result,
          score: data.score,
          source: data.source,
          url: url
        }).catch(() => {});
      })
      .catch((err) => {
        console.error("❌ Backend connection error:", err);
      });
  }
});