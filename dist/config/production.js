"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    app: {
        name: 'cab-app',
        port: process.env.PORT || 8080,
        env: 'production',
        baseUrl: process.env.APP_URL,
    },
    db: {
        uri: process.env.PROD_MONGO_URI || '',
    },
    smtp: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: process.env.MAIL_SECURE || true,
    },
    logger: {
        level: process.env.LOGGER_LEVEL,
    },
    paystack: {
        secret_key: process.env.PAYSTACK_LIVE_SECRET_KEY || '',
        subaccount: {
            account_number: process.env.PAYSTACK_SUBACCOUNT_NUMBER || '',
            bank_code: process.env.PAYSTACK_BANK_CODE || '',
            code: process.env.PAYSTACK_SUBACCOUNT_CODE || '',
        },
    },
    oauth: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        },
    },
    maps: {
        api_key: process.env.DISTANCE_MATRIX_API_KEY || '',
    },
};
exports.default = config;
//# sourceMappingURL=production.js.map