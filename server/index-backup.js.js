import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, 'data.json');
const app = express();
const PORT = process.env.PORT || 4000;
const SECRET = process.env.JWT_SECRET || 'development-secret-change-me';
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '20kb' }));

async function readData() {
  try { return JSON.parse(await fs.readFile(DATA_FILE, 'utf8')); }
  catch {
    const adminHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'GantiPasswordAdmin123!', 10);
    const initial = { admin: { username: process.env.ADMIN_USERNAME || 'admin', passwordHash: adminHash }, users: [] };
    await writeData(initial); return initial;
  }
}
async function writeData(data) { await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2)); }
function tokenFor(payload) { return jwt.sign(payload, SECRET, { expiresIn: '12h' }); }
function auth(req, res, next) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  try { req.session = jwt.verify(token, SECRET); next(); }
  catch { res.status(401).json({ message: 'Sesi tidak valid. Silakan login kembali.' }); }
}
function adminOnly(req, res, next) { if (req.session.role !== 'admin') return res.status(403).json({ message: 'Khusus admin.' }); next(); }
function safeUser(user) { const { passwordHash, ...rest } = user; return rest; }

app.get('/api/health', (_req, res) => res.json({ status: 'ok', name: 'CHEAT SLOT 2026 API' }));
app.post('/api/login', async (req, res) => {
  const { userId, password } = req.body || {};
  if (!userId || !password) return res.status(400).json({ message: 'ID dan password wajib diisi.' });
  const data = await readData();
  if (userId === data.admin.username && await bcrypt.compare(password, data.admin.passwordHash)) {
    return res.json({ token: tokenFor({ role: 'admin', userId }), role: 'admin', user: { userId, name: 'Administrator' } });
  }
  const user = data.users.find(u => u.userId.toLowerCase() === String(userId).toLowerCase());
  if (!user || !user.active || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: 'ID atau password salah, atau akun tidak aktif.' });
  res.json({ token: tokenFor({ role: 'user', userId: user.userId }), role: 'user', user: safeUser(user) });
});
app.get('/api/me', auth, async (req, res) => {
  if (req.session.role === 'admin') return res.json({ role: 'admin', user: { userId: req.session.userId, name: 'Administrator' } });
  const data = await readData(); const user = data.users.find(u => u.userId === req.session.userId);
  if (!user) return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
  res.json({ role: 'user', user: safeUser(user) });
});
app.get('/api/users', auth, adminOnly, async (_req, res) => { const data = await readData(); res.json(data.users.map(safeUser)); });
app.post('/api/users', auth, adminOnly, async (req, res) => {
  const { userId, password, name, game, status, notes } = req.body || {};
  if (!userId?.trim() || !password || password.length < 6) return res.status(400).json({ message: 'Isi User ID dan password minimal 6 karakter.' });
  const data = await readData();
  if (data.users.some(u => u.userId.toLowerCase() === userId.trim().toLowerCase())) return res.status(409).json({ message: 'User ID sudah digunakan.' });
  const user = { userId: userId.trim(), passwordHash: await bcrypt.hash(password, 10), name: name?.trim() || userId.trim(), game: game || 'Demo Game A', status: status || 'Aktif', active: true, notes: notes || '', createdAt: new Date().toISOString(), metrics: { sessions: 0, activity: 'Belum ada aktivitas' } };
  data.users.push(user); await writeData(data); res.status(201).json(safeUser(user));
});
app.put('/api/users/:userId', auth, adminOnly, async (req, res) => {
  const data = await readData(); const user = data.users.find(u => u.userId === req.params.userId);
  if (!user) return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
  const { name, game, status, notes, active, password } = req.body || {};
  if (name !== undefined) user.name = name;
  if (game !== undefined) user.game = game;
  if (status !== undefined) user.status = status;
  if (notes !== undefined) user.notes = notes;
  if (active !== undefined) user.active = Boolean(active);
  if (password) { if (password.length < 6) return res.status(400).json({ message: 'Password minimal 6 karakter.' }); user.passwordHash = await bcrypt.hash(password, 10); }
  await writeData(data); res.json(safeUser(user));
});
app.delete('/api/users/:userId', auth, adminOnly, async (req, res) => {
  const data = await readData(); const before = data.users.length;
  data.users = data.users.filter(u => u.userId !== req.params.userId);
  if (before === data.users.length) return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
  await writeData(data); res.json({ message: 'Pengguna dihapus.' });
});
app.listen(PORT, () => console.log(`CHEAT SLOT 2026 API berjalan di http://localhost:${PORT}`));
