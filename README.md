# 🔐 AI Phishing Detection System

A full-stack AI-powered phishing detection system that identifies whether a URL is **Safe ✅**, **Suspicious ⚠️**, or **Phishing 🚨** using a three-layer hybrid approach: blacklist matching, dataset lookup, and machine learning.

---

## 📌 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Detection Flow](#detection-flow)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Dataset Sources](#dataset-sources)
- [Features](#features)
- [Known Behaviours](#known-behaviours)
- [Authors](#authors)

---

## 🧠 Overview

This system detects phishing threats through four components working together:

| Component | Description |
|-----------|-------------|
| **Backend** | Node.js + Express REST API — handles URL scanning, stores results in MongoDB |
| **ML Service** | Python FastAPI — serves a trained RandomForest model for URL prediction |
| **Dashboard** | React web app — URL checker, scan history, email analyzer |
| **Extension** | Chrome extension — auto-scans every tab, shows popup alerts |

---

## 🏗️ Tech Stack

### Backend
- Node.js + Express.js
- MongoDB Atlas (via Mongoose)
- dotenv (environment config)

### ML Service
- Python 3.11
- FastAPI + Uvicorn
- Scikit-learn (RandomForestClassifier)
- Pandas, NumPy, Joblib

### Frontend — Dashboard
- React.js (Create React App)

### Frontend — Extension
- Chrome Extension (Manifest V3)
- React.js (built popup)

---

## 📂 Project Structure

```
project/
│
├── backend/
│   ├── controllers/
│   │   └── checkController.js       ← URL scan logic + scan history
│   ├── data/
│   │   └── blacklist.json           ← Hardcoded known phishing domains
│   ├── models/
│   │   ├── Email.js                 ← Email submission schema
│   │   └── Scan.js                  ← Scan result schema
│   ├── routes/
│   │   ├── checkRoutes.js           ← POST /api/check, GET /api/history
│   │   └── emailRoutes.js           ← POST /api/email/submit
│   ├── services/
│   │   ├── blacklistService.js      ← Loads + checks blacklist.json
│   │   ├── datasetService.js        ← Loads + checks phishing_site_urls.csv
│   │   └── mlService.js             ← Calls Python ML API, fallback to rules
│   ├── utils/
│   │   └── featureExtractor.js      ← URL feature extraction utility
│   ├── .env                         ← MONGO_URI (not committed to git)
│   └── server.js                    ← Express app entry point
│
├── ml-service/
│   ├── data/
│   │   ├── online-valid.csv         ← PhishTank verified phishing URLs
│   │   ├── phishing_site_urls.csv   ← Kaggle phishing dataset (549k URLs)
│   │   └── top-1m.csv              ← Tranco top 1M safe domains
│   ├── app.py                       ← FastAPI prediction endpoint
│   ├── combine_dataset.py           ← Merges all CSV sources into one
│   ├── feature_generator.py         ← URL feature extraction (single source)
│   ├── generate_features.py         ← Generates dataset_features.csv
│   ├── train_model.py               ← Trains + saves model.pkl
│   ├── dataset_urls.csv             ← Combined dataset (auto-generated)
│   ├── dataset_features.csv         ← Feature matrix (auto-generated)
│   ├── model.pkl                    ← Trained model (auto-generated)
│   └── requirements.txt             ← Python dependencies
│
├── extension/
│   ├── background.js                ← Auto-scans tabs, sends notifications
│   ├── manifest.json                ← Chrome extension config (Manifest V3)
│   ├── icon.png                     ← Extension icon
│   └── popup/
│       ├── package.json
│       ├── public/
│       │   └── index.html
│       ├── src/
│       │   ├── App.jsx              ← Popup UI (manual check + auto result)
│       │   └── index.js
│       └── build/                   ← Auto-generated after npm run build
│           └── index.html           ← Chrome loads this as popup
│
├── dashboard/
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js                   ← Dashboard UI (checker, history, email)
│       └── index.js
│
└── README.md
```

---

## 🔍 Detection Flow

Every URL goes through three layers in order:

```
URL submitted (Extension or Dashboard)
        │
        ▼
┌─────────────────────────────────────┐
│  Layer 1: Blacklist Check           │  ← blacklist.json (10 known domains)
│  Fast Set lookup — O(1)             │
└──────────────┬──────────────────────┘
               │ Match found?
               ├── YES → "Suspicious ⚠️" (confidence: 95%)
               │
               NO
               │
               ▼
┌─────────────────────────────────────┐
│  Layer 2: Dataset Check             │  ← phishing_site_urls.csv (114k URLs)
│  Full URL → Domain → Partial match  │
│  Trusted domain + suspicious path   │
└──────────────┬──────────────────────┘
               │ Match found?
               ├── YES → "Suspicious ⚠️" (confidence: 90–99%)
               │
               NO
               │
               ▼
┌─────────────────────────────────────┐
│  Layer 3: ML Model                  │  ← model.pkl via Python FastAPI
│  RandomForest on 7 URL features     │
│  Fallback: rule-based if offline    │
└──────────────┬──────────────────────┘
               │
               ├── prediction=1 → "Phishing 🚨"
               └── prediction=0 → "Safe ✅"
```

### Result Types

| Result | Color | Meaning |
|--------|-------|---------|
| `Safe ✅` | 🟢 Green | URL passed all checks |
| `Suspicious ⚠️` | 🟠 Orange | Matched blacklist or dataset |
| `Phishing 🚨` | 🔴 Red | ML model flagged as phishing |

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- Python 3.11
- MongoDB Atlas account
- Google Chrome

---

### 1️⃣ Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/phishingDB?retryWrites=true&w=majority
```

Start the backend:
```bash
npx nodemon server.js
```

✅ Expected output:
```
🚀 Server running on port 5000
✅ MongoDB connected
🚨 Blacklist loaded: 10 domains
✅ Dataset loaded: 114212 phishing URLs, 58828 domains
```

---

### 2️⃣ ML Service

#### First time only — train the model:

Place these files in `ml-service/data/`:
- `phishing_site_urls.csv` — from [Kaggle](https://www.kaggle.com/datasets/taruntiwarihp/phishing-site-urls)
- `online-valid.csv` — from [PhishTank](https://phishtank.org/developer_info.php)
- `top-1m.csv` — from [Tranco](https://tranco-list.eu)

Then run in order:
```bash
cd ml-service
py -3.11 -m pip install -r requirements.txt
py -3.11 combine_dataset.py
py -3.11 generate_features.py
py -3.11 train_model.py
```

✅ Expected training output:
```
✅ Accuracy: 0.8809
✅ model.pkl saved
```

#### Start ML service:
```bash
py -3.11 -m uvicorn app:app --reload --port 8000
```

✅ Expected output:
```
✅ Model loaded successfully
INFO: Uvicorn running on http://127.0.0.1:8000
```

---

### 3️⃣ Dashboard

```bash
cd dashboard
npm install
npm start
```

Opens at: `http://localhost:3000`

Dashboard has 3 tabs:
- **🔍 URL Checker** — scan any URL manually
- **📋 Scan History** — view all past scans from MongoDB
- **📧 Email Analyzer** — paste email body to detect phishing keywords

---

### 4️⃣ Chrome Extension

#### Build the popup:
```bash
cd extension/popup
npm install
npm run build
```

#### Load in Chrome:
1. Open Chrome → go to `chrome://extensions`
2. Enable **Developer Mode** (top right toggle)
3. Click **Load unpacked**
4. Select the `extension/` folder
5. Pin the extension from the 🧩 toolbar menu

The extension:
- **Auto-scans** every tab you open
- Shows a **notification** if a site is Suspicious or Phishing
- Popup allows **manual URL checking**

> After any code change to the popup, run `npm run build` again and click the 🔄 reload button on `chrome://extensions`.

---

### 5️⃣ Start Order (Every Session)

Open 4 separate terminals and run in this order:

```bash
# Terminal 1 — Backend
cd backend && npx nodemon server.js

# Terminal 2 — ML Service
cd ml-service && py -3.11 -m uvicorn app:app --reload --port 8000

# Terminal 3 — Dashboard
cd dashboard && npm start

# Terminal 4 — (nothing, extension runs in Chrome)
```

---

## 📡 API Endpoints

### `POST /api/check`
Scan a URL for phishing.

**Request:**
```json
{ "url": "https://example.com" }
```

**Response:**
```json
{
  "success": true,
  "result": "Suspicious ⚠️",
  "score": 0.95,
  "source": "blacklist",
  "message": "URL matched known phishing blacklist"
}
```

---

### `GET /api/history`
Get last 50 scan results from MongoDB.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "url": "https://testphish.com",
      "result": "Suspicious",
      "score": 0.95,
      "source": "blacklist",
      "checkedAt": "2026-04-07T10:30:00.000Z"
    }
  ]
}
```

---

### `POST /api/email/submit`
Analyze email content for phishing signals.

**Request:**
```json
{ "content": "Your account has been suspended. Verify your identity now." }
```

**Response:**
```json
{
  "success": true,
  "result": "Suspicious ⚠️",
  "score": 0.45,
  "isPhishing": true,
  "matchedKeywords": ["verify your identity", "account has been suspended"]
}
```

---

## 📊 Dataset Sources

| Dataset | Source | Size | Purpose |
|---------|--------|------|---------|
| `phishing_site_urls.csv` | Kaggle | ~549k URLs | Primary phishing dataset |
| `online-valid.csv` | PhishTank | ~56k URLs | Live verified phishing URLs |
| `top-1m.csv` | Tranco | Top 1M domains | Safe URL training data |
| `blacklist.json` | Manual | 10 domains | Fast exact-match blacklist |

**Combined training dataset:** 568,586 URLs
- Phishing: 170,746
- Safe: 397,840
- Model accuracy: **88.09%**

---

## ✨ Features

- 🔍 Three-layer URL detection (blacklist → dataset → ML)
- 🧠 RandomForest ML model trained on 568k URLs
- 🛡️ Trusted domain whitelist (Google, GitHub, etc.)
- ⚠️ Suspicious path detection on trusted domains (e.g. `google.com/login/verify`)
- 💾 All scan results stored in MongoDB Atlas
- 📊 Dashboard with real-time scan history
- 📧 Email phishing keyword analyzer
- 🔔 Chrome extension with auto-scan + notifications
- 🔄 Rule-based fallback when ML service is offline

---

## 🔔 Known Behaviours

- **ML service offline:** Backend automatically falls back to rule-based detection. All other layers still work normally.
- **Trusted domains:** `google.com`, `github.com`, `youtube.com` and other well-known domains are whitelisted and will never be flagged unless their path contains suspicious keywords like `login`, `verify`, `password` etc.
- **False positives:** The Kaggle dataset contains some mislabeled entries. The trusted domain whitelist prevents major false positives on well-known sites.
- **Extension auto-scan:** The extension scans every HTTP/HTTPS tab automatically. Chrome internal pages (`chrome://`) are skipped.

---

## 👨‍💻 Authors

**Aman Nawab** — B.Tech Final Year (Project Owner)

- Fixed blacklist detection pipeline
- Added dataset-based Suspicious URL detection
- Integrated ML service with Node.js backend
- Built dashboard URL checker + scan history + email analyzer
- Fixed Chrome extension notification bug + UI improvements
- Added trusted domain whitelist with suspicious path detection
