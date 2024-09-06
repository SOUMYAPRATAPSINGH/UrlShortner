const crypto = require("crypto");

// Hash URL function
const hashUrl = (url) => {
  const hash = crypto.createHash("sha256");
  hash.update(url);
  return hash.digest("hex");
};

// Generate a short URL based on the hash
const generateShortUrl = (hashedUrl) => {
  return hashedUrl.slice(0, 8); // Taking the first 8 characters as the short URL
};

module.exports = { hashUrl, generateShortUrl };
