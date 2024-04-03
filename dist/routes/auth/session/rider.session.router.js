"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const start_1 = require("../../../start");
const router = express_1.default.Router();
router.post('/create', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        yield start_1.appContext.services.RiderSessionService.createUserSession(req, res);
    }
    catch (e) {
        res.status(500).send('Error creating token');
    }
}));
router.get('/getrefreshtoken', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        yield start_1.appContext.services.RiderSessionService.createUserSession(req, res);
    }
    catch (e) {
        res.status(500).send('Error creating token');
    }
}));
router.post('/refresh', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        yield start_1.appContext.services.RiderSessionService.refreshAccessToken(req, res);
    }
    catch (e) {
        res.status(500).send('Error creating token');
    }
}));
exports.default = router;
//# sourceMappingURL=rider.session.router.js.map