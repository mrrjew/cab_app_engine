"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const token_1 = require("../utils/token");
function setContext(req, res, next) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            let token;
            req.cookies['access-token'] ? token = req.cookies['access-token'] : '';
            if (token) {
                const decoded = yield (0, token_1.verifyJwt)(token);
                const id = decoded._id;
                console.log(id, decoded);
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