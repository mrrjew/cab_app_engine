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
router.get('/current-ride', context_1.default, function (req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const rides = yield start_1.appContext.models.Ride.find({ rider: req.user._id });
            //   const ride = await appContext.models.Ride.findOne({
            //   $and: [{ riderId: req.user._id }, { $or: [{ status: 'PENDING' }, { status: 'ONGOING' }] }],
            // });
            const ride = [...rides].reverse()[0];
            return res.status(200).json(ride);
        }
        catch (e) {
            return res.status(500).json({ error: `error getting current ride: ${e}` });
        }
    });
});
router.post('/ride-request', context_1.default, function (req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield start_1.appContext.services.RideService.requestRide(req, res);
    });
});
router.put('/update-ride', context_1.default, function (req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield start_1.appContext.services.RideService.updateRide(req, res);
    });
});
router.put('/cancel-ride', context_1.default, function (req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield start_1.appContext.services.RideService.cancelRide(req, res);
    });
});
exports.default = router;
//# sourceMappingURL=ride.router.js.map