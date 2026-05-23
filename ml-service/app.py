from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
import os
from feature_generator import extract_features

app = FastAPI()

# ✅ Allow requests from Node backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# ✅ Load model — graceful failure if model not trained yet
model = None
MODEL_PATH = "model.pkl"

if os.path.exists(MODEL_PATH):
    try:
        model = joblib.load(MODEL_PATH)
        print("✅ Model loaded successfully")
    except Exception as e:
        print(f"❌ Model load failed: {e}")
else:
    print("⚠️  model.pkl not found — run train_model.py first")


@app.get("/")
def root():
    return {"status": "ML service running", "model_loaded": model is not None}


@app.post("/predict")
def predict(data: dict):
    url = data.get("url", "").strip()

    if not url:
        return {"url": url, "prediction": 0, "error": "No URL provided"}

    if model is None:
        return {"url": url, "prediction": 0, "error": "Model not loaded"}

    try:
        features = extract_features(url)

        input_data = np.array([[
            features["url_length"],
            features["dot_count"],
            features["https"],
            features["special_char_count"],
            features["digit_count"],
            features["has_ip"],
            features["path_length"]
        ]])

        raw_prediction = model.predict(input_data)[0]

        # ✅ Normalize mixed label types (bad/good/0/1)
        if str(raw_prediction).lower() in ["bad", "1", "phishing"]:
            prediction = 1
        else:
            prediction = 0

        return {
            "url": url,
            "prediction": prediction
        }

    except Exception as e:
        print(f"❌ Prediction error: {e}")
        return {"url": url, "prediction": 0, "error": str(e)}
