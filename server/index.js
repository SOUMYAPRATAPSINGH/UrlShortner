const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const urlRoutes = require("./routes/urlRoutes");

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;
const db_url = process.env.DatabaseUrl;

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://papa:papa@cluster0.uri61.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error("Could not connect to MongoDB Atlas:", error));

// Register routes
app.use("/url", urlRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
