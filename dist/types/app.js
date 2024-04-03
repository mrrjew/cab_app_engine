"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
class IService {
    constructor(context) {
        this.models = context.models;
        this.context = context;
    }
    authenticate_rider(userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const driver = yield this.context.models.Rider.findById(userId);
            console.log(driver);
            if (!driver) {
                throw new Error('User not authenticated');
            }
            return driver;
        });
    }
    authenticate_ride(rideId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ride = yield this.context.models.Ride.findOne({ _id: rideId });
            if (!ride) {
                throw new Error('no ride found');
            }
            return ride;
        });
    }
    authenticate_mileage(riderId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const mileage = yield this.context.models.Mileage.findOne({ rider: riderId }).sort({ updatedAt: -1 });
            if (!mileage) {
                throw new Error('no mileage found');
            }
            return mileage;
        });
    }
}
exports.default = IService;
//# sourceMappingURL=app.js.map