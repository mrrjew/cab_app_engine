"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mileageSchema = new mongoose_1.Schema({
    rider: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'rider' },
    value: { type: Number, required: true, default: 0 },
    used: { type: Number, default: 0 },
    transactionId: { type: String },
    reference: { type: String },
    status: { type: String, enum: ['PENDING', 'CREDITED', 'REJECTED', 'EXHAUSTED'], default: 'PENDING' }
}, { timestamps: true });
const Mileage = (0, mongoose_1.model)('Mileage', mileageSchema);
exports.default = Mileage;
//# sourceMappingURL=mileage.js.map