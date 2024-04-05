"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const app_1 = tslib_1.__importDefault(require("../../types/app"));
const sms_1 = tslib_1.__importDefault(require("../../utils/sms"));
const log_1 = tslib_1.__importDefault(require("../../utils/log"));
const otp_generator_1 = tslib_1.__importDefault(require("otp-generator"));
class RiderService extends app_1.default {
    constructor(context) {
        super(context);
    }
    // registers Rider
    registerRider(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const { phoneNumber } = req.body;
                if (!phoneNumber) {
                    res.status(422).send('no input was received');
                }
                const _Rider = yield this.models.Rider.findOne({ phoneNumber });
                if (_Rider)
                    throw new Error('Rider already exists');
                const Rider = new this.models.Rider({ phoneNumber });
                yield Rider.save();
                yield (0, sms_1.default)(phoneNumber, `This is your cab app verification code: ${Rider.verificationCode}. Thank you for signing up.`);
                return Rider;
            }
            catch (e) {
                res.status(500).send(`Error creating new Rider: ${e}`);
            }
        });
    }
    //verifies Rider
    verifyRider(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { id, verificationCode } = req.body;
            if (!id || !verificationCode) {
                res.status(422).send('missing required fields');
            }
            try {
                // Find the Rider by Id
                const Rider = yield this.authenticate_rider(id);
                // Check if the Rider is already verified
                if (Rider.verified) {
                    res.status(500).send('Rider is already verified');
                }
                // Check if verificationCode matches
                if (Rider.verificationCode != verificationCode) {
                    res.status(500).send('Invalid verification code');
                }
                // Set verified to true and save Rider
                Rider.verified = true;
                yield Rider.save();
                return true;
            }
            catch (e) {
                res.status(500).send(`Error validating Rider: ${e}`);
            }
        });
    }
    // sends password reset code to Rider's email
    forgotPassword(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const { phoneNumber } = req.body;
                if (!phoneNumber) {
                    res.status(422).send('no input received');
                }
                const Rider = yield this.models.Rider.findOne({ phoneNumber });
                if (!Rider) {
                    res.status(404).send('Rider not found');
                }
                if (!Rider.verified) {
                    res.status(500).send('Rider is not verified');
                }
                const passwordResetCode = otp_generator_1.default.generate(4, {
                    upperCaseAlphabets: false,
                    specialChars: false,
                    lowerCaseAlphabets: false,
                });
                Rider.passwordResetCode = passwordResetCode;
                yield Rider.save();
                yield (0, sms_1.default)(phoneNumber, `This is your cab app password reset code:${Rider.passwordResetCode}`);
                log_1.default.debug(`Password reset code sent to ${Rider.phoneNumber}`);
                const message = 'password reset code sent';
                return message;
            }
            catch (e) {
                res.status(500).send(`error handing password reset: ${e}`);
            }
        });
    }
    // resets Rider's password to new password from email
    resetPassword(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const { id, passwordResetCode, newPassword } = req.body;
                if (!id || !passwordResetCode || !newPassword) {
                    res.status(422).send('missing required fields');
                }
                const Rider = yield this.authenticate_rider(id);
                if (!Rider || Rider.passwordResetCode !== passwordResetCode) {
                    res.status(404).send('Could not reset password');
                }
                Rider.passwordResetCode = null;
                Rider.password = newPassword;
                yield Rider.save();
                const message = 'Successfully updated password';
                return message;
            }
            catch (e) {
                res.status(500).send('error reseting password');
            }
        });
    }
    loginRider(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const { phoneNumber, password } = req.body;
                if (!phoneNumber || !password) {
                    return res.status(400).json({ error: 'Missing required fields' });
                }
                const rider = yield this.models.Rider.findOne({ phoneNumber });
                if (!rider) {
                    return res.status(404).json({ error: 'Rider not found' });
                }
                try {
                    const validPassword = yield rider.validatePassword(password);
                    if (!(yield validPassword)) {
                        return res.status(401).json({ error: 'Incorrect password' });
                    }
                }
                catch (e) {
                    return res.status(500).json({ error: `Error validating password: ${e.message}` });
                }
                // If everything is successful, return the rider data as JSON response
                return res.status(200).json(rider);
            }
            catch (e) {
                return res.status(500).json({ error: `Error logging in: ${e.message}` });
            }
        });
    }
    // updates Rider details
    updateRider(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.user._id);
                const Rider = yield this.authenticate_rider(req.user._id);
                yield Rider.updateOne({ $set: Object.assign({}, req.body) });
                yield Rider.save();
                return Rider;
            }
            catch (e) {
                res.status(500).send(`Error updating Rider: ${e.message}`);
            }
        });
    }
    // deletes Rider account
    deleteRider(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const Rider = yield this.authenticate_rider(req.user._id);
            if (!Rider) {
                res.status(404).send('Error deleting Rider');
            }
            try {
                yield this.models.Rider.findByIdAndDelete(req.user._id);
                res.status(200).send(`Deleted Rider successfully`);
            }
            catch (e) {
                res.status(500).send(`Error deleting Rider`);
            }
        });
    }
}
exports.default = RiderService;
//# sourceMappingURL=rider.js.map