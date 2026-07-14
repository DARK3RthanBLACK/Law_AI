import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import mongoose from 'mongoose';
import apiRouter from './src/routes/api.js';
import authRouter from './src/routes/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lawai';
mongoose.connect(mongoUri)
  .then(async () => {
    console.log('MongoDB connected successfully');
    // Drop legacy Firebase unique index if it exists
    try {
      const db = mongoose.connection.db;
      await db.collection('users').dropIndex('firebaseUid_1');
      console.log('Successfully dropped legacy unique index: firebaseUid_1');
    } catch (err) {
      // Ignore if index doesn't exist
      if (err.code !== 27 && err.codeName !== 'IndexNotFound') {
        console.log('Note on index configuration:', err.message);
      }
    }
  })
  .catch((err) => console.error('MongoDB connection error:', err));


// Middleware
app.use(cors());
app.use(express.json());

// Route wiring
app.use('/api/auth', authRouter);
app.use('/api', apiRouter);

// Base health route
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Serve static files from the React frontend build
const frontendDist = path.join(__dirname, '../Frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
} else {
  console.warn(`WARNING: Frontend build folder not found at ${frontendDist}. Static file serving is disabled.`);
}

// Fallback to React Router index.html for SPA support
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
    return next();
  }
  const indexPath = path.join(frontendDist, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Frontend build files not found. Please ensure that the frontend was compiled during deployment.');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Trigger reload for PostgreSQL configuration
