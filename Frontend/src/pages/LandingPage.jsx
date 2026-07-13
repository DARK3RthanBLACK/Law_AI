import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Upload, 
  ArrowRight, 
  Search, 
  Scale,
  Info,
  Mic
} from 'lucide-react';
import Header from '../components/Header';
import Button from '../components/Button';
import ScrollReveal from '../components/ScrollReveal';

export default function LandingPage() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);

  const suggestionChips = [
    "Explain standard tenant liability rules",
    "What is the provisional patent filing process?",
    "Review a sample NDA termination clause",
    "Freedom of speech First Amendment exceptions"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() || isListening) return;
    navigate('/chat', { state: { initialPrompt: prompt } });
  };

  const handleChipClick = (chipText) => {
    if (isListening) return;
    navigate('/chat', { state: { initialPrompt: chipText } });
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
        setPrompt(transcript);
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
      setPrompt('');
      const mockQuery = "Draft a standard NDA termination clause";
      let charIndex = 0;
      
      setTimeout(() => {
        const interval = setInterval(() => {
          if (charIndex < mockQuery.length) {
            setPrompt(prev => prev + mockQuery.charAt(charIndex));
            charIndex++;
          } else {
            clearInterval(interval);
            setIsListening(false);
          }
        }, 35);
      }, 700);
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col pt-18 relative overflow-hidden">
      <Header />

      {/* Hero Section */}
      <section 
        className="relative py-20 md:py-36 overflow-hidden flex-1 flex flex-col justify-center bg-black bg-center bg-no-repeat"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.70), rgba(0, 0, 0, 0.70)), url('/lady_of_justice.png')",
          backgroundSize: 'min(90vw, 800px)'
        }}
      >
        {/* Background glow effects */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-accent-blue/5 rounded-full blur-[140px] animate-pulse-glow pointer-events-none z-0" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 w-full">
          {/* Badge */}
          <ScrollReveal direction="up" delay={100}>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-semibold rounded-full mb-6">
              <Sparkles size={12} />
              <span>AI-Powered Legal Research Engine</span>
            </div>
          </ScrollReveal>

          {/* Heading */}
          <ScrollReveal direction="up" delay={200}>
            <h1 className="font-display font-bold text-4xl sm:text-6xl text-white tracking-tight leading-tight sm:leading-none mb-6">
              Understand Legal Queries & <br />
              <span className="bg-gradient-to-r from-accent-blue via-blue-400 to-accent-emerald bg-clip-text text-transparent">
                Contracts Instantly
              </span>
            </h1>
          </ScrollReveal>

          {/* Subheading */}
          <ScrollReveal direction="up" delay={300}>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              LawAI parses complex regulations, extracts contract liabilities, and explains rights in simple terms. Fast, private, and highly accessible.
            </p>
          </ScrollReveal>

          {/* Prominent Search/Prompt Bar */}
          <ScrollReveal direction="up" delay={400}>
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-6">
              <div className={`glass p-2 rounded-xl flex items-center shadow-2xl shadow-black/80 border transition-all duration-300 ${
                isListening ? 'border-red-500/50 bg-red-950/10' : 'border-slate-800'
              }`}>
                <div className={`pl-3 ${isListening ? 'text-red-400 animate-pulse' : 'text-slate-500'}`}>
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  placeholder={isListening ? "Listening... Speak your legal prompt now" : "Ask a legal question (e.g., 'What is a provisional patent?')..."}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isListening}
                  className="flex-1 bg-transparent border-0 outline-none text-white text-sm px-3 placeholder-slate-500 h-10 w-full focus:ring-0"
                />
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleMicClick}
                    className={`p-2 rounded-lg transition-all cursor-pointer ${
                      isListening 
                        ? 'text-red-500 bg-red-500/10 border border-red-500/35 animate-mic-pulse' 
                        : 'text-slate-450 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                    title={isListening ? "Stop listening" : "Voice search"}
                  >
                    <Mic size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/chat', { state: { triggerUpload: true } })}
                    className="p-2 text-slate-450 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                    title="Upload Document"
                    disabled={isListening}
                  >
                    <Upload size={18} />
                  </button>
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="sm" 
                    className="h-10 px-4 gap-1.5"
                    disabled={isListening}
                  >
                    Analyze <ArrowRight size={14} />
                  </Button>
                </div>
              </div>
            </form>
          </ScrollReveal>

          {/* Suggestion Chips */}
          <ScrollReveal direction="up" delay={500}>
            <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
              {suggestionChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChipClick(chip)}
                  className="text-xs px-3 py-1.5 bg-slate-900/80 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-slate-200 rounded-full transition-all duration-150 cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-accent-blue/10 rounded-md text-accent-blue border border-accent-blue/20">
                <Scale size={16} />
              </div>
              <span className="font-display font-bold text-lg text-white">LawAI</span>
            </div>
            <p className="text-slate-500 text-xs max-w-sm leading-relaxed">
              LawAI provides automated AI insights and document reviews. We make legal terms understandable and clear, but do not provide legal representation.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><a href="/features" className="hover:text-slate-350">Features</a></li>
              <li><a href="/how-it-works" className="hover:text-slate-350">How It Works</a></li>
              <li><a href="/chat" className="hover:text-slate-350">Open Assistant</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Legal & Security</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><a href="#" className="hover:text-slate-350">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-slate-350">Terms of Use</a></li>
              <li><a href="#" className="hover:text-slate-350">Disclaimers</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 border-t border-slate-900/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-650 gap-4 text-left">
          <span>&copy; {new Date().getFullYear()} LawAI Inc. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-650"><Info size={12} /> Legal education utility only</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
