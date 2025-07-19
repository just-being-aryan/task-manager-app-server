import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './config/db.js';

// Handle __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  const schemaPath = path.join(__dirname, 'schema.sql');
  console.log('Looking for schema at:', schemaPath); // ← moved below declaration

  const schema = await fs.readFile(schemaPath, 'utf8');
  await pool.query(schema);

  console.log('✅ Database initialized successfully.');
  process.exit(0);
} catch (error) {
  console.error('❌ Failed to initialize database:', error.message);
  process.exit(1);
}
