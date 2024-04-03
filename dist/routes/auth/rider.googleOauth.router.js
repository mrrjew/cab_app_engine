"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const googleapis_1 = require("googleapis");
const config_1 = tslib_1.__importDefault(require("../../config"));
const token_1 = require("../../utils/token");
const axios_1 = tslib_1.__importDefault(require("axios"));
const start_1 = require("../../start");
const { oauth: { google: { clientId, clientSecret } }, app: { baseUrl } } = config_1.default;
const router = express_1.default.Router();
const redirectURI = `${baseUrl}/auth/google/callback`; // Ensure to use absolute URL
console.log(redirectURI);
const oauth2Client = new googleapis_1.google.auth.OAuth2(clientId, clientSecret, redirectURI);
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
router.get(`/google/callback`, (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const code = req.query.code;
    try {
        const { tokens } = yield oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        const oauth2 = googleapis_1.google.oauth2({ version: "v2", auth: oauth2Client });
        const { data: googleUser } = yield oauth2.userinfo.get();
        const { email, verified_email, given_name, family_name, picture, locale } = googleUser;
        console.log(googleUser);
        const user = yield start_1.appContext.models.Rider.findOne({ email });
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
            const newUser = yield axios_1.default.post(`${baseUrl}/auth/register`, _user);
            token = yield (0, token_1.signJwt)(newUser.data);
        }
        else {
            token = yield (0, token_1.signJwt)(user);
        }
        return res.status(201).json(token);
    }
    catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).send(`Error fetching user: ${error.message}`);
    }
}));
exports.default = router;
//# sourceMappingURL=rider.googleOauth.router.js.map