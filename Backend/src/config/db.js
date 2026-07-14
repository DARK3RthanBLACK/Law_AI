import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const { Pool } = pg;

let pool = null;
let isFallback = true;

// Hashed password for default login demo 'password123'
const DEFAULT_PASS_HASH = bcrypt.hashSync('password123', 10);

// In-memory fallback dataset
export const mockUsersDb = [
  {
    id: 'user-1',
    email: 'user@lawai.com',
    passwordHash: DEFAULT_PASS_HASH,
    googleId: null,
    createdAt: new Date()
  }
];

// Initialize PostgreSQL connection
if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // Enforce SSL reject override for hosted database services (like Neon/Render)
      ssl: process.env.DATABASE_URL.includes('sslmode=') || process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false
    });

    // Verify socket connection
    const client = await pool.connect();
    console.log('\n==================================================');
    console.log('[DATABASE] Connected to PostgreSQL successfully.');

    // Execute Auto-Migration to establish user table structure
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NULL, -- Optional for OAuth accounts
        google_id VARCHAR(255) NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('[DATABASE] Users table structure verified.');

    // Seed default developer credentials if empty
    const checkSeed = await client.query('SELECT COUNT(*) FROM users');
    if (parseInt(checkSeed.rows[0].count) === 0) {
      await client.query(
        "INSERT INTO users (id, email, password_hash) VALUES ($1, $2, $3)",
        ['user-1', 'user@lawai.com', DEFAULT_PASS_HASH]
      );
      console.log('[DATABASE] Seeded default credentials user (user@lawai.com / password123)');
    }
    console.log('==================================================\n');

    client.release();
    isFallback = false;
  } catch (err) {
    console.error('\n==================================================');
    console.error('[DATABASE] Failed to connect to PostgreSQL. Falling back to in-memory.');
    console.error('Error Details:', err.message);
    console.error('==================================================\n');
    isFallback = true;
  }
} else {
  console.log('\n==================================================');
  console.log('[DATABASE] DATABASE_URL is absent. Falling back to in-memory.');
  console.log('==================================================\n');
  isFallback = true;
}

// Unified repository to isolate routes from switching details
export const usersRepository = {
  isFallbackMode: () => isFallback,

  findByEmail: async (email) => {
    const cleanEmail = email.toLowerCase().trim();
    if (isFallback) {
      return mockUsersDb.find(u => u.email === cleanEmail) || null;
    }
    const res = await pool.query('SELECT * FROM users WHERE email = $1', [cleanEmail]);
    return res.rows[0] || null;
  },

  findById: async (id) => {
    if (isFallback) {
      return mockUsersDb.find(u => u.id === id) || null;
    }
    const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return res.rows[0] || null;
  },

  create: async ({ id, email, passwordHash = null, googleId = null }) => {
    const cleanEmail = email.toLowerCase().trim();
    const newUser = {
      id,
      email: cleanEmail,
      passwordHash,
      googleId,
      createdAt: new Date()
    };

    if (isFallback) {
      mockUsersDb.push(newUser);
      return newUser;
    }

    const queryText = `
      INSERT INTO users (id, email, password_hash, google_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const res = await pool.query(queryText, [id, cleanEmail, passwordHash, googleId]);
    return res.rows[0];
  },

  updateGoogleId: async (email, googleId) => {
    const cleanEmail = email.toLowerCase().trim();
    if (isFallback) {
      const user = mockUsersDb.find(u => u.email === cleanEmail);
      if (user) {
        user.googleId = googleId;
      }
      return user;
    }

    const queryText = `
      UPDATE users 
      SET google_id = $2 
      WHERE email = $1 
      RETURNING *;
    `;
    const res = await pool.query(queryText, [cleanEmail, googleId]);
    return res.rows[0] || null;
  }
};
