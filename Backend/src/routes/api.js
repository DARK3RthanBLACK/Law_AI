import express from 'express';
import jwt from 'jsonwebtoken';
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

// POST /api/chat - Handle chat prompt (mock response with delay) (Protected)
router.post('/chat', authMiddleware, async (req, res) => {
  const { prompt, chatId } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  // Simulate network/model inference latency
  setTimeout(async () => {
    try {
      // Basic rule-based responses based on prompt keywords to feel alive
      let reply = `I have received your prompt: "${prompt}". This is a mock AI response simulating a backend assistant. Once integrated, this request will be forwarded to your FastAPI model server for real-time natural language generation.`;

      const normalizedPrompt = prompt.toLowerCase();
      if (normalizedPrompt.includes('contract') || normalizedPrompt.includes('agreement') || normalizedPrompt.includes('lease')) {
        reply = `Regarding your inquiry about contracts: Under standard legal frameworks, contracts require mutual assent, offer, acceptance, and consideration. For precise contract review, our system will utilize NLP models to parse liability, termination, and indemnity clauses.`;
      } else if (normalizedPrompt.includes('patent') || normalizedPrompt.includes('ip') || normalizedPrompt.includes('trademark') || normalizedPrompt.includes('copyright')) {
        reply = `Intellectual property law covers patents, trademarks, copyrights, and trade secrets. This mock assistant notes that your question concerns IP protection. When connected to the production AI engine, it will analyze your concept against current IP databases.`;
      } else if (normalizedPrompt.includes('hello') || normalizedPrompt.includes('hi') || normalizedPrompt.includes('hey')) {
        reply = `Hello! I am your AI Assistant. How can I help you today? You can ask me legal questions, document review tasks, or request text summaries.`;
      }

      const userMessage = { sender: 'user', text: prompt, timestamp: new Date() };
      const aiMessage = { sender: 'ai', text: reply, timestamp: new Date() };
      
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
          // If chatId was provided but not found, fallback to creating a new one
          targetChat = new Chat({
            userId: req.user.id,
            title: prompt.length > 25 ? prompt.substring(0, 25) + '...' : prompt,
            preview: reply.substring(0, 60) + (reply.length > 60 ? '...' : ''),
            messages: [userMessage, aiMessage]
          });
          await targetChat.save();
        }
      } else {
        // Creating a new chat session
        targetChat = new Chat({
          userId: req.user.id,
          title: prompt.length > 25 ? prompt.substring(0, 25) + '...' : prompt,
          preview: reply.substring(0, 60) + (reply.length > 60 ? '...' : ''),
          messages: [userMessage, aiMessage]
        });
        await targetChat.save();
      }

      res.json({
        sender: 'ai',
        text: reply,
        timestamp: aiMessage.timestamp.toISOString(),
        chatId: targetChat._id
      });
    } catch (err) {
      console.error('Error saving chat message to database:', err);
      // Fallback response if DB save fails
      res.status(500).json({ error: 'Server error processing chat request.' });
    }
  }, 1500); // 1.5 seconds mock delay
});

// POST /api/upload - Handle file upload (mock endpoint) (Protected)
router.post('/upload', authMiddleware, (req, res) => {
  const simulatedFile = {
    filename: 'mock_document_legal.pdf',
    size: 245310, // ~240 KB
    mimetype: 'application/pdf',
    uploadedAt: new Date().toISOString()
  };

  // Simulate file parsing delay
  setTimeout(() => {
    res.json({
      success: true,
      message: 'File uploaded and pre-processed successfully.',
      file: simulatedFile
    });
  }, 1000);
});

export default router;
