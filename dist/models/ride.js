"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importStar(require("mongoose"));
const rideSchema = new mongoose_1.default.Schema({
    driver: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Driver' },
    rider: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Rider' },
    status: { type: String, enum: ['PENDING', 'ONGOING', 'COMPLETED', 'CANCELLED'], default: 'PENDING' },
    mileage: { type: Number, required: true },
    pickupLocation: {
        longitude: { type: String, required: true },
        latitude: { type: String, required: true },
        address: { type: String },
    },
    destination: {
        longitude: { type: String, required: true },
        latitude: { type: String, required: true },
        address: { type: String },
    },
    distance: {
        text: { type: String, required: true },
        value: { type: String, required: true },
    },
    duration: {
        text: { type: String, required: true },
        value: { type: String, required: true },
    },
}, { timestamps: true });
const Ride = mongoose_1.default.model("Ride", rideSchema);
exports.default = Ride;
//# sourceMappingURL=ride.js.map