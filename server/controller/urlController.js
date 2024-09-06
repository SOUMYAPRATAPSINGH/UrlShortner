const Url = require("../models/Url");
const { hashUrl, generateShortUrl } = require("../utils/hashUtils");

// Store tracking data in MongoDB
const storeTrackingData = async (hashedUrl, shortUrl, originalUrl, usesRemaining) => {
  const url = new Url({
    hashedUrl,
    shortUrl,
    originalUrl,
    usesRemaining,
  });
  await url.save();
};

// Increment click count and manage remaining uses
const incrementClickCount = async (shortUrl) => {
  const urlData = await Url.findOneAndUpdate(
    { shortUrl, usesRemaining: { $gt: 0 } },
    { $inc: { clicks: 1, usesRemaining: -1 } }
  );
  if (!urlData || urlData.usesRemaining < 0) {
    return false;
  }
  return true;
};

// Handle URL shortening requests
const shortenUrl = async (req, res) => {
  try {
    const { url, usesRemaining = 1 } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const hashedUrl = hashUrl(url);
    const shortUrl = generateShortUrl(hashedUrl);

    // Check if the short URL already exists
    const existingUrl = await Url.findOne({ shortUrl });
    if (!existingUrl) {
      await storeTrackingData(hashedUrl, shortUrl, url, usesRemaining);
    }

    res.json({ shortUrl: `http://localhost:3000/url/${shortUrl}` });
  } catch (error) {
    console.error("Error storing tracking data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Handle redirect and click tracking
const trackAndRedirect = async (req, res) => {
  const shortUrl = req.params.shortUrl;

  try {
    const urlData = await Url.findOne({ shortUrl });
    if (!urlData) {
      return res.status(404).json({ error: "URL not found" });
    }

    const originalUrl = urlData.originalUrl;
    const success = await incrementClickCount(shortUrl);
    if (!success) {
      return res.status(403).json({ error: "URL usage limit reached" });
    }

    res.redirect(originalUrl);
  } catch (error) {
    console.error("Error fetching tracking data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  shortenUrl,
  trackAndRedirect,
};
