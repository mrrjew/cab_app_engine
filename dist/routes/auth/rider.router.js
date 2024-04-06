"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const context_1 = tslib_1.__importDefault(require("../../middlewares/context"));
const start_1 = require("../../start");
const rider_1 = tslib_1.__importDefault(require("../../models/user/rider"));
const router = express_1.default.Router();
router.get('/me', context_1.default, (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    console.log(req.user._id);
    const _Rider = yield start_1.appContext.models.Rider.findById(req.user._id);
    return res.status(200).json(_Rider);
}));
router.get('/riders', context_1.default, (_, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const _Rider = yield rider_1.default.find();
    res.status(200).json(_Rider);
}));
router.post('/register', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const Rider = yield start_1.appContext.services.RiderService.registerRider(req, res);
    return res.status(201).json({ Rider });
}));
router.post('/verify', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const response = yield start_1.appContext.services.RiderService.verifyRider(req, res);
    return res.status(200).json(response);
}));
router.post('/forgot-password', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const response = yield start_1.appContext.services.RiderService.forgotPassword(req, res);
    return res.status(200).json(response);
}));
router.post('/reset-password', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const response = yield start_1.appContext.services.RiderService.resetPassword(req, res);
    return res.status(200).json(response);
}));
router.post('/login', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield start_1.appContext.services.RiderService.loginRider(req, res);
}));
router.put('/update-rider', context_1.default, (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const Rider = yield start_1.appContext.services.RiderService.updateRider(req, res);
    return res.status(200).json(Rider);
}));
router.delete('/delete-rider', context_1.default, (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield start_1.appContext.services.RiderService.deleteRider(req, res);
}));
exports.default = router;
//# sourceMappingURL=rider.router.js.map