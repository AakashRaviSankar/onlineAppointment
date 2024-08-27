const express = require("express");
const axios = require("axios");
const qs = require("qs"); // To properly format query strings
const cors = require("cors"); // Import the cors middleware
const multer = require("multer");
const app = express();
const PORT = process.env.PORT || 5000;

const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const CLIENT_ID = "1000.AVDZT61LRQZ05BM18YQWSIN1K95QFL";
const CLIENT_SECRET = "0eba6d33ccd839c018df42be71bc35a61cb1ac8b46";
const REFRESH_TOKEN =
  "1000.70779468453365ee18d5701abad55f80.02d32562b4795328aedf691d7d14c66c";
const redirectURI = "https://talentakeaways.com";

let accessToken = null;
let tokenExpiryTime = null;

app.use(cors());
app.use(express.json());
const upload = multer();

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
      "https://meeting.zoho.in/api/v2/60031939241/sessions.json",
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
    const response = await axios.post(
      "http://ttipl-uat.com:60161/enrollement/store",
      req.body
    );

    res.send(response.data);
  } catch (error) {
    console.error("Error posting to /enrollement/store:", error.message);
    res.status(500).send("Error posting form data");
  }
});

app.post("/serviceProvider", async (req, res) => {
  try {
    const response = await axios.post(
      "http://ttipl-uat.com:60162/api/serviveprovider/storedata",
      req.body
    );

    res.send(response.data);
  } catch (error) {
    console.error("Error posting to /enrollement/store:", error.message);
    res.status(500).send("Error posting form data");
  }
});

app.post("/schoolForm", async (req, res) => {
  try {
    const response = await axios.post(
      "http://ttipl-uat.com:60162/api/schoolenrollment/storedata",
      req.body
    );

    res.send(response.data);
  } catch (error) {
    console.error("Error posting to /enrollement/store:", error.message);
    res.status(500).send("Error posting form data");
  }
});

app.post("/getStarted", async (req, res) => {
  try {
    const response = await axios.post(
      "http://ttipl-uat.com:60162/api/mayi_helpyou/mail",
      req.body
    );

    res.send(response.data);
  } catch (error) {
    console.error("Error posting to /enrollement/store:", error.message);
    res.status(500).send("Error posting form data");
  }
});

app.post("/internship", upload.any(), async (req, res) => {
  const form = new FormData();

  // Add non-file fields
  Object.keys(req.body).forEach((key) => {
    form.append(key, req.body[key]);
  });

  // Add file fields
  req.files.forEach((file) => {
    form.append(file.fieldname, file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
  });

  console.log(form);
  try {
    // Send the request to the external API
    const response = await axios.post(
      "http://ttipl-uat.com:60161/internship",
      form,
      {
        headers: {
          ...form.getHeaders(), // Include the headers from FormData
        },
      }
    );

    res.send(response.data);
  } catch (error) {
    console.error("Error posting to /internship:", error.message);
    res.status(500).send("Error posting form data");
  }
});

app.get("/testimonial/home", async (req, res) => {
  try {
    const response = await axios.get(
      "http://ttipl-uat.com:60162/api/testimonial/home"
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error fetching meeting content");
  }
});

app.get("/testimonial/isms", async (req, res) => {
  try {
    const response = await axios.get(
      "http://ttipl-uat.com:60162/api/testimonial/isms"
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error fetching meeting content");
  }
});

app.post("/blog/comment", async (req, res) => {
  try {
    const response = await axios.post(
      "http://ttipl-uat.com:60162/api/blog/comment/mail",
      req.body
    );

    res.send(response.data);
  } catch (error) {
    console.error("Error posting to /enrollement/store:", error.message);
    res.status(500).send("Error posting form data");
  }
});

app.get("/api/dailyquotes", async (req, res) => {
  try {
    const response = await axios.get(
      "http://183.83.188.205:60162/api/dailyquotes"
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error fetching meeting content");
  }
});

app.post("/api/newsletters/storedata", async (req, res) => {
  try {
    const response = await axios.post(
      "http://183.83.188.205:60162/api/newsletters/storedata",
      req.body
    );

    res.send(response.data);
  } catch (error) {
    console.error("Error posting to /enrollement/store:", error.message);
    res.status(500).send("Error posting form data");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
