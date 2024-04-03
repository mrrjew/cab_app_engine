"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
//user
const rider_1 = tslib_1.__importDefault(require("./auth/rider"));
const rider_session_1 = tslib_1.__importDefault(require("../services/auth/session/rider.session"));
const ride_1 = tslib_1.__importDefault(require("../services/ride"));
const start_1 = require("../start");
const mileage_1 = tslib_1.__importDefault(require("./mileage"));
function initServices(context) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return {
            RiderService: new rider_1.default(context),
            RiderSessionService: new rider_session_1.default(context),
            RideService: new ride_1.default(context, start_1.server),
            MileageService: new mileage_1.default(context)
        };
    });
}
exports.default = initServices;
//# sourceMappingURL=index.js.map