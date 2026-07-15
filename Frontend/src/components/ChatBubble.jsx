import React, { useState, useEffect } from 'react';
import { User, Gavel, FileText, Volume2, VolumeX } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatBubble({ message, isTyping = false }) {
  const isAi = message?.sender === 'ai';
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Stop speaking automatically on unmount to avoid ghost audio
  useEffect(() => {
    return () => {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSpeaking]);

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Cancel any other speaking audio
    window.speechSynthesis.cancel();

    // Clean up formatting tags/symbols so it reads smoothly
    const cleanText = message.text
      .replace(/[#*`_\[\]()\-]/g, ' ') // Strip markdown symbols
      .replace(/NO_COVERAGE/g, ' ')     // Strip internal tags
      .replace(/\s+/g, ' ')             // Collapse whitespace
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Auto-detect Hindi characters
    const containsHindi = /[\u0900-\u097F]/.test(message.text);
    utterance.lang = containsHindi ? 'hi-IN' : 'en-IN';

    // Hook listeners
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`flex w-full gap-3 ${isAi ? 'justify-start animate-chat-bubble-left' : 'justify-end animate-chat-bubble-right'} mb-4`}>
      {/* AI Profile Avatar */}
      {isAi && (
        <div className="w-8 h-8 rounded-lg bg-accent-blue/10 border border-accent-blue/20 text-accent-blue flex items-center justify-center flex-shrink-0 self-end">
          <Gavel size={15} />
        </div>
      )}

      {/* Bubble Content */}
      <div className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed border ${
        isAi 
          ? 'bg-slate-900/90 border-slate-850 text-slate-100 rounded-bl-none' 
          : 'bg-accent-blue border-accent-blue/80 text-white rounded-br-none shadow-md shadow-accent-blue/10'
      }`}>
        {isTyping ? (
          <div className="flex items-center gap-1.5 py-1 px-1.5">
            <span className="w-2 h-2 bg-slate-400 rounded-full typing-dot" />
            <span className="w-2 h-2 bg-slate-400 rounded-full typing-dot" />
            <span className="w-2 h-2 bg-slate-400 rounded-full typing-dot" />
          </div>
        ) : (
          <>
            <div className="markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.text}
              </ReactMarkdown>
            </div>
            
            {/* Read Aloud Button */}
            {isAi && (
              <div className="flex items-center gap-2 mt-2 pt-1 border-t border-slate-800/40">
                <button
                  type="button"
                  onClick={handleSpeak}
                  className={`flex items-center gap-1.5 text-[11px] font-medium cursor-pointer border rounded-full px-2.5 py-0.5 transition-all duration-200 ${
                    isSpeaking
                      ? 'text-red-400 bg-red-950/15 border-red-500/30'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-950/30 border-slate-800'
                  }`}
                  title={isSpeaking ? "Stop reading" : "Read response aloud"}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX size={11} className="animate-pulse" />
                      <span>Stop Reading</span>
                    </>
                  ) : (
                    <>
                      <Volume2 size={11} />
                      <span>Read Aloud</span>
                    </>
                  )}
                </button>
              </div>
            )}
            
            {/* Attachment preview if any */}
            {message.attachment && (
              <div className="mt-2.5 flex items-center gap-2 p-2 bg-slate-950/40 border border-slate-800 rounded-lg text-xs text-slate-300">
                <FileText size={14} className="text-accent-blue" />
                <span className="font-medium truncate max-w-[180px]">{message.attachment.name}</span>
                <span className="text-slate-500">({(message.attachment.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* User Profile Avatar */}
      {!isAi && (
        <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/60 text-slate-350 flex items-center justify-center flex-shrink-0 self-end">
          <User size={15} />
        </div>
      )}
    </div>
  );
}
