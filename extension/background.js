const BACKEND_URL =
"https://ai-phishing-detector-main.onrender.com/api/check";

// ✅ Extension never scans these
const TRUSTED_HOSTS = new Set([
  "google.com",
  "youtube.com",
  "facebook.com",
  "twitter.com",
  "x.com",
  "instagram.com",
  "linkedin.com",
  "microsoft.com",
  "apple.com",
  "amazon.com",
  "netflix.com",
  "github.com",
  "stackoverflow.com",
  "wikipedia.org",
  "reddit.com",
  "gmail.com",
  "outlook.com",
  "yahoo.com",
  "bing.com",
  "dropbox.com",
  "zoom.us",
  "slack.com",
  "whatsapp.com",
  "telegram.org",
  "discord.com",
  "twitch.tv",
  "adobe.com",
  "cloudflare.com",
  "wordpress.com",
  "shopify.com",
  "accounts.google.com",
  "mail.google.com",
  "drive.google.com"
]);

const getDomain = (url) => {
  try {
    return new URL(url)
      .hostname
      .replace(/^www\./, "")
      .toLowerCase();
  } catch {
    return "";
  }
};

const isTrusted = (url) => {
  const domain = getDomain(url);

  return (
    TRUSTED_HOSTS.has(domain) ||
    [...TRUSTED_HOSTS].some(
      h => domain.endsWith("." + h)
    )
  );
};

chrome.tabs.onUpdated.addListener(
(tabId, changeInfo, tab) => {

  if (
    changeInfo.status === "complete" &&
    tab.url
  ) {

    const url = tab.url;

    // Skip non-http pages
    if (
      !url.startsWith("http://") &&
      !url.startsWith("https://")
    ) {

      console.log(
        "⏭️ Skipping:",
        url
      );

      return;
    }

    // Skip trusted domains
    if (isTrusted(url)) {

      console.log(
        "✅ Trusted:",
        getDomain(url)
      );

      return;
    }

    fetch(BACKEND_URL, {

      method: "POST",

      headers: {
        "Content-Type":
        "application/json"
      },

      body: JSON.stringify({
        url
      })

    })

    .then(res => res.json())

    .then(data => {

      console.log(
        "📡 API:",
        data
      );

      if (

        data.result &&

        (
          data.result.includes(
            "Phishing"
          ) ||

          data.result.includes(
            "Suspicious"
          )

        )

      ) {

        const suspicious =
        data.result.includes(
          "Suspicious"
        );

        chrome.notifications.create(
          `alert-${tabId}`,
          {

            type: "basic",

            iconUrl:
            "icon.png",

            title:
            suspicious
            ? "⚠️ Suspicious Website"
            : "🚨 Phishing Detected",

            message:
            suspicious
            ? "Known phishing pattern found."
            : "This website may be phishing.",

            priority: 2

          }
        );

      }

      chrome.runtime
      .sendMessage({

        result:
        data.result,

        score:
        data.score,

        source:
        data.source,

        url

      })

      .catch(() => {});

    })

    .catch(err => {

      console.error(
        "❌ Backend error:",
        err
      );

    });

  }

});