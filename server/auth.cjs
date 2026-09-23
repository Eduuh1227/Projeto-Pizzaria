const { randomBytes, scrypt, timingSafeEqual, createHash } = require('node:crypto');
const { promisify } = require('node:util');
const { query } = require('./db.cjs');
const derive = promisify(scrypt);
const production = () => Boolean(process.env.VERCEL || process.env.NODE_ENV === 'production');
const cookieName = () => production() ? '__Host-realeza-admin' : 'realeza-admin';
const digest = value => createHash('sha256').update(value).digest('hex');
const SESSION_MS = 8 * 60 * 60 * 1000;

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const key = await derive(password, salt, 64, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  return `${salt}:${key.toString('hex')}`;
}
async function verifyPassword(password, stored) {
  const [salt, hash] = (stored || `${'0'.repeat(32)}:${'0'.repeat(128)}`).split(':');
  const key = await derive(password, salt, 64, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  const expected = Buffer.from(hash, 'hex');
  return key.length === expected.length && timingSafeEqual(key, expected) && Boolean(stored);
}
function sessionToken(req) {
  const part = (req.headers.cookie || '').split(';').find(value => value.trim().startsWith(`${cookieName()}=`));
  const token = part?.trim().slice(cookieName().length + 1) || '';
  return /^[a-f0-9]{64}$/.test(token) ? token : '';
}
function setCookie(res, token, age = SESSION_MS / 1000) {
  res.setHeader('Set-Cookie', `${cookieName()}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${age}${production() ? '; Secure' : ''}`);
}
async function getSession(req) {
  const token = sessionToken(req);
  if (!token) return null;
  const result = await query('SELECT email FROM sessions WHERE token_hash=$1 AND expires_at>$2', [digest(token), Date.now()]);
  return result.rows[0] || null;
}
async function login(email, password, req, res) {
  const { rows } = await query('SELECT password_hash FROM admins WHERE email=$1', [email]);
  if (!await verifyPassword(password, rows[0]?.password_hash)) return false;
  await logout(req, res);
  await query('DELETE FROM sessions WHERE expires_at<$1', [Date.now()]);
  const token = randomBytes(32).toString('hex');
  await query('INSERT INTO sessions(token_hash,email,expires_at) VALUES($1,$2,$3)', [digest(token), email, Date.now() + SESSION_MS]);
  setCookie(res, token);
  return true;
}
async function logout(req, res) {
  const token = sessionToken(req);
  if (token) await query('DELETE FROM sessions WHERE token_hash=$1', [digest(token)]);
  setCookie(res, '', 0);
}
async function limit(key, max, period) {
  const now = Date.now();
  const bucket = `${key}:${Math.floor(now / period)}`;
  const result = await query('INSERT INTO rate_limits(key,hits,expires_at) VALUES($1,1,$2) ON CONFLICT(key) DO UPDATE SET hits=rate_limits.hits+1 RETURNING hits', [bucket, now + period]);
  await query('DELETE FROM rate_limits WHERE expires_at<$1', [now]);
  return result.rows[0].hits <= max;
}
module.exports = { digest, hashPassword, getSession, login, logout, limit, production };
