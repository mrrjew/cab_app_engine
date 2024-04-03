import express from "express";
import { google } from "googleapis";
import config from "../../config";
import { signJwt } from "../../utils/token";
import Rider from "../../models/user/rider";
import axios from "axios";
import { appContext } from "../../start";

const { oauth: { google: { clientId, clientSecret } }, app: { baseUrl } } = config;

const router = express.Router();

const redirectURI = `${baseUrl}/auth/google/callback`; // Ensure to use absolute URL
console.log(redirectURI)

const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectURI
);

const scopes = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/user.phonenumbers.read"
];

// Generate Google OAuth2 URL
function getGoogleAuthURL() {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
  });
}

// Endpoint to get Google OAuth2 URL
router.get("/google/url", (req, res) => {
  return res.send(getGoogleAuthURL());
});

// Exchange code for tokens and fetch user profile
router.get(`/google/callback`, async (req, res) => {
  const code = req.query.code as string;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data: googleUser } = await oauth2.userinfo.get();

    const { email, verified_email, given_name, family_name, picture, locale } = googleUser;
    console.log(googleUser)

    const user = await appContext.models.Rider.findOne({ email });

    let _user = {
      email,
      // phoneNumber:phoneNumber,
      verified: verified_email,
      firstname: given_name,
      lastname: family_name,
      profile: { avatar: picture },
      settings: { language: locale.split('-')[0].toUpperCase() }
    };

    let token;

    if (!user) {
      const newUser = await axios.post(`${baseUrl}/auth/register`, _user);
      token = await signJwt(newUser.data);
    } else {
      token = await signJwt(user);
    }

    return res.status(201).json(token);
  } catch (error) {
    console.error("Error fetching user:", error); 
    return res.status(500).send(`Error fetching user: ${error.message}`);
  }
});

export default router;
