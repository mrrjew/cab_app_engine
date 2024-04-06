"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = exports.appContext = void 0;
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const body_parser_1 = require("body-parser");
const multer_1 = tslib_1.__importDefault(require("multer"));
const path_1 = tslib_1.__importDefault(require("path"));
const models_1 = tslib_1.__importDefault(require("../models"));
const services_1 = tslib_1.__importDefault(require("../services"));
const log_1 = tslib_1.__importDefault(require("../utils/log"));
const routes_1 = tslib_1.__importDefault(require("../routes"));
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const rider_1 = tslib_1.__importDefault(require("../models/user/rider"));
const context_1 = tslib_1.__importDefault(require("../middlewares/context"));
const http_1 = require("http");
const mileage_1 = tslib_1.__importDefault(require("../models/mileage"));
exports.appContext = {};
// http server for websockets
exports.server = (0, http_1.createServer)(exports.app);
function start(config) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            // setting global context
            // initialize models
            exports.appContext.models = yield (0, models_1.default)(config.db);
            exports.appContext.services = yield (0, services_1.default)(exports.appContext);
            // initialize app
            exports.app = (0, express_1.default)();
            exports.app.use(express_1.default.urlencoded({ extended: true }));
            // cors middleware
            exports.app.use((0, cors_1.default)(), (0, body_parser_1.json)());
            //server health check
            exports.app.use("/healthcheck", (_, res) => {
                res.status(200).send("All is green!!!");
            });
            //clear database
            exports.app.get('/clearDB', (_, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const db = mongoose_1.default.connection.db;
                // Drop the entire database
                yield db.dropDatabase();
                res.status(200).send('database cleared successfully');
            }));
            exports.app.get('/clearModel', (_, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                yield mileage_1.default.deleteMany();
                return res.status(200).json({ message: 'model cleared' });
            }));
            //router
            exports.app.use(routes_1.default);
            // file uploads
            const avatarStorage = multer_1.default.diskStorage({
                destination: path_1.default.join(__dirname, '..', 'uploads', 'avatars'),
                filename: function (req, file, cb) {
                    cb(null, file.fieldname + '-' + Date.now() + path_1.default.extname(file.originalname));
                }
            });
            function checkFileType(file, cb) {
                const filetypes = /jpeg|jpg|png/;
                const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
                const mimetype = filetypes.test(file.mimetype);
                if (extname && mimetype) {
                    return cb(null, true);
                }
                else {
                    throw new Error('Error: Images only! (jpeg, jpg, png)');
                }
            }
            const uploadAvatar = (0, multer_1.default)({
                storage: avatarStorage,
                limits: { fileSize: 10000000 },
                fileFilter: function (req, file, cb) {
                    checkFileType(file, cb);
                }
            });
            exports.app.post('/uploadprofilepicture', uploadAvatar.single('avatar'), context_1.default, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                try {
                    const user = yield rider_1.default.findOne({ _id: req.user._id });
                    yield user.updateOne({ $set: { profile: { avatar: req.file.path } } }, { new: true, upsert: true });
                    yield user.save();
                    return res.status(201).send('Avatar uploaded');
                }
                catch (e) {
                    return res.status(500).send(`Error processing request: ${e}`);
                }
            }));
            exports.app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
            exports.app.get('/uploadfile', (req, res) => {
                res.status(200).sendFile(path_1.default.join(__dirname, '..', 'public', 'upload.html'));
            });
            // start app
            exports.app.listen(config.app.port, () => {
                log_1.default.info(`Server ready at http://localhost:${config.app.port}`);
            });
        }
        catch (err) {
            console.error(err);
        }
    });
}
exports.default = start;
//# sourceMappingURL=index.js.map