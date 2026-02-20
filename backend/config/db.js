import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_DBNAME,
  ssl: process.env.DATABASE_HOST === 'db' 
    ? false 
    : { rejectUnauthorized: false }
});

export default { query: (text, params) => pool.query(text, params) };
