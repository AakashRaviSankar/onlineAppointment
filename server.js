const express = require("express");
const axios = require("axios");
const qs = require("qs"); // To properly format query strings
const cors = require("cors"); // Import the cors middleware
const app = express();
const PORT = process.env.PORT || 5000;

const CLIENT_ID = "1000.CS2Y4EMV1BTPQU1XO6LKQK3RBNFRME";
const CLIENT_SECRET = "b4a539c9cd2decfe9bab524eb212b70c6812d79dc0";
const REFRESH_TOKEN =
  "1000.0064f3a097043a840201bc6f6828a2d4.63bf354524b63346cc8d3970d189c3b5";
const redirectURI = "https://talentakeaways.com";

let accessToken = null;
let tokenExpiryTime = null;

app.use(cors());
app.use(express.json());

const getAccessToken = async () => {
  const response = await axios.post(
    `https://accounts.zoho.in/oauth/v2/token?${qs.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type: "refresh_token",
      redirect_uri: redirectURI,
    })}`
  );
  const data = response.data;
  accessToken = data.access_token;
  tokenExpiryTime = Date.now() + data.expires_in * 1000;
  return accessToken;
};

const ensureAccessToken = async (req, res, next) => {
  if (!accessToken || Date.now() > tokenExpiryTime) {
    await getAccessToken();
  }
  next();
};

app.get("/api/zoho", ensureAccessToken, async (req, res) => {
  try {
    const response = await axios.get(
      "https://meeting.zoho.in/api/v2/60031615187/sessions.json",
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Server error" });
  }
});

app.get("/embed", ensureAccessToken, async (req, res) => {
  const { name, key, t } = req.query;
  try {
    const response = await axios.get(
      `https://meeting.zoho.in/meeting/participant.do?name=${name}&key=${key}&t=${t}`
    );
    res.send(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Server error" });
  }
});

app.get("/reviews", async (req, res) => {
  const { limit } = req.query;

  try {
    const response = await axios.get(
      `https://api.zembra.io/reviews/subscription/practo?slug=doctor/dr-sasikumar-muthu-cosmetic-plastic-surgeon&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer uWu63Bl7LgYxCbmxAD8umccD2dH4Se4tU5tcQCoZKnlHnvEU9rUcBSETvF5zwqBAaH90Lu8A4rjntFvgln0p3lBn88cZKU2cjWJul6gPNr4020aZIJwPPeGJYMStBZQC`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error fetching meeting content");
  }
});

app.post("/parentForm", async (req, res) => {
  try {
    const response = await axios.get(
      `http://ttipl-uat.com:60161/enrollement/store`,
      req.body
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error fetching meeting content");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
