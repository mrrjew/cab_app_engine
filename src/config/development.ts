import dotenv from 'dotenv';
dotenv.config();
import { Config } from '.';

const config: Config = {
  app: {
    name: 'cab-app',
    port: 1080,
    env: 'development',
    baseUrl: process.env.APP_URL,
  },
  db: {
    uri: process.env.DEV_MONGO_URI || '',
  },
  smtp: {
    user: process.env.DEV_MAIL_USER,
    pass: process.env.DEV_MAIL_PASS,
    host: process.env.DEV_MAIL_HOST,
    port: process.env.DEV_MAIL_PORT,
    secure: process.env.DEV_MAIL_SECURE || false,
  },
  logger: {
    level: process.env.LOGGER_LEVEL,
  },
  paystack: {
    secret_key: process.env.PAYSTACK_TEST_SECRET_KEY || '',
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

export default config;
