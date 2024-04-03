"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const start_1 = require("../start");
const context_1 = tslib_1.__importDefault(require("../middlewares/context"));
const router = express_1.default.Router();
router.get('/rider-ride-history', context_1.default, function (req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const rides = yield start_1.appContext.models.Ride.find({ rider: req.user._id });
        return res.status(200).json(rides);
    });
});
router.post('/ride-request', context_1.default, function (req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield start_1.appContext.services.RideService.requestRide(req, res);
    });
});
router.post('/update-ride/:id', context_1.default, function (req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield start_1.appContext.services.RideService.updateRide(req, res);
    });
});
router.post('/delete-ride/:id', context_1.default, function (req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield start_1.appContext.services.RideService.deleteRide(req, res);
    });
});
exports.default = router;
//# sourceMappingURL=ride.router.js.map