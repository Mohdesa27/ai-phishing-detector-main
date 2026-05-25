import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
import joblib

print("🔄 Loading features...")
data = pd.read_csv("dataset_features.csv")

# ✅ Normalize labels — handle any mixed bad/good/0/1 left over
data["label"] = data["label"].apply(
    lambda x: 1 if str(x).lower() in ["bad", "1", "phishing"] else 0
)

data = data.dropna()

FEATURES = [
    "url_length",
    "dot_count",
    "https",
    "special_char_count",
    "digit_count",
    "has_ip",
    "path_length"
]

X = data[FEATURES]
y = data["label"]

print(f"📊 Dataset: {len(data)} rows | Phishing: {y.sum()} | Safe: {(y == 0).sum()}")

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ✅ Train RandomForest
print("🧠 Training model...")
model = RandomForestClassifier(
    n_estimators=100,
    max_depth=15,
    random_state=42,
    n_jobs=-1
)
model.fit(X_train, y_train)

# Evaluate
accuracy = model.score(X_test, y_test)
y_pred = model.predict(X_test)

print(f"\n✅ Accuracy: {accuracy:.4f}")
print("\n📋 Classification Report:")
print(classification_report(y_test, y_pred, target_names=["Safe", "Phishing"]))
print("📋 Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# Save
joblib.dump(model, "model.pkl")
print("\n✅ model.pkl saved — ready for app.py")
