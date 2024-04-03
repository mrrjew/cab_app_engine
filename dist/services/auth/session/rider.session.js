"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const token_1 = require("../../../utils/token");
const session_1 = require("../../../utils/session");
const app_1 = tslib_1.__importDefault(require("../../../types/app"));
class UserSessionService extends app_1.default {
    constructor(props) {
        super(props);
    }
    // creates access tokens
    createUserSession(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const id = req.body._id;
            const user = yield this.models.Rider.findById(id);
            if (!user) {
                throw new Error('Invalid id or password');
            }
            const accessToken = yield (0, session_1.signAccessToken)(user);
            const refreshToken = yield (0, session_1.signRefreshToken)({ userId: user._id });
            return res.status(201).json({
                accessToken,
                refreshToken,
            });
        });
    }
    // refreshes access tokens
    refreshAccessToken(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const decoded = yield (0, token_1.verifyJwt)(req.body.token);
            if (!decoded) {
                throw new Error('Could not refresh access token');
            }
            const session = yield (0, session_1.findSessionById)(decoded.session);
            if (!session || !session.valid) {
                throw new Error('Could not refresh access token');
            }
            const user = yield this.models.Rider.findById(String(session.userId));
            if (!user) {
                throw new Error('Could not refresh access token');
            }
            const accessToken = yield (0, session_1.signAccessToken)(user);
            return res.status(201).json({ accessToken });
        });
    }
}
exports.default = UserSessionService;
//# sourceMappingURL=rider.session.js.map