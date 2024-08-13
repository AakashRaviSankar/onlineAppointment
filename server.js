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

app.post("/embedded", async (req, res) => {
  const { meetingKey, encryptPwd } = req.body;
  const url = `https://meeting.zoho.in/meeting/login/join.jsp?key=${meetingKey}&name=Aakash&viewer=html5&t=${encryptPwd}`;

  console.log("Requesting URL:", url);

  try {
    const response = await axios.get(url);
    res.send(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
