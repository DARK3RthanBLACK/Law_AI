import express from 'express';

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

// GET /api/history - Return mock chat history
router.get('/history', (req, res) => {
  res.json(mockHistory);
});

// POST /api/chat - Handle chat prompt (mock response with delay)
router.post('/chat', (req, res) => {
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

// POST /api/upload - Handle file upload (mock endpoint)
router.post('/upload', (req, res) => {
  // Normally we would use multer middleware here to parse files.
  // For standard mock, we simulate receiving files and return metadata.
  
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
