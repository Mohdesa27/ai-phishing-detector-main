const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config()

const emailRoutes = require("./routes/emailRoutes");
const checkRoutes = require("./routes/checkRoutes");

const { loadDataset } = require("./services/datasetService");
const { loadBlacklist } = require("./services/blacklistService");

const app = express();

// Middleware
app.use(cors({ origin: "https://ai-phishing-detector-main.vercel.app" }));
app.use(express.json());

// Routes
app.use("/api/email", emailRoutes);
app.use("/api", checkRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    // ✅ Load both datasets AFTER DB is ready
    loadBlacklist(); // blacklist.json — fast exact match
    loadDataset();   // phishing_site_urls.csv — large dataset match

    console.log("✅ Datasets loaded");
  })
  .catch((err) => console.log("❌ MongoDB error:", err));

// Health check route
app.get("/", (req, res) => {
  res.send("✅ Phishing Detection Backend Running");
});

// Start Server
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
});
