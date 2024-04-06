"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const app_1 = tslib_1.__importDefault(require("../types/app"));
const config_1 = tslib_1.__importDefault(require("../config"));
const uuid_1 = require("uuid");
class MileageService extends app_1.default {
    //calculate mileage
    calculateMileage(amount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return Number(+amount * (1 / 1.75));
        });
    }
    constructor(props) {
        super(props);
        this.endpoint = 'https://api.paystack.co';
        // variable to prevent overincrementation of milleage 
        this.paymentInitialized = false;
    }
    getUserCurrentMileage(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const rider = yield this.authenticate_rider(req.user._id);
                const mileage = yield this.authenticate_mileage(rider._id);
                return res.status(200).json(mileage);
            }
            catch (e) {
                return res.status(500).send('error getting mileage');
            }
        });
    }
    getUserAllMileage(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const rider = yield this.authenticate_rider(req.user._id);
                const mileage = yield this.models.Mileage.find({ rider: rider._id }).sort({ updatedAt: -1 });
                return res.status(200).json(mileage);
            }
            catch (e) {
                return res.status(500).send(`error getting mileage: ${e}`);
            }
        });
    }
    //buy mileage
    buyMileage(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rider = yield this.authenticate_rider(req.user._id);
            const { email } = req.body;
            const reference = (0, uuid_1.v4)();
            if (rider.email !== email) {
                return res.status(500).send('Wrong user');
            }
            try {
                const response = yield (0, axios_1.default)({
                    method: 'post',
                    url: `${this.endpoint}/transaction/initialize`,
                    headers: {
                        Authorization: `Bearer ${config_1.default.paystack.secret_key}`,
                    },
                    data: Object.assign(Object.assign({}, req.body), { reference, subaccount: config_1.default.paystack.subaccount.code }),
                });
                this.paymentInitialized = true;
                console.log(this.paymentInitialized);
                return res.status(201).json(response.data);
            }
            catch (e) {
                return res.status(500).send(`error initializing payment: ${e}`);
            }
        });
    }
    verifyPayment(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // Define a flag to track whether payment has been verified and mileage value created
            yield this.authenticate_rider(req.user._id);
            try {
                const response = yield (0, axios_1.default)({
                    method: 'get',
                    url: `${this.endpoint}/transaction/verify/${req.body.reference}`,
                    headers: {
                        Authorization: `Bearer ${config_1.default.paystack.secret_key}`,
                    },
                });
                const { id: transactionId, reference, amount, status } = response.data.data;
                if (status == "success" && this.paymentInitialized) {
                    let mileage = yield this.models.Mileage.findOne({ rider: req.user._id });
                    if (!mileage) {
                        const newMileageData = {
                            rider: req.user._id,
                            status: 'CREDITED',
                            transactionId,
                            reference,
                            value: yield this.calculateMileage(amount),
                            amount,
                        };
                        mileage = yield this.models.Mileage.create(newMileageData);
                    }
                    else {
                        mileage.value += yield this.calculateMileage(amount);
                        mileage.reference = reference;
                        yield mileage.save();
                    }
                    this.paymentInitialized = false;
                    console.log(this.paymentInitialized);
                    return res.status(201).json(mileage);
                }
                else {
                    return res.status(500).send('mileage purchase rejected');
                }
            }
            catch (error) {
                return res.status(500).send(`error verifying payment: ${error}`);
            }
        });
    }
    // pay for ride with milleage
    payForRide(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { rideId } = req.body;
            const rider = yield this.authenticate_rider(req.user._id);
            const mileage = yield this.context.models.Mileage.findOne({ rider: req.user._id }).sort({ updatedAt: -1 });
            const ride = yield this.authenticate_ride(rideId);
            if (mileage.status == 'REJECTED' || mileage.status == 'EXHAUSTED') {
                return res.status(500).send('cannot pay for ride with current mileage');
            }
            if (ride.status == 'COMPLETED') {
                return res.status(500).send('already paid for trip');
            }
            if (mileage.value == 0) {
                mileage.status = 'EXHAUSTED';
                mileage.used = 0;
                return res.status(500).send('mileage is finished');
            }
            if (ride.mileage > mileage.value) {
                return res.status(500).send('ride mileage is greater than your current mileage');
            }
            yield mileage.updateOne({
                $set: {
                    value: mileage.value - Number(ride.mileage),
                    used: Number(ride.mileage),
                },
            });
            yield mileage.save();
            yield ride.updateOne({ $set: { status: 'COMPLETED' } });
            yield ride.save();
            return res.status(200).json([ride, mileage]);
        });
    }
}
exports.default = MileageService;
//# sourceMappingURL=mileage.js.map