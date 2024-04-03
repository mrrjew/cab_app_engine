"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const context_1 = tslib_1.__importDefault(require("../middlewares/context"));
const start_1 = require("../start");
const router = express_1.default.Router();
router.get('/current-mileage', context_1.default, function (req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield start_1.appContext.services.MileageService.getUserCurrentMileage(req, res);
    });
});
router.get('/all-mileages', context_1.default, function (req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield start_1.appContext.services.MileageService.getUserAllMileage(req, res);
    });
});
router.post('/buy-mileage', context_1.default, function (req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield start_1.appContext.services.MileageService.buyMileage(req, res);
    });
});
router.post('/verify-payment', context_1.default, function (req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield start_1.appContext.services.MileageService.verifyPayment(req, res);
    });
});
router.post('/pay-for-ride', context_1.default, function (req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield start_1.appContext.services.MileageService.payForRide(req, res);
    });
});
exports.default = router;
//# sourceMappingURL=mileage.router.js.map