import pandas as pd
import os

print("🔄 Combining datasets...")

frames = []

# ─────────────────────────────────────────
# 1. PHISHTANK DATA (online-valid.csv)
# ─────────────────────────────────────────
phishtank_path = "data/online-valid.csv"
if os.path.exists(phishtank_path):
    phishtank = pd.read_csv(phishtank_path)
    # Column 1 (index 1) is the URL in PhishTank format
    df_phish1 = pd.DataFrame({
        "url": phishtank.iloc[:, 1].astype(str),
        "label": 1
    })
    frames.append(df_phish1)
    print(f"✅ PhishTank: {len(df_phish1)} entries")
else:
    print("⚠️  PhishTank data not found, skipping")

# ─────────────────────────────────────────
# 2. KAGGLE PHISHING DATA (phishing_site_urls.csv)
# ─────────────────────────────────────────
kaggle_path = "data/phishing_site_urls.csv"
if os.path.exists(kaggle_path):
    kaggle = pd.read_csv(kaggle_path)
    kaggle.columns = [c.lower() for c in kaggle.columns]

    url_col = kaggle.columns[0]
    label_col = kaggle.columns[1]

    # Normalize labels → 0/1
    kaggle["label_num"] = kaggle[label_col].apply(
        lambda x: 1 if str(x).lower() in ["bad", "1", "phishing"] else 0
    )

    df_phish2 = pd.DataFrame({
        "url": kaggle[url_col].astype(str),
        "label": kaggle["label_num"]
    })

    frames.append(df_phish2)
    print(f"✅ Kaggle: {len(df_phish2)} entries")
else:
    print("⚠️  Kaggle data not found, skipping")

# ─────────────────────────────────────────
# 3. SAFE URLS (top-1m.csv)
# ─────────────────────────────────────────
safe_path = "data/top-1m.csv"
if os.path.exists(safe_path):
    safe = pd.read_csv(safe_path, header=None, names=["rank", "domain"], nrows=5000)
    safe_urls = "https://" + safe["domain"].astype(str)

    df_safe = pd.DataFrame({
        "url": safe_urls,
        "label": 0
    })

    frames.append(df_safe)
    print(f"✅ Safe URLs: {len(df_safe)} entries")
else:
    print("⚠️  Safe URL data not found, skipping")

# ─────────────────────────────────────────
# COMBINE & CLEAN
# ─────────────────────────────────────────
if not frames:
    print("❌ No data found! Check your data/ folder.")
    exit(1)

dataset = pd.concat(frames, ignore_index=True)

# Drop rows where URL is not a real URL (numeric IDs, empty rows)
dataset = dataset[dataset["url"].str.contains(r"\.", na=False)]
dataset = dataset[~dataset["url"].str.match(r"^\d+$")]

dataset = dataset.drop_duplicates(subset=["url"])
dataset = dataset.dropna()
dataset = dataset.sample(frac=1, random_state=42).reset_index(drop=True)

dataset.to_csv("dataset_urls.csv", index=False)
print(f"\n✅ Combined dataset saved: {len(dataset)} total URLs")
print(f"   Phishing: {dataset['label'].sum()} | Safe: {(dataset['label'] == 0).sum()}")
