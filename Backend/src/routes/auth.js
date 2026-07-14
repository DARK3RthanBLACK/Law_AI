import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { usersRepository } from '../config/db.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'lawai-secret-key-12345';

// OTP Store (in-memory mapping: email -> { code, expiresAt })
const otpStore = {};

// Send OTP endpoint
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email address is required.' });
  }

  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  // Check user existence in repository (Postgres or Mock fallback)
  const existing = await usersRepository.findByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  // Generate 6-digit random code
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Store in memory (expires in 5 minutes)
  otpStore[email.toLowerCase()] = {
    code: otpCode,
    expiresAt: Date.now() + 5 * 60 * 1000
  };

  // Log in terminal console for easy developer local testing
  console.log(`\n==============================================`);
  console.log(`[OTP SERVICE] Generated OTP for ${email}: ${otpCode}`);
  console.log(`==============================================\n`);

  // Send real email in the background if SMTP credentials are provided
  const useSmtp = process.env.SMTP_USER && process.env.SMTP_PASS;
  if (useSmtp) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    transporter.sendMail({
      from: `"LawAI Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'LawAI Email Verification Code (OTP)',
      text: `Your LawAI verification code is: ${otpCode}. It expires in 5 minutes.`,
      html: `
        <div style="font-family: sans-serif; padding: 24px; border: 1px solid #1e293b; border-radius: 8px; max-width: 500px; margin: 0 auto; background: #000000; color: #ffffff;">
          <h2 style="color: #d4af37; text-align: center; margin-bottom: 20px; font-weight: bold;">LawAI Verification Code</h2>
          <p style="color: #94a3b8; font-size: 14px; line-height: 1.5;">Thank you for signing up with LawAI. Please enter the following 6-digit verification code (OTP) to complete your registration:</p>
          <div style="font-size: 28px; font-weight: bold; letter-spacing: 6px; padding: 16px; background: #0a0a0a; color: #d4af37; text-align: center; border-radius: 8px; margin: 24px 0; border: 1px solid #b59023;">
            ${otpCode}
          </div>
          <p style="color: #64748b; font-size: 11px; text-align: center;">This code will expire in 5 minutes. If you did not initiate this signup, you can safely ignore this email.</p>
        </div>
      `
    })
    .then(info => {
      console.log(`[OTP SMTP SUCCESS] Email successfully sent to ${email}`);
    })
    .catch(err => {
      console.error(`[OTP SMTP ERROR] Failed to send email to ${email}:`, err);
    });
  }

  // Return code in JSON in development mode immediately so the UI is fast and responsive
  const isDev = process.env.NODE_ENV !== 'production';
  res.json({
    message: 'Verification OTP code generated.',
    ...(isDev && { devOtp: otpCode }) // Expose OTP on API only in local development/test modes
  });
});

// Signup endpoint
router.post('/signup', async (req, res) => {
  const { email, password, otp } = req.body;

  if (!email || !password || !otp) {
    return res.status(400).json({ error: 'Email, password, and OTP code are required.' });
  }

  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  // Check user existence
  const existing = await usersRepository.findByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  // Verify OTP
  const otpRecord = otpStore[email.toLowerCase()];
  if (!otpRecord) {
    return res.status(400).json({ error: 'No verification code requested for this email. Please request a new code.' });
  }

  if (Date.now() > otpRecord.expiresAt) {
    delete otpStore[email.toLowerCase()];
    return res.status(400).json({ error: 'Verification code has expired. Please request a new code.' });
  }

  if (otpRecord.code !== otp.trim()) {
    return res.status(400).json({ error: 'Invalid verification code. Please check and try again.' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Save to Postgres (or fallback array)
    const newUser = await usersRepository.create({
      id: `user-${Date.now()}`,
      email: email.toLowerCase(),
      passwordHash
    });

    delete otpStore[email.toLowerCase()]; // Clear code on verification success

    // Sign session token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email
      }
    });
  } catch (err) {
    console.error('Signup validation error:', err);
    res.status(500).json({ error: 'Error occurred during registration.' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = await usersRepository.findByEmail(email);
  if (!user) {
    return res.status(400).json({ error: 'Invalid email or password.' });
  }

  // Handle case where user registered via Google OAuth and has no password hash
  if (!user.passwordHash) {
    return res.status(400).json({ error: 'This email is linked to Google Sign-In. Please click "Continue with Google".' });
  }

  try {
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Sign session token
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login validation error:', err);
    res.status(500).json({ error: 'Error occurred during login.' });
  }
});

// Get current user profile (/me)
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No authentication token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Resolve user details from Postgres or Fallback
    const user = await usersRepository.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Session user account no longer exists.' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }
});

// Google Login Endpoint (Simulated OAuth)
router.post('/google-login', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Google email is required.' });
  }

  try {
    // Find or create the user in our database (Postgres or Fallback)
    let user = await usersRepository.findByEmail(email);
    if (!user) {
      user = await usersRepository.create({
        id: `google-${Date.now()}`,
        email: email.toLowerCase(),
        googleId: 'google-oauth'
      });
    } else if (!user.googleId) {
      // Link Google ID if existing email logs in via Google
      user = await usersRepository.updateGoogleId(email, 'google-oauth');
    }

    // Sign session token
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(550).json({ error: 'Error occurred during Google sign-in.' });
  }
});

export default router;
