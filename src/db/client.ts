import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { config } from '../config';

export const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  user: config.db.user,
  password: config.db.password,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export async function initDatabase(): Promise<void> {
  const initSqlPath = path.join(__dirname, 'init.sql');
  if (fs.existsSync(initSqlPath)) {
    const sql = fs.readFileSync(initSqlPath, 'utf8');
    await pool.query(sql);
  }
}

export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const res = await pool.query('SELECT 1');
    return res.rowCount === 1;
  } catch (error) {
    return false;
  }
}
