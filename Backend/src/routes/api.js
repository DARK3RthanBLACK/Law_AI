import express from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import User from '../models/User.js';
import Chat from '../models/Chat.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Helper to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET || 'supersecretlawaijwtkey123!@#',
    { expiresIn: '7d' }
  );
};

// ==========================================
// AUTHENTICATION ENDPOINTS
// ==========================================

// POST /api/register - Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Please provide name, email, and password.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use.' });
    }

    // Create new user
    const newUser = new User({ name, email, password });
    await newUser.save();

    // Generate token
    const token = generateToken(newUser);

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration. Please try again.' });
  }
});

// POST /api/login - Log in an existing user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password.' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login. Please try again.' });
  }
});

// ==========================================
// PROTECTED API ENDPOINTS
// ==========================================

// GET /api/history - Return all chat sessions for authenticated user (Protected)
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    
    // Map database chats to front-end schema
    const formattedChats = chats.map(chat => ({
      id: chat._id,
      title: chat.title,
      preview: chat.preview,
      timestamp: chat.updatedAt.toISOString(),
      messages: chat.messages
    }));
    
    res.json(formattedChats);
  } catch (err) {
    console.error('Fetch history error:', err);
    res.status(500).json({ error: 'Server error fetching chat history.' });
  }
});

// DELETE /api/history/:id - Delete a chat session for authenticated user (Protected)
router.delete('/history/:id', authMiddleware, async (req, res) => {
  try {
    const result = await Chat.deleteOne({ _id: req.params.id, userId: req.user.id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Chat session not found.' });
    }
    
    res.json({ success: true, message: 'Chat session deleted successfully.' });
  } catch (err) {
    console.error('Delete chat error:', err);
    res.status(500).json({ error: 'Server error deleting chat session.' });
  }
});

// POST /api/chat - Proxy prompt to the Gemma model FastAPI server (Protected)
router.post('/chat', authMiddleware, async (req, res) => {
  const { prompt, chatId, conversationHistory, language } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  const modelApiUrl = process.env.MODEL_API_URL;

  // ── 1. Call the Gemma FastAPI model server ──────────────────────────────────
  let reply;
  let modelMeta = {}; // extra fields from the model (needs_more_info, clarifying_questions, etc.)

  if (!modelApiUrl) {
    console.warn('MODEL_API_URL is not set. Returning fallback response.');
    reply = 'The AI model server is not configured. Please set MODEL_API_URL in the backend .env file and ensure the Kaggle notebook is running.';
  } else {
    try {
      // Build the history array expected by run_interactively.
      // conversationHistory is optional; we always append the current prompt.
      const history = Array.isArray(conversationHistory) ? conversationHistory : [];

      const modelResponse = await axios.post(
        `${modelApiUrl}/agent`,
        { prompt, history, language },
        { 
          headers: { 'ngrok-skip-browser-warning': 'true' },
          timeout: 300000 // 5-minute timeout for slow GPU threads
        }
      );

      const data = modelResponse.data;

      // The notebook returns { draft, needs_more_info, clarifying_questions, eval_result, case_facts, language }
      if (data.needs_more_info) {
        reply = data.clarifying_questions && data.clarifying_questions.length > 0
          ? data.clarifying_questions.join('\n')
          : 'I need a bit more information to assist you. Could you please provide more details about your situation?';
      } else {
        reply = data.draft || data.response || 'The model returned an empty response.';
      }

      modelMeta = {
        needs_more_info: !!data.needs_more_info,
        clarifying_questions: data.clarifying_questions || [],
        eval_result: data.eval_result || {},
        case_facts: data.case_facts || {},
        language: data.language || 'English'
      };
    } catch (err) {
      if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND' || err.code === 'ECONNABORTED') {
        console.error('Model server unreachable:', err.message);
        reply = 'The AI model server is currently unreachable. Please ensure the Kaggle notebook is running and the ngrok tunnel is active, then update MODEL_API_URL in the backend .env file.';
      } else if (err.response) {
        console.error('Model server returned an error:', err.response.status, err.response.data);
        reply = `The AI model server returned an error (HTTP ${err.response.status}). Please check the notebook logs.`;
      } else {
        console.error('Unexpected error calling model server:', err.message);
        reply = 'An unexpected error occurred while contacting the AI model. Please try again.';
      }
    }
  }

  // ── 2. Persist the exchange to MongoDB ─────────────────────────────────────
  try {
    const userMessage = { sender: 'user', text: prompt, timestamp: new Date() };
    const aiMessage   = { sender: 'ai',   text: reply,  timestamp: new Date() };

    let targetChat;

    if (chatId) {
      // Appending to an existing chat session
      targetChat = await Chat.findOne({ _id: chatId, userId: req.user.id });
      if (targetChat) {
        targetChat.messages.push(userMessage);
        targetChat.messages.push(aiMessage);
        targetChat.preview = reply.substring(0, 60) + (reply.length > 60 ? '...' : '');
        await targetChat.save();
      } else {
        // chatId provided but not found — create a fresh session
        targetChat = new Chat({
          userId:   req.user.id,
          title:    prompt.length > 25 ? prompt.substring(0, 25) + '...' : prompt,
          preview:  reply.substring(0, 60) + (reply.length > 60 ? '...' : ''),
          messages: [userMessage, aiMessage]
        });
        await targetChat.save();
      }
    } else {
      // Creating a brand-new chat session
      targetChat = new Chat({
        userId:   req.user.id,
        title:    prompt.length > 25 ? prompt.substring(0, 25) + '...' : prompt,
        preview:  reply.substring(0, 60) + (reply.length > 60 ? '...' : ''),
        messages: [userMessage, aiMessage]
      });
      await targetChat.save();
    }

    res.json({
      sender:    'ai',
      text:      reply,
      timestamp: aiMessage.timestamp.toISOString(),
      chatId:    targetChat._id,
      ...modelMeta  // passes needs_more_info, clarifying_questions, eval_result to frontend
    });
  } catch (dbErr) {
    console.error('Error saving chat message to database:', dbErr);
    res.status(500).json({ error: 'Server error persisting chat message.' });
  }
});

// POST /api/draft-notice - Generate formal legal demand notice from structured case facts (Protected)
router.post('/draft-notice', authMiddleware, async (req, res) => {
  const { case_facts, language } = req.body;
  const modelApiUrl = process.env.MODEL_API_URL;

  if (!modelApiUrl) {
    return res.status(503).json({
      error: 'The AI model server is not configured. Please set MODEL_API_URL in the backend .env file.'
    });
  }

  try {
    const modelResponse = await axios.post(
      `${modelApiUrl}/draft-notice`,
      { case_facts, language: language || 'English' },
      {
        headers: { 'ngrok-skip-browser-warning': 'true' },
        timeout: 300000 // 5-minute timeout
      }
    );

    res.json({ notice: modelResponse.data.notice });
  } catch (err) {
    console.error('Error generating notice:', err.message);
    res.status(502).json({ error: 'Failed to generate legal notice from AI model server.' });
  }
});

// POST /api/upload - Handle file upload (Protected)
// NOTE: Full PDF ingestion via the model server is deferred.
// The endpoint currently accepts the file metadata and returns a confirmation.
// To enable real PDF processing, forward the file to MODEL_API_URL/upload
// and integrate it with the notebook's load_chunks / ChromaDB pipeline.
router.post('/upload', authMiddleware, (req, res) => {
  const simulatedFile = {
    filename: 'document.pdf',
    size: 0,
    mimetype: 'application/pdf',
    uploadedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    message: 'File received. Full document analysis via the AI model is coming soon.',
    file: simulatedFile
  });
});

export default router;
