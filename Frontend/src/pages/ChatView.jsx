import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Send, 
  Paperclip, 
  Trash2, 
  Scale, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  ArrowLeft,
  Mic 
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ChatBubble from '../components/ChatBubble';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function ChatView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { authFetch } = useAuth();
  
  // State
  const [history, setHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [currentChatTitle, setCurrentChatTitle] = useState('New Session');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  
  // UI states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [apiStatus, setApiStatus] = useState({ online: true, message: 'Server Connected' });

  // Refs
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Fetch history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await authFetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Failed to load chat history:', err);
      setApiStatus({ online: false, message: 'Server Offline' });
    }
  };

  // Handle incoming location state (e.g. from Landing Page hero)
  useEffect(() => {
    if (location.state) {
      const { initialPrompt, triggerUpload } = location.state;
      
      // Auto-trigger prompt
      if (initialPrompt) {
        // We defer slightly to let UI initialize
        const timer = setTimeout(() => {
          handleSendMessage(initialPrompt);
        }, 100);
        return () => clearTimeout(timer);
      }
      
      // Auto-trigger file upload dialog
      if (triggerUpload && fileInputRef.current) {
        const timer = setTimeout(() => {
          fileInputRef.current.click();
        }, 200);
        return () => clearTimeout(timer);
      }
      
      // Clear location state so refreshes don't re-trigger
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  // Sidebar controls
  const handleSelectChat = (chat) => {
    setCurrentChatId(chat.id);
    setCurrentChatTitle(chat.title);
    setMessages(chat.messages || []);
  };

  const handleNewChat = () => {
    setCurrentChatId(null);
    setCurrentChatTitle('New Session');
    setMessages([]);
    setInputText('');
    setSelectedFile(null);
  };

  const handleDeleteChat = async (id) => {
    try {
      const res = await authFetch(`/api/history/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setHistory(prev => prev.filter(item => item.id !== id));
        if (currentChatId === id) {
          handleNewChat();
        }
      }
    } catch (err) {
      console.error('Failed to delete chat:', err);
    }
  };

  // File Handling
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognition.onerror = (err) => {
        console.error('Speech recognition error:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      // Mock recognition simulation
      setIsListening(true);
      setInputText('');
      const mockQuery = "Explain standard tenant liability rules.";
      let charIndex = 0;
      
      setTimeout(() => {
        const interval = setInterval(() => {
          if (charIndex < mockQuery.length) {
            setInputText(prev => prev + mockQuery.charAt(charIndex));
            charIndex++;
          } else {
            clearInterval(interval);
            setIsListening(false);
          }
        }, 35);
      }, 700);
    }
  };

  // Send message
  const handleSendMessage = async (textToSend = '') => {
    const promptText = textToSend.trim() || inputText.trim();
    if (!promptText && !selectedFile) return;

    setInputText('');
    let uploadedFileMeta = null;

    // 1. Upload File if selected
    if (selectedFile) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const uploadRes = await authFetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedFileMeta = {
            name: selectedFile.name,
            size: selectedFile.size,
            mimetype: selectedFile.type,
            path: uploadData.file.filename
          };
        }
      } catch (err) {
        console.error('File upload failed:', err);
      } finally {
        setIsUploading(false);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }

    // 2. Add user message locally
    const userMsg = {
      sender: 'user',
      text: promptText || `Uploaded file: ${uploadedFileMeta.name}`,
      timestamp: new Date().toISOString(),
      ...(uploadedFileMeta && { attachment: uploadedFileMeta })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    // If new session, set a temporary title
    if (!currentChatId) {
      const generatedTitle = promptText ? (promptText.length > 25 ? promptText.substring(0, 25) + '...' : promptText) : 'Document Analysis';
      setCurrentChatTitle(generatedTitle);
    }

    // 3. Trigger typing simulation and call chat api
    setIsAiTyping(true);

    try {
      const res = await authFetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText || `Review uploaded document ${uploadedFileMeta.name}`,
          chatId: currentChatId
        })
      });

      if (res.ok) {
        const aiResponse = await res.json();
        setMessages(prev => [...prev, aiResponse]);
        setApiStatus({ online: true, message: 'Server Connected' });

        // Update local history array dynamically with Mongoose database ID
        if (!currentChatId) {
          const newSessionId = aiResponse.chatId;
          setCurrentChatId(newSessionId);
          
          const newHistoryItem = {
            id: newSessionId,
            title: promptText ? (promptText.length > 25 ? promptText.substring(0, 25) + '...' : promptText) : 'Document Analysis',
            preview: aiResponse.text.substring(0, 60) + (aiResponse.text.length > 60 ? '...' : ''),
            timestamp: new Date().toISOString(),
            messages: [...updatedMessages, aiResponse]
          };

          setHistory(prev => [newHistoryItem, ...prev]);
        } else {
          setHistory(prev => prev.map(item => {
            if (item.id === currentChatId) {
              return {
                ...item,
                preview: aiResponse.text.substring(0, 60) + (aiResponse.text.length > 60 ? '...' : ''),
                timestamp: new Date().toISOString(),
                messages: [...updatedMessages, aiResponse]
              };
            }
            return item;
          }));
        }
      } else {
        throw new Error('API server returned error');
      }
    } catch (err) {
      console.error('Chat transaction failed:', err);
      setApiStatus({ online: false, message: 'Server Error' });
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: '❌ I am having trouble connecting to the Express service. Please check if the backend application is running.',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleQuickAction = (actionText) => {
    handleSendMessage(actionText);
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-100">
      
      {/* Sidebar Panel */}
      <Sidebar 
        history={history}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onDeleteChat={handleDeleteChat}
      />

      {/* Main Conversation Pane */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md relative z-20">
          <div className="flex items-center gap-3">
            {/* Sidebar Toggle for Mobile */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-lg md:hidden cursor-pointer"
            >
              <Menu size={18} />
            </button>

            {/* Back to Home button */}
            <button 
              onClick={() => navigate('/')}
              className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-lg cursor-pointer flex items-center gap-1.5 text-xs font-medium"
              title="Return to Landing"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Landing</span>
            </button>

            {/* Session Title */}
            <h2 className="font-display font-semibold text-sm text-slate-200 truncate max-w-[150px] sm:max-w-[280px]">
              {currentChatTitle}
            </h2>
          </div>

          {/* Connection Status Indicator */}
          <div className="flex items-center gap-2">
            <span className={`inline-block w-2 h-2 rounded-full ${apiStatus.online ? 'bg-accent-emerald' : 'bg-red-500'}`} />
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden sm:inline">
              {apiStatus.message}
            </span>
          </div>
        </header>

        {/* Message logs area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth bg-slate-950">
          {messages.length === 0 ? (
            /* Welcome / Zero State Screen */
            <div className="max-w-2xl mx-auto text-center py-12 md:py-20 flex flex-col items-center">
              <div className="p-4 bg-accent-blue/10 text-accent-blue border border-accent-blue/20 rounded-2xl mb-6">
                <Scale size={42} />
              </div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-white mb-3">
                LawAI Research Panel
              </h1>
              <p className="text-slate-450 text-sm max-w-md mx-auto mb-10 leading-relaxed">
                Consult on legal questions or analyze contract files. Start typing below or choose one of our quick templates to begin.
              </p>

              {/* Template suggesters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
                <button 
                  onClick={() => handleQuickAction("Explain standard NDA termination rules.")}
                  className="glass p-4 rounded-xl border border-slate-900 hover:border-slate-800 text-left hover:bg-slate-900/50 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-accent-blue mb-1">
                    <Sparkles size={12} /> Contract Clause
                  </div>
                  <p className="text-slate-300 text-sm group-hover:text-white">Explain standard NDA termination rules.</p>
                </button>

                <button 
                  onClick={() => handleQuickAction("What steps are needed to file a trademark?")}
                  className="glass p-4 rounded-xl border border-slate-900 hover:border-slate-800 text-left hover:bg-slate-900/50 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-accent-emerald mb-1">
                    <Sparkles size={12} /> IP Filing
                  </div>
                  <p className="text-slate-300 text-sm group-hover:text-white">What steps are needed to file a trademark?</p>
                </button>

                <button 
                  onClick={() => handleQuickAction("Summary of commercial lease liability defaults.")}
                  className="glass p-4 rounded-xl border border-slate-900 hover:border-slate-800 text-left hover:bg-slate-900/50 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-accent-blue mb-1">
                    <Sparkles size={12} /> Property Law
                  </div>
                  <p className="text-slate-300 text-sm group-hover:text-white">Summary of commercial lease liability defaults.</p>
                </button>

                <button 
                  onClick={() => handleQuickAction("Explain key exceptions to freedom of speech.")}
                  className="glass p-4 rounded-xl border border-slate-900 hover:border-slate-800 text-left hover:bg-slate-900/50 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                    <Sparkles size={12} /> Constitutional Law
                  </div>
                  <p className="text-slate-300 text-sm group-hover:text-white">Explain key exceptions to freedom of speech.</p>
                </button>
              </div>
            </div>
          ) : (
            /* Active message log */
            <div className="max-w-3xl mx-auto">
              {messages.map((msg, idx) => (
                <ChatBubble key={idx} message={msg} />
              ))}
              
              {/* Rendering typing simulation bubble */}
              {isAiTyping && (
                <ChatBubble message={{ sender: 'ai' }} isTyping={true} />
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Bar Section */}
        <div className="p-4 border-t border-slate-900/80 bg-slate-950">
          <div className="max-w-3xl mx-auto">
            {/* Selected file preview */}
            {selectedFile && (
              <div className="mb-3.5 inline-flex items-center gap-3 p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300">
                <FileText size={16} className="text-accent-blue" />
                <div className="max-w-[200px] truncate">
                  <span className="font-semibold block truncate">{selectedFile.name}</span>
                  <span className="text-[10px] text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB</span>
                </div>
                <button 
                  onClick={handleRemoveFile}
                  className="p-1 text-slate-500 hover:text-red-400 rounded cursor-pointer"
                  title="Remove file"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}

            {/* Input Bar Form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className={`glass p-2 rounded-xl flex items-center gap-2 border transition-all duration-300 ${
                isListening ? 'border-red-500/50 bg-red-950/10' : 'border-slate-850'
              }`}
            >
              {/* Hidden file input */}
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
              />
              
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                title="Attach Document (.pdf, .doc, .txt)"
                disabled={isUploading || isAiTyping || isListening}
              >
                <Paperclip size={18} />
              </button>

              <input 
                type="text" 
                placeholder={isListening ? "Listening... Speak your legal prompt now" : isUploading ? "Uploading file..." : isAiTyping ? "AI is processing..." : "Ask your legal question..."}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isUploading || isAiTyping || isListening}
                className="flex-1 bg-transparent border-0 outline-none text-white text-sm px-2 placeholder-slate-500 focus:ring-0 w-full"
              />

              <button
                type="button"
                onClick={handleMicClick}
                className={`p-2.5 rounded-lg transition-all cursor-pointer ${
                  isListening 
                    ? 'text-red-500 bg-red-500/10 border border-red-500/35 animate-mic-pulse' 
                    : 'text-slate-450 hover:text-slate-200 hover:bg-slate-900'
                }`}
                title={isListening ? "Stop listening" : "Voice input"}
                disabled={isUploading || isAiTyping}
              >
                <Mic size={18} />
              </button>

              <Button 
                type="submit"
                variant="primary"
                size="sm"
                disabled={(!inputText.trim() && !selectedFile) || isUploading || isAiTyping || isListening}
                className="h-10 px-4 gap-1 flex-shrink-0"
              >
                <span>Send</span>
                <Send size={13} />
              </Button>
            </form>
            
            <p className="text-[10px] text-slate-650 text-center mt-2.5">
              LawAI provides instant analysis but does not constitute official legal advice. Verify important details.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
