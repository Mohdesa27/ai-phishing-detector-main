import re
from urllib.parse import urlparse


def extract_features(url: str) -> dict:
    """
    Extract numerical features from a URL for ML prediction.
    These features must match exactly what train_model.py expects.
    """
    features = {}

    # 1. Total URL length
    features["url_length"] = len(url)

    # 2. Number of dots
    features["dot_count"] = url.count(".")

    # 3. Has HTTPS
    features["https"] = 1 if url.startswith("https") else 0

    # 4. Special character count
    features["special_char_count"] = len(re.findall(r'[!@#$%^&*(),?":{}|<>]', url))

    # 5. Digit count
    features["digit_count"] = sum(c.isdigit() for c in url)

    # 6. Has IP address instead of domain
    features["has_ip"] = 1 if re.search(r"(\d{1,3}\.){3}\d{1,3}", url) else 0

    # 7. Path length
    try:
        parsed = urlparse(url if url.startswith("http") else "https://" + url)
        features["path_length"] = len(parsed.path)
    except Exception:
        features["path_length"] = 0

    return features
