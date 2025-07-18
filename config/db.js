import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.query('SELECT 1')
  .then(() => console.log(' MySQL DB connected successfully!'))
  .catch((err) => console.error(' MySQL connection failed:', err));

export default pool;
