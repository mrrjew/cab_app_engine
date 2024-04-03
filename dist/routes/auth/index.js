"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const rider_router_1 = tslib_1.__importDefault(require("./rider.router"));
const rider_session_router_1 = tslib_1.__importDefault(require("./session/rider.session.router"));
const rider_googleOauth_router_1 = tslib_1.__importDefault(require("./rider.googleOauth.router"));
const router = express_1.default.Router();
router.use('/rider', rider_router_1.default);
router.use('/session', rider_session_router_1.default);
router.use(rider_googleOauth_router_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map