const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://papa:papa@cluster0.uri61.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB Atlas'))
  .catch(error => console.error('Could not connect to MongoDB Atlas:', error));

// Define a schema for URL tracking
const urlSchema = new mongoose.Schema({
  hashedUrl: String,
  originalUrl: String,
  clicks: { type: Number, default: 0 },
  usesRemaining: { type: Number, default: 1 } // For limited-use URLs
});

// Create a model from the schema
const Url = mongoose.model('Url', urlSchema);

// Hash URL function
const hashUrl = (url) => {
  const hash = crypto.createHash('sha256');
  hash.update(url);
  return hash.digest('hex');
};

// Store tracking data in MongoDB
const storeTrackingData = async (hashedUrl, originalUrl, usesRemaining) => {
  const url = new Url({
    hashedUrl,
    originalUrl,
    usesRemaining
  });
  await url.save();
};

// Increment click count and manage uses remaining
const incrementClickCount = async (hashedUrl) => {
  const urlData = await Url.findOneAndUpdate(
    { hashedUrl, usesRemaining: { $gt: 0 } },
    { $inc: { clicks: 1, usesRemaining: -1 } }
  );
  if (!urlData || urlData.usesRemaining < 0) {
    // Optional: Delete URL after use limit is reached
    // await Url.deleteOne({ hashedUrl });
    return false;
  }
  return true;
};

// Handle URL shortening requests
app.post('/url', async (req, res) => {
  try {
    const { url, usesRemaining = 1 } = req.body; // Default to 1 if not provided
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const hashedUrl = hashUrl(url);

    // Check if the URL is already stored
    const existingUrl = await Url.findOne({ hashedUrl });
    if (!existingUrl) {
      await storeTrackingData(hashedUrl, url, usesRemaining);
    }

    res.json({ hashedUrl: `http://localhost:3000/url/${hashedUrl}` });
  } catch (error) {
    console.error('Error storing tracking data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle redirect and click tracking
app.get('/url/:hashedUrl', async (req, res) => {
  const hashedUrl = req.params.hashedUrl;

  try {
    const urlData = await Url.findOne({ hashedUrl });
    if (!urlData) {
      return res.status(404).json({ error: 'URL not found' });
    }

    const originalUrl = urlData.originalUrl;
    const success = await incrementClickCount(hashedUrl);
    if (!success) {
      return res.status(403).json({ error: 'URL usage limit reached' });
    }

    res.redirect(originalUrl);
  } catch (error) {
    console.error('Error fetching tracking data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});


