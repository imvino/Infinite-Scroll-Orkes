const express = require("express");
const fetch = require("node-fetch");
const app = express();
app.use(express.static("public"));

// Enable CORS for all routes
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", (req, res) => res.redirect("/index.html"));

// Define a route to proxy the remote server's endpoint
app.get("/photo-gallery-feed-page/page/:page", async (req, res) => {
  const { page } = req.params;
  const url = `https://englishapi.pinkvilla.com/app-api/v1/photo-gallery-feed-page/page/${page}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
