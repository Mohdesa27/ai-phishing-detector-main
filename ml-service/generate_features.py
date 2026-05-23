import pandas as pd
from feature_generator import extract_features

print("🔄 Generating features from dataset_urls.csv...")

data = pd.read_csv("dataset_urls.csv")

# Drop rows with missing URLs or labels
data = data.dropna(subset=["url", "label"])

# Drop corrupt rows (URLs that are just numbers)
data = data[data["url"].astype(str).str.contains(r"\.", na=False)]

feature_list = []
skipped = 0

for url in data["url"]:
    try:
        features = extract_features(str(url))
        feature_list.append(features)
    except Exception as e:
        feature_list.append({
            "url_length": 0, "dot_count": 0, "https": 0,
            "special_char_count": 0, "digit_count": 0,
            "has_ip": 0, "path_length": 0
        })
        skipped += 1

features_df = pd.DataFrame(feature_list)
features_df["label"] = data["label"].values

# ✅ Normalize labels to integers only (fix mixed bad/good/0/1)
features_df["label"] = features_df["label"].apply(
    lambda x: 1 if str(x).lower() in ["bad", "1", "phishing"] else 0
)

features_df.to_csv("dataset_features.csv", index=False)

print(f"✅ Features saved: {len(features_df)} rows")
print(f"   Skipped: {skipped} | Phishing: {features_df['label'].sum()} | Safe: {(features_df['label'] == 0).sum()}")
