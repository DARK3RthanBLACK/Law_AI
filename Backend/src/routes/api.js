import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Mock Chat History Data
const mockHistory = [
  {
    id: 'chat-1',
    title: 'Constitutional Rights Query',
    preview: 'Can you explain the freedom of speech under the First Amendment?',
    timestamp: '2026-07-13T10:30:00Z',
    messages: [
      { sender: 'user', text: 'Can you explain the freedom of speech under the First Amendment?' },
      { sender: 'ai', text: 'The First Amendment guarantees freedom of speech, religion, press, assembly, and the right to petition the government. However, it is not absolute and does not protect categories like defamation, incitement, or obscenity.' }
    ]
  },
  {
    id: 'chat-2',
    title: 'Tenant Contract Review',
    preview: 'Look for liability clauses in standard rental contracts...',
    timestamp: '2026-07-12T14:15:00Z',
    messages: [
      { sender: 'user', text: 'Look for liability clauses in standard rental contracts.' },
      { sender: 'ai', text: 'Standard rental contracts typically contain liability limitations. Look for clauses titled "Limitation of Liability", "Indemnification", or "Hold Harmless". These usually shift risk from landlord to tenant for property damage or personal injuries.' }
    ]
  },
  {
    id: 'chat-3',
    title: 'Corporate IP Protection',
    preview: 'What is the process to file a provisional patent?',
    timestamp: '2026-07-10T09:00:00Z',
    messages: [
      { sender: 'user', text: 'What is the process to file a provisional patent?' },
      { sender: 'ai', text: 'To file a provisional patent application (PPA), you need to prepare a written description of your invention, drawings if necessary, and pay the filing fee. It gives you "patent pending" status for 12 months, during which you must file a non-provisional application to maintain priority.' }
    ]
  }
];

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

// GET /api/history - Return mock chat history (Protected)
router.get('/history', authMiddleware, (req, res) => {
  res.json(mockHistory);
});

// POST /api/chat - Handle chat prompt (mock response with delay) (Protected)
router.post('/chat', authMiddleware, (req, res) => {
  const { prompt, history = [] } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  // TODO: Forward this request to the FastAPI AI microservice in production.
  
  // Simulate network/model inference latency
  setTimeout(() => {
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

    res.json({
      sender: 'ai',
      text: reply,
      timestamp: new Date().toISOString()
    });
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
