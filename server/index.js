const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const cors = require('cors');
const app = express();
app.use(cors());
// MongoDB connection
mongoose.connect("mongodb+srv://papa:papa@cluster0.uri61.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log("Connected to MongoDB Atlas"))
    .catch((error) => console.error("Could not connect to MongoDB Atlas:", error));
  
// Define a schema for URL tracking
const urlSchema = new mongoose.Schema({
  hashedUrl: String,
  originalUrl: String,
  clicks: { type: Number, default: 0 },
});

// Create a model from the schema
const Url = mongoose.model("Url", urlSchema);

app.use(express.json());

// Hash URL function
const hashUrl = (url) => {
  const hash = crypto.createHash("sha256");
  hash.update(url);
  return hash.digest("hex");
};

// Store tracking data in MongoDB
const storeTrackingData = async (hashedUrl, originalUrl) => {
  const url = new Url({
    hashedUrl,
    originalUrl,
  });
  await url.save();
};

// Increment click count in MongoDB
const incrementClickCount = async (hashedUrl) => {
  await Url.findOneAndUpdate({ hashedUrl }, { $inc: { clicks: 1 } });
};

// Handle URL shortening requests
app.post("/url", async (req, res) => {
  try {
    const originalUrl = req.body.url;
    if (!originalUrl) {
      return res.status(400).json({ error: "URL is required" });
    }

    const hashedUrl = hashUrl(originalUrl);

    // Check if the URL is already stored
    const existingUrl = await Url.findOne({ hashedUrl });
    if (!existingUrl) {
      await storeTrackingData(hashedUrl, originalUrl);
    }

    res.json({ hashedUrl });
  } catch (error) {
    console.error("Error storing tracking data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Handle redirect and click tracking
app.get("/url/:hashedUrl", async (req, res) => {
  const hashedUrl = req.params.hashedUrl;

  try {
    const urlData = await Url.findOne({ hashedUrl });
    if (!urlData) {
      return res.status(404).json({ error: "URL not found" });
    }

    const originalUrl = urlData.originalUrl;
    await incrementClickCount(hashedUrl);
    res.redirect(originalUrl);
  } catch (error) {
    console.error("Error fetching tracking data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});



