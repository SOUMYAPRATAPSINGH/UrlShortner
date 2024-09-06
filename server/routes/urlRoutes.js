const express = require("express");
const router = express.Router();
const { shortenUrl, trackAndRedirect } = require("../controller/urlController");

// Route for shortening a URL
router.post("/", shortenUrl);

// Route for handling URL redirection and click tracking
router.get("/:shortUrl", trackAndRedirect);

module.exports = router;
