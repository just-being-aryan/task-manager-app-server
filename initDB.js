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
    try {
      // Split SQL statements by semicolon and filter out empty statements
      const statements = schema
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
      
      console.log(`Executing ${statements.length} SQL statements...`);
      
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        console.log(`Executing statement ${i + 1}:`, statement.substring(0, 50) + '...');
        await pool.query(statement);
        console.log(`✅ Statement ${i + 1} executed successfully`);
      }
      
      console.log('✅ Database schema updated successfully');
      process.exit(0);
    } catch (error) {
      console.error('❌ Database initialization failed:', error.message);
      console.error('Full error:', error);
      process.exit(1);
    }
  };
  
  run();
} catch (err) {
  console.error('❌ Failed to read schema file:', err);
  process.exit(1);
}
