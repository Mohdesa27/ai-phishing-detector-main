const express = require("express");
const router = express.Router();
const { checkURL, getScanHistory } = require("../controllers/checkController");

router.post("/check", checkURL);
router.get("/history", getScanHistory);

module.exports = router;
