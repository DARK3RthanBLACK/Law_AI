import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Upload, 
  ArrowRight, 
  Search, 
  Gavel,
  Info,
  Mic,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  PenTool,
  Flag,
  MessageSquare
} from 'lucide-react';
import Header from '../components/Header';
import Button from '../components/Button';
import ScrollReveal from '../components/ScrollReveal';
import { useLanguage } from '../context/LanguageContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const { language, t } = useLanguage();
  const [startIndex, setStartIndex] = useState(0);

  const cards = [
    {
      title: language === 'en' ? "Standard Tenant Liability:" : "मानक किरायेदार देयता:",
      desc: language === 'en' ? "Explain common rules. what is the regliation..." : "सामान्य नियमों की व्याख्या करें। नियम क्या है...",
      icon: Gavel,
      prompt: t('suggestTenant')
    },
    {
      title: language === 'en' ? "Patent Application:" : "पेटेंट आवेदन:",
      desc: language === 'en' ? "What is the provisional patent process?" : "अनंतिम पेटेंट प्रक्रिया क्या है?",
      icon: Lightbulb,
      prompt: t('suggestPatent')
    },
    {
      title: language === 'en' ? "Sample NDA Clause:" : "एनडीए खंड नमूना:",
      desc: language === 'en' ? "Review a typical non-disclosure termination..." : "एक विशिष्ट गैर-प्रकटीकरण समाप्ति की समीक्षा करें...",
      icon: PenTool,
      prompt: t('suggestNDA')
    },
    {
      title: language === 'en' ? "First Amendment" : "प्रथम संशोधन",
      desc: language === 'en' ? "Review standard freedom of speech exemptions." : "मानक वाक् स्वतंत्रता अपवादों की समीक्षा करें।",
      icon: [Flag, MessageSquare],
      prompt: t('suggestSpeech')
    }
  ];

  const handlePrevCard = () => {
    setStartIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  };

  const handleNextCard = () => {
    setStartIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  };

  const visibleCards = [];
  for (let i = 0; i < cards.length; i++) {
    const cardIndex = (startIndex + i) % cards.length;
    visibleCards.push(cards[cardIndex]);
  }

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
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const startMockSimulation = () => {
      setIsListening(true);
      setPrompt('');
      const mockQuery = "Draft a standard NDA termination clause";
      let charIndex = 0;
      
      const interval = setInterval(() => {
        if (charIndex < mockQuery.length) {
          setPrompt(prev => prev + mockQuery.charAt(charIndex));
          charIndex++;
        } else {
          clearInterval(interval);
          setIsListening(false);
        }
      }, 35);

      recognitionRef.current = {
        stop: () => {
          clearInterval(interval);
        }
      };
    };

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        for (let i = 0; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        setPrompt(finalTranscript + interimTranscript);
      };

      recognition.onerror = (err) => {
        console.error('Speech recognition error, falling back to mock typing:', err);
        startMockSimulation();
      };

      recognition.onend = () => {
        // Handled via mock fallback or manual stops
      };

      try {
        recognition.start();
      } catch (err) {
        console.error('Failed to start speech recognition, falling back:', err);
        startMockSimulation();
      }
    } else {
      startMockSimulation();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pt-18 relative overflow-hidden animate-fade-in">
      <Header />

      {/* Hero Section */}
      <section className="relative py-24 md:py-36 overflow-hidden flex-1 flex flex-col justify-center bg-slate-950">
        {/* Background Open Book Container with bottom blend fade */}
        <div 
          className="absolute inset-0 z-0 bg-center bg-no-repeat pointer-events-none opacity-35 select-none"
          style={{
            backgroundImage: "linear-gradient(to bottom, rgba(8, 11, 17, 0) 40%, rgba(8, 11, 17, 1) 98%), url('/open_golden_book.png')",
            backgroundSize: 'contain',
            backgroundPosition: 'center 15%',
          }}
        />

        {/* Background glow effects */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-accent-blue/5 rounded-full blur-[140px] animate-pulse-glow animate-float pointer-events-none z-0" />



        <div className="max-w-6xl mx-auto px-6 text-center relative z-25 w-full">
          {/* Heading */}
          <ScrollReveal direction="up" delay={200}>
            <h1 className="font-serif-gold font-normal text-5xl sm:text-6.5xl text-[#e2c792] tracking-wide leading-[1.25] mb-6">
              {language === 'en' ? (
                <>
                  Understand Legal Queries & <br />
                  Contracts <span className="font-sans font-bold bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent" style={{ textShadow: '0 0 25px rgba(34, 211, 238, 0.45)' }}>Instantly</span>
                </>
              ) : (
                <>
                  कानूनी प्रश्नों और अनुबंधों को <br />
                  <span className="font-sans font-bold bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent" style={{ textShadow: '0 0 25px rgba(34, 211, 238, 0.45)' }}>तुरंत समझें</span>
                </>
              )}
            </h1>
          </ScrollReveal>

          {/* Subheading */}
          <ScrollReveal direction="up" delay={300}>
            <p className="text-slate-300 text-sm max-w-xl sm:max-w-2xl mx-auto mb-10 leading-relaxed">
              {t('heroSubtitle')}
            </p>
          </ScrollReveal>

          {/* Prominent Search/Prompt Bar */}
          <ScrollReveal direction="up" delay={400}>
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-16">
              <div className={`glass p-1.5 pl-4 rounded-full flex items-center shadow-2xl shadow-black/90 border transition-all duration-300 ${
                isListening ? 'border-red-500/50 bg-red-950/10' : 'border-slate-800/80 hover:border-slate-750'
              }`}>
                <div className={`pl-1 ${isListening ? 'text-red-400 animate-pulse' : 'text-slate-500'}`}>
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder={isListening ? (language === 'en' ? "Listening... Speak your legal prompt now" : "सुन रहा हूँ... अपना कानूनी सवाल बोलें") : t('searchPlaceholder')}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isListening}
                  className="flex-1 bg-transparent border-0 outline-none text-white text-sm px-3 placeholder-slate-550 h-10 w-full focus:ring-0"
                />
                <div className="flex items-center gap-1.5 pr-1">
                  <button
                    type="button"
                    onClick={handleMicClick}
                    className={`p-2 rounded-full transition-all cursor-pointer ${
                      isListening 
                        ? 'text-red-500 bg-red-500/10 border border-red-500/35 animate-mic-pulse' 
                        : 'text-slate-450 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                    title={isListening ? (language === 'en' ? "Stop listening" : "सुनना बंद करें") : (language === 'en' ? "Voice search" : "आवाज खोज")}
                  >
                    <Mic size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/chat', { state: { triggerUpload: true } })}
                    className="p-2 text-slate-450 hover:text-slate-200 hover:bg-slate-900 rounded-full transition-colors cursor-pointer"
                    title={language === 'en' ? "Upload Document" : "दस्तावेज़ अपलोड करें"}
                    disabled={isListening}
                  >
                    <Upload size={16} />
                  </button>
                  <button 
                    type="submit" 
                    disabled={isListening}
                    className="h-10 px-5 gap-1.5 bg-gradient-to-r from-accent-blue to-cyan-400 hover:brightness-110 text-slate-950 font-semibold text-sm rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 shadow-md active:scale-95 shrink-0"
                  >
                    <span>{language === 'en' ? 'Analyze' : 'विश्लेषण करें'}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </form>
          </ScrollReveal>

          {/* Suggestion Cards Carousel */}
          <ScrollReveal direction="up" delay={500}>
            <div className="relative max-w-5xl mx-auto px-10 flex items-center justify-between group">
              {/* Left Arrow Button */}
              <button 
                type="button"
                onClick={handlePrevCard}
                className="absolute left-0 p-2.5 rounded-full border border-slate-900 bg-slate-950/80 hover:bg-slate-900 text-slate-450 hover:text-white cursor-pointer transition-all active:scale-90 z-10"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Cards row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full py-4 text-left">
                {visibleCards.map((card, idx) => {
                  const CardIcon = card.icon;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleChipClick(card.prompt)}
                      className={`glass-card p-5 rounded-xl border border-slate-900 hover:border-accent-blue/35 bg-[#0e1320]/60 backdrop-blur-md cursor-pointer transition-all duration-300 min-h-[160px] flex flex-col justify-between group/card ${
                        idx >= 1 ? 'hidden sm:flex' : ''
                      } ${
                        idx >= 2 ? 'hidden md:flex' : ''
                      } ${
                        idx >= 3 ? 'hidden lg:flex' : ''
                      }`}
                    >
                      <div>
                        {/* Dual-tone gold & cyan line-art icon */}
                        <div className="p-2 w-fit rounded-lg bg-accent-blue/5 border border-accent-blue/15 text-accent-blue mb-4 flex items-center gap-1.5 group-hover/card:bg-accent-blue/10 group-hover/card:border-accent-blue/25 transition-all">
                          {Array.isArray(CardIcon) ? (
                            CardIcon.map((Icon, i) => (
                              <Icon key={i} size={18} className="text-accent-blue group-hover/card:text-cyan-400 transition-colors duration-300" />
                            ))
                          ) : (
                            <CardIcon size={18} className="text-accent-blue group-hover/card:text-cyan-400 transition-colors duration-300" />
                          )}
                        </div>
                        <h3 className="text-xs font-bold text-white mb-1.5 tracking-wide group-hover/card:text-accent-blue transition-colors duration-200">
                          {card.title}
                        </h3>
                        <p className="text-slate-400 text-[11px] leading-relaxed group-hover/card:text-slate-350">
                          {card.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Arrow Button */}
              <button 
                type="button"
                onClick={handleNextCard}
                className="absolute right-0 p-2.5 rounded-full border border-slate-900 bg-slate-950/80 hover:bg-slate-900 text-slate-450 hover:text-white cursor-pointer transition-all active:scale-90 z-10"
              >
                <ChevronRight size={16} />
              </button>
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
                <Gavel size={16} />
              </div>
              <span className="font-sans font-bold text-lg text-white">Vakil Sahab</span>
            </div>
            <p className="text-slate-500 text-xs max-w-sm leading-relaxed">
              Vakil Sahab provides automated AI insights and document reviews. We make legal terms understandable and clear, but do not provide legal representation.
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
          <span>&copy; {new Date().getFullYear()} Vakil Sahab Inc. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-650"><Info size={12} /> Legal education utility only</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
