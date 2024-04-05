"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const token_1 = require("../utils/token");
function setContext(req, res, next) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            let token = req.headers.authorization.split(' ')[1];
            let decoded;
            if (token) {
                try {
                    decoded = yield (0, token_1.verifyJwt)(token);
                }
                catch (e) {
                    throw new Error(`error decoding token: ${e}`);
                }
                const id = decoded._id;
                const user = { _id: id };
                user ? req.user = user : null;
                next();
            }
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.default = setContext;
;
//# sourceMappingURL=context.js.map