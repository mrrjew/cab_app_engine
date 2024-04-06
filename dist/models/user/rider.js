"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.privateField = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const otp_generator_1 = tslib_1.__importDefault(require("otp-generator"));
const bcrypt_1 = tslib_1.__importDefault(require("bcrypt"));
exports.privateField = ['password', '__v', 'verificationCode', 'passwordResetCode', 'verified'];
const riderSchema = new mongoose_1.Schema({
    firstname: { type: String },
    lastname: { type: String },
    othernames: { type: String },
    email: { type: String },
    phoneNumber: { type: String, required: true },
    password: { type: String },
    verificationCode: {
        type: String,
        required: true,
        default: () => otp_generator_1.default.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false }),
    },
    passwordResetCode: { type: String },
    verified: { type: Boolean, required: true, default: false },
    profile: {
        avatar: { type: String },
        basicInformation: { type: String },
    },
    settings: {
        // General Settings
        language: { type: String, enum: ['EN', 'FR', 'ES', 'DE', 'ZH', 'JA', 'KO'], default: 'EN' },
        theme: { type: String, enum: ['LIGHT', 'DARK'], default: 'LIGHT' },
        notificationEnabled: { type: Boolean, default: true },
        soundEnabled: { type: Boolean, default: true },
        autoSaveInterval: { type: Number, default: 10 },
        // Privacy Settings
        profileVisibility: { type: String, enum: ['PUBLIC', 'PRIVATE'], default: 'PUBLIC' },
        contactInfoVisibility: { type: String, enum: ['PUBLIC', 'PRIVATE'], default: 'PUBLIC' },
        locationSharingEnabled: { type: Boolean, default: true },
        activityTrackingEnabled: { type: Boolean, default: true },
        dataSharingEnabled: { type: Boolean, default: true },
        dataRetentionPeriod: { type: Number, default: 365 },
        // Security Settings
        twoFactorAuthEnabled: { type: Boolean, default: false },
        dataEncryptionEnabled: { type: Boolean, default: false },
    },
    latitude: { type: Number, required: false },
    longitude: { type: Number, required: false }
}, {
    timestamps: true,
});
riderSchema.pre('save', function (next) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password'))
            return next();
        try {
            const salt = yield bcrypt_1.default.genSalt(10);
            const hash = yield bcrypt_1.default.hash(this.password, salt);
            this.password = hash;
            next();
        }
        catch (err) {
            next(err);
        }
    });
});
riderSchema.methods.validatePassword = function (pass) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            // const _password = await bcrypt.compare(pass, this.password);
            // console.log(pass, _password);
            return true;
        }
        catch (e) {
            console.error('Error validating password:', e.message);
            return false; // Return false if password validation fails
        }
    });
};
const Rider = (0, mongoose_1.model)('Driver', riderSchema);
exports.default = Rider;
//# sourceMappingURL=rider.js.map