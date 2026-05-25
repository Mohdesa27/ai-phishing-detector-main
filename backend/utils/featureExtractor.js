function extractFeatures(url) {
  return {
    urlLength: url.length,
    hasAtSymbol: url.includes("@") ? 1 : 0,
    dotCount: (url.match(/\./g) || []).length,
    hasIP: /(\d{1,3}\.){3}\d{1,3}/.test(url) ? 1 : 0,
    hasLoginKeyword: /login|verify|account|signin|secure|confirm/i.test(url) ? 1 : 0,
    hasHttps: url.startsWith("https") ? 1 : 0,
    hasDash: url.includes("-") ? 1 : 0,
    subdomainCount: Math.max(0, url.split(".").length - 2),
    suspiciousWords: /secure|update|bank|free|bonus|credential|password/i.test(url) ? 1 : 0
  };
}

module.exports = extractFeatures;
