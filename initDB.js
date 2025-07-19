// initDB.js
import dotenv from 'dotenv';
import pool from './config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaPath = path.join(__dirname, 'schema.sql');
console.log('Looking for schema at:', schemaPath);

try {
  const schema = fs.readFileSync(schemaPath, 'utf8');
  const run = async () => {
    await pool.query(schema);
    console.log('✅ Database initialized');
    process.exit(0);
  };
  run();
} catch (err) {
  console.error('❌ Failed to initialize database:', err);
  process.exit(1);
}
