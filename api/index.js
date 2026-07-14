import express from 'express';
import cors from 'cors';
import apiRouter from '../Backend/src/routes/api.js';
import authRouter from '../Backend/src/routes/auth.js';

const app = express();

app.use(cors());
app.use(express.json());

// Wire the Express routes
app.use('/api/auth', authRouter);
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', environment: 'vercel-serverless', timestamp: new Date() });
});

export default app;
