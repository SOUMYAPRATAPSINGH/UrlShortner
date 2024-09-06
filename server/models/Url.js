const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  hashedUrl: String,
  shortUrl: String, // New field for the shortened URL
  originalUrl: String,
  clicks: { type: Number, default: 0 },
  usesRemaining: { type: Number, default: 1 },
});

const Url = mongoose.model("Url", urlSchema);

module.exports = Url;
