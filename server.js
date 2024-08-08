const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.post("/api/token", async (req, res) => {
  try {
    const response = await axios.post(
      "https://accounts.zoho.in/oauth/v2/token",
      req.body,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response.status).json(error.response.data);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
