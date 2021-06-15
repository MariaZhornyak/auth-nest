import { config as fromFile } from 'dotenv';

fromFile({ path: '.env' });

export const config = {
  port: process.env.PORT,
  dbURL: process.env.DB_URL,
};