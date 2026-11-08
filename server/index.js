
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;
const app = express();
const PORT = process.env.PORT || 4000;

const SECRET = process.env.JWT_SECRET;
const DATABASE_URL = process.env.DATABASE_URL;

if (!SECRET || !DATABASE_URL) {
  throw new Error('JWT_SECRET dan DATABASE_URL wajib diatur.');
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5
});

const allowedOrigins = [
  'http://localhost:5173',
  'http://10.254.202.198:5173',
  ...(process.env.CLIENT_ORIGIN || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean)
];

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Origin tidak diizinkan.'));
  }
}));

app.use(express.json({ limit: '20kb' }));

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      username TEXT PRIMARY KEY,
      password_hash TEXT NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      user_id TEXT PRIMARY KEY,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      game TEXT DEFAULT 'Demo Game A',
      status TEXT DEFAULT 'Aktif',
      active BOOLEAN DEFAULT TRUE,
      notes TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      metrics JSONB DEFAULT '{"sessions":0,"activity":"Belum ada aktivitas"}'
    )
  `);

  const username = process.env.ADMIN_USERNAME || 'teamzack';
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error('ADMIN_PASSWORD wajib diatur.');
  }

  const existingAdmin = await pool.query(
    'SELECT username FROM admins WHERE username = $1',
    [username]
  );

  if (existingAdmin.rowCount === 0) {
    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO admins (username, password_hash) VALUES ($1, $2)',
      [username, hash]
    );

    console.log('Akun admin berhasil dibuat.');
  }
}

function tokenFor(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '12h' });
}

function auth(req, res, next) {
  const token = (req.headers.authorization || '')
    .replace(/^Bearer\s+/i, '');

  try {
    req.session = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({
      message: 'Sesi tidak valid. Silakan login kembali.'
    });
  }
}

function adminOnly(req, res, next) {
  if (req.session.role !== 'admin') {
    return res.status(403).json({ message: 'Khusus admin.' });
  }
  next();
}

function safeUser(user) {
  return {
    userId: user.user_id,
    name: user.name,
    game: user.game,
    status: user.status,
    active: user.active,
    notes: user.notes,
    createdAt: user.created_at,
    metrics: user.metrics
  };
}

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    name: 'CYBERCORE API'
  });
});

app.post('/api/login', async (req, res) => {
  try {
    const { userId, password } = req.body || {};

    if (!userId || !password) {
      return res.status(400).json({
        message: 'ID dan password wajib diisi.'
      });
    }

    const admin = await pool.query(
      'SELECT * FROM admins WHERE username = $1',
      [userId]
    );

    if (
      admin.rowCount > 0 &&
      await bcrypt.compare(password, admin.rows[0].password_hash)
    ) {
      return res.json({
        token: tokenFor({ role: 'admin', userId }),
        role: 'admin',
        user: { userId, name: 'Administrator' }
      });
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE LOWER(user_id) = LOWER($1)',
      [String(userId)]
    );

    const user = result.rows[0];

    if (
      !user ||
      !user.active ||
      !(await bcrypt.compare(password, user.password_hash))
    ) {
      return res.status(401).json({
        message: 'ID atau password salah, atau akun tidak aktif.'
      });
    }

    res.json({
      token: tokenFor({ role: 'user', userId: user.user_id }),
      role: 'user',
      user: safeUser(user)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

app.get('/api/me', auth, async (req, res) => {
  try {
    if (req.session.role === 'admin') {
      return res.json({
        role: 'admin',
        user: {
          userId: req.session.userId,
          name: 'Administrator'
        }
      });
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE user_id = $1',
      [req.session.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'Pengguna tidak ditemukan.'
      });
    }

    res.json({
      role: 'user',
      user: safeUser(result.rows[0])
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

app.get('/api/users', auth, adminOnly, async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM users ORDER BY created_at DESC'
    );

    res.json(result.rows.map(safeUser));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil data pengguna.' });
  }
});

app.post('/api/users', auth, adminOnly, async (req, res) => {
  try {
    const { userId, password, name, game, status, notes } = req.body || {};

    if (!userId?.trim() || !password || password.length < 6) {
      return res.status(400).json({
        message: 'Isi User ID dan password minimal 6 karakter.'
      });
    }

    const id = userId.trim();

    const existing = await pool.query(
      'SELECT user_id FROM users WHERE LOWER(user_id) = LOWER($1)',
      [id]
    );

    if (existing.rowCount > 0) {
      return res.status(409).json({
        message: 'User ID sudah digunakan.'
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users
       (user_id, password_hash, name, game, status, active, notes)
       VALUES ($1, $2, $3, $4, $5, TRUE, $6)
       RETURNING *`,
      [
        id,
        hash,
        name?.trim() || id,
        game || 'Demo Game A',
        status || 'Aktif',
        notes || ''
      ]
    );

    res.status(201).json(safeUser(result.rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menambahkan pengguna.' });
  }
});

app.put('/api/users/:userId', auth, adminOnly, async (req, res) => {
  try {
    const { name, game, status, notes, active, password } = req.body || {};
    const id = req.params.userId;

    const found = await pool.query(
      'SELECT * FROM users WHERE user_id = $1',
      [id]
    );

    if (found.rowCount === 0) {
      return res.status(404).json({
        message: 'Pengguna tidak ditemukan.'
      });
    }

    const user = found.rows[0];

    if (name !== undefined) user.name = name;
    if (game !== undefined) user.game = game;
    if (status !== undefined) user.status = status;
    if (notes !== undefined) user.notes = notes;
    if (active !== undefined) user.active = Boolean(active);

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          message: 'Password minimal 6 karakter.'
        });
      }
      user.password_hash = await bcrypt.hash(password, 10);
    }

    const result = await pool.query(
      `UPDATE users SET
       name = $1, game = $2, status = $3,
       notes = $4, active = $5, password_hash = $6
       WHERE user_id = $7 RETURNING *`,
      [
        user.name,
        user.game,
        user.status,
        user.notes,
        user.active,
        user.password_hash,
        id
      ]
    );

    res.json(safeUser(result.rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal memperbarui pengguna.' });
  }
});

app.delete('/api/users/:userId', auth, adminOnly, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM users WHERE user_id = $1',
      [req.params.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'Pengguna tidak ditemukan.'
      });
    }

    res.json({ message: 'Pengguna dihapus.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menghapus pengguna.' });
  }
});

async function startServer() {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`CYBERCORE API berjalan di port ${PORT}`);
    });
  } catch (error) {
    console.error('Gagal menjalankan backend:', error);
    process.exit(1);
  }
}

startServer();
