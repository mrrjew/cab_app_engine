"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const socket_io_1 = require("socket.io");
const index_1 = require("../start/index");
const http_1 = tslib_1.__importDefault(require("http"));
const server = http_1.default.createServer(index_1.app);
const io = new socket_io_1.Server(server);
const driverLocations = new Map();
const passengerLocations = new Map();
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    // Handle driver location updates
    socket.on('driverLocationUpdate', (location) => {
        // Store driver location
        driverLocations.set(socket.id, location);
    });
    // Handle passenger location updates
    socket.on('passengerLocationUpdate', (location) => {
        // Store passenger location
        passengerLocations.set(socket.id, location);
    });
    // Handle ride request
    socket.on('requestRide', () => {
        // Calculate distance between passenger and drivers
        const passengerLocation = passengerLocations.get(socket.id);
        const availableDrivers = [...driverLocations.entries()];
        const distances = availableDrivers.map(([driverId, driverLocation]) => ({
            driverId,
            distance: calculateDistance(passengerLocation, driverLocation)
        }));
        // Send distances to passenger
        socket.emit('driverDistances', distances);
    });
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        driverLocations.delete(socket.id);
        passengerLocations.delete(socket.id);
    });
    function calculateDistance(location1, location2) {
        const [lat1, lon1] = location1;
        const [lat2, lon2] = location2;
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in kilometers
        return distance;
    }
    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
});
//# sourceMappingURL=web-sockets.js.map