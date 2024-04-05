import dotenv from 'dotenv';
import development from './development';
import production from './production';

export interface Config {
  app: {
    name: string;
    env: 'production' | 'development' | 'test';
    port: string | number;
    baseUrl: string;
  };

  db: {
    uri: string;
  };
  smtp: {
    user: string;
    pass: string;
    host: string;
    port: string;
    secure: boolean | string;
  };
  logger: {
    level: string;
  };
  paystack: {
    secret_key: string;
    subaccount: {
      account_number: string;
      bank_code: string;
      code: string;
    };
  };
  oauth: {
    google: {
      clientId: string;
      clientSecret: string;
    };
  };
  maps: {
    api_key: string;
  };
}

const config = process.env.NODE_ENV === 'development' ? development : production;

export default config;
