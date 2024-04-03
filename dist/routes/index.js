"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const auth_1 = tslib_1.__importDefault(require("./auth"));
const ride_router_1 = tslib_1.__importDefault(require("./ride.router"));
const mileage_router_1 = tslib_1.__importDefault(require("./mileage.router"));
const router = express_1.default.Router();
router.use('/auth', auth_1.default);
router.use('/ride', ride_router_1.default);
router.use('/mileage', mileage_router_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map