"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const app_1 = tslib_1.__importDefault(require("../types/app"));
const socket_io_1 = require("socket.io");
const config_1 = tslib_1.__importDefault(require("../config"));
const axios_1 = tslib_1.__importDefault(require("axios"));
class RideService extends app_1.default {
    constructor(props, httpServer) {
        super(props);
        this.io = new socket_io_1.Server(httpServer);
        this.initializeSocketEvents();
    }
    initializeSocketEvents() {
        this.io.on('connection', (socket) => {
            console.log('A user connected');
            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
        });
    }
    calculateDistance(origin, destination) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${config_1.default.maps.api_key}`;
                const response = yield axios_1.default.get(apiUrl);
                const distance = response.data.rows[0].elements[0].distance;
                const time = response.data.rows[0].elements[0].duration;
                console.log(`Distance from ${origin} to ${destination}: ${distance.text} in ${time.text}`);
                return { distance, time };
            }
            catch (error) {
                console.error('Error fetching distance:', error);
                throw new Error('Error fetching distance');
            }
        });
    }
    findAvailableDrivers(origin) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get('http://localhost:8080/driver/get-closer-drivers', {
                    params: { origin },
                });
                return response.data;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    requestRide(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield this.authenticate_rider(req.user._id);
            if (!user) {
                return res.status(404).send('User not authenticated');
            }
            const { pickupLocation, destination } = req.body;
            if (!pickupLocation || !destination) {
                return res.status(400).send('Missing required fields');
            }
            try {
                const origin = `${pickupLocation.latitude},${pickupLocation.longitude}`;
                const dest = `${destination.latitude},${destination.longitude}`;
                const response = yield this.calculateDistance(origin, dest);
                const ride = yield this.models.Ride.create({
                    rider: req.user._id,
                    pickupLocation,
                    destination,
                    distance: { text: response.distance.text, value: response.distance.value },
                    duration: { text: response.time.text, value: response.time.value },
                    mileage: +response.distance.value * 0.000621371,
                });
                yield ride.save();
                this.io.emit('newRide', { message: 'New ride request', ride });
                return res.status(201).json({ message: 'Ride created', ride });
            }
            catch (error) {
                console.error('Error creating ride:', error.message);
                return res.status(500).send('Error creating ride');
            }
        });
    }
    assignDriver(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { _id, pickupLocation } = req.body;
            try {
                const availableDrivers = yield this.findAvailableDrivers(pickupLocation);
                const driversWithDistance = yield Promise.all(availableDrivers.map((driver) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const distance = yield this.calculateDistance(driver.location, pickupLocation);
                    return { driver, distance };
                })));
                driversWithDistance.sort((a, b) => a.distance - b.distance);
                const closestDriver = driversWithDistance[0].driver;
                yield this.models.Ride.findByIdAndUpdate(_id, { driver: closestDriver });
                return res.status(200).send('Driver assigned successfully');
            }
            catch (error) {
                console.error('Error assigning driver:', error);
                return res.status(500).send('Error assigning driver');
            }
        });
    }
    updateRide(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { rideId } = req.body;
            const ride = yield this.authenticate_ride(rideId);
            console.log(ride);
            try {
                console.log(req.body);
                const updatedRide = yield ride.updateOne({ $set: Object.assign({}, req.body) });
                if (!updatedRide) {
                    return res.status(404).json({ error: 'Ride not found' });
                }
                return res.status(200).json({ message: 'Ride updated successfully', ride: (yield updatedRide) });
            }
            catch (error) {
                console.error('Error editing ride:', error);
                return res.status(500).json({ error: `Error editing ride: ${error.message}` });
            }
        });
    }
    cancelRide(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const { rideId } = req.body;
                const ride = yield this.authenticate_ride(rideId);
                yield ride.updateOne({ $set: { status: "CANCELLED" } });
                return res.status(200).send('Cancelled ride successfully');
            }
            catch (error) {
                console.error('Error cancelling ride:', error);
                return res.status(500).send(`Error cancelling ride: ${error}`);
            }
        });
    }
}
exports.default = RideService;
//# sourceMappingURL=ride.js.map