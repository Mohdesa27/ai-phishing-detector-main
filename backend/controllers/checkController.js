const getMLPrediction = require("../services/mlService");
const checkBlacklist = require("../services/blacklistService");
const { checkDataset } = require("../services/datasetService");
const Scan = require("../models/Scan");

const checkURL = async (req, res) => {
  try {

    const url = req.body.url;

    if (!url || typeof url !== "string") {
      return res.status(400).json({
        success:false,
        result:"Invalid",
        score:0,
        message:"No URL provided"
      });
    }

    const fixedURL = url.startsWith("http")
      ? url.trim()
      : "https://" + url.trim();

    console.log("🔍 Checking URL:", fixedURL);

    const blacklistResult = checkBlacklist(fixedURL);

    if (blacklistResult?.matched) {

      try {
        await Scan.create({
          url:fixedURL,
          result:"Suspicious",
          score:blacklistResult.confidence,
          source:"blacklist",
          checkedAt:new Date()
        });
      } catch(err){
        console.log("Mongo save skipped:",err.message);
      }

      return res.json({
        success:true,
        result:"Suspicious ⚠️",
        score:blacklistResult.confidence,
        source:"blacklist"
      });
    }

    const datasetResult = checkDataset(fixedURL);

    if(datasetResult?.matched){

      try{
        await Scan.create({
          url:fixedURL,
          result:"Suspicious",
          score:datasetResult.confidence,
          source:"dataset",
          checkedAt:new Date()
        });
      }catch(err){
        console.log("Mongo save skipped:",err.message);
      }

      return res.json({
        success:true,
        result:"Suspicious ⚠️",
        score:datasetResult.confidence,
        source:"dataset"
      });
    }

    const mlResult = await getMLPrediction(fixedURL);

    const resultText =
      mlResult.prediction===1
      ? "Phishing 🚨"
      : "Safe ✅";

    try{
      await Scan.create({
        url:fixedURL,
        result:resultText.includes("Phishing")
          ? "Phishing"
          : "Safe",
        score:mlResult.confidence,
        source:mlResult.source,
        checkedAt:new Date()
      });
    }catch(err){
      console.log("Mongo save skipped:",err.message);
    }

    return res.json({
      success:true,
      result:resultText,
      score:mlResult.confidence,
      source:mlResult.source
    });

  } catch(error){

    console.error(error);

    return res.status(500).json({
      success:false,
      result:"Error",
      score:0,
      message:"Internal server error"
    });

  }
};

const getScanHistory = async(req,res)=>{

 try{

 const scans = await Scan.find()
 .sort({checkedAt:-1})
 .limit(50);

 res.json({
 success:true,
 data:scans
 });

 }catch(err){

 res.status(500).json({
 success:false,
 error:err.message
 });

 }

};

module.exports={
 checkURL,
 getScanHistory
};