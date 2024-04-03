"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const log_1 = tslib_1.__importDefault(require("../utils/log"));
// Rider
const rider_1 = tslib_1.__importDefault(require("./user/rider"));
// ride
const ride_1 = tslib_1.__importDefault(require("./ride"));
// mileage
const mileage_1 = tslib_1.__importDefault(require("./mileage"));
function initDB(config) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, mongoose_1.connect)(config.uri, { autoIndex: true });
            log_1.default.info('Connected to database successfully');
            yield rider_1.default.createCollection();
            yield ride_1.default.createCollection();
            yield mileage_1.default.createCollection();
            return {
                Rider: rider_1.default,
                Ride: ride_1.default,
                Mileage: mileage_1.default
            };
        }
        catch (e) {
            throw new Error(`Error while connecting to database : ${e}`);
        }
    });
}
exports.default = initDB;
//# sourceMappingURL=index.js.map