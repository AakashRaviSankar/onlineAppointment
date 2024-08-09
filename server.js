const express = require("express");
const axios = require("axios");
const qs = require("qs"); // To properly format query strings
const cors = require("cors"); // Import the cors middleware
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

app.post("/api", async (req, res) => {
  const { client_id, client_secret, refresh_token, grant_type } = req.body;

  try {
    const response = await axios.post(
      `https://accounts.zoho.in/oauth/v2/token?${qs.stringify({
        client_id,
        client_secret,
        refresh_token,
        grant_type,
      })}`
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
