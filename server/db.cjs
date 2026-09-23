const fs = require('node:fs');
const path = require('node:path');

let connection;
let ready;
const schema = [
  `CREATE TABLE IF NOT EXISTS admins (email TEXT PRIMARY KEY, password_hash TEXT NOT NULL, created_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, email TEXT NOT NULL REFERENCES admins(email), expires_at BIGINT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, reference TEXT NOT NULL UNIQUE, idempotency_key TEXT NOT NULL UNIQUE, payload_hash TEXT NOT NULL, status TEXT NOT NULL, version INTEGER NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, customer_name TEXT NOT NULL, phone TEXT NOT NULL, fulfillment TEXT NOT NULL, total INTEGER NOT NULL, data TEXT NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS orders_created ON orders(created_at)`,
  `CREATE INDEX IF NOT EXISTS orders_status ON orders(status)`,
  `CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, hits INTEGER NOT NULL, expires_at BIGINT NOT NULL)`
];

function getConnection() {
  if (connection) return connection;
  if (process.env.DATABASE_URL) {
    const { Pool } = require('pg');
    const databaseUrl = new URL(process.env.DATABASE_URL);
    // Keep certificate and hostname verification explicit across pg upgrades.
    if (['prefer', 'require', 'verify-ca'].includes(databaseUrl.searchParams.get('sslmode'))) databaseUrl.searchParams.set('sslmode', 'verify-full');
    connection = new Pool({ connectionString: databaseUrl.toString(), max: 3, connectionTimeoutMillis: 8000, idleTimeoutMillis: 10000 });
    connection.on('error', () => console.error('Database connection interrupted.'));
  } else {
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') throw new Error('DATABASE_URL is required in production.');
    const { DatabaseSync } = require('node:sqlite');
    const file = process.env.SQLITE_PATH || path.join(__dirname, '..', '.data', 'realeza.sqlite');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    connection = new DatabaseSync(file);
    connection.exec('PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;');
  }
  return connection;
}

async function raw(sql, values = []) {
  const db = getConnection();
  if (process.env.DATABASE_URL) return db.query(sql, values);
  // Expand numbered placeholders in occurrence order for the SQLite development adapter.
  const args = [];
  const translated = sql.replace(/\$(\d+)/g, (_, n) => { args.push(values[Number(n) - 1]); return '?'; });
  const statement = db.prepare(translated);
  if (/^\s*SELECT/i.test(sql) || /\bRETURNING\b/i.test(sql)) {
    const rows = statement.all(...args);
    return { rows, rowCount: rows.length };
  }
  const result = statement.run(...args);
  return { rows: [], rowCount: Number(result.changes) };
}

async function init() {
  if (!ready) ready = (async () => {
    if (!process.env.DATABASE_URL) { for (const sql of schema) await raw(sql); return; }
    const client = await getConnection().connect();
    try {
      await client.query('BEGIN');
      // Serialize first-time schema creation across serverless instances.
      await client.query('SELECT pg_advisory_xact_lock(73422018)');
      for (const sql of schema) await client.query(sql);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally { client.release(); }
  })().catch(error => { ready = null; throw error; });
  return ready;
}
async function query(sql, values) { await init(); return raw(sql, values); }
async function close() { if (connection) await (process.env.DATABASE_URL ? connection.end() : connection.close()); connection = null; ready = null; }
module.exports = { query, init, close };
