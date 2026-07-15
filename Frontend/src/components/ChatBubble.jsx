import React, { useState, useEffect } from 'react';
import { User, Gavel, FileText, Volume2, VolumeX } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatBubble({ 
  message, 
  isTyping = false,
  onClarifyingSubmit,
  onDraftNotice,
  isGeneratingNotice = false
}) {
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
      <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed border ${
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
            {/* Mode badge if evaluated */}
            {isAi && message.eval_result?.mode && (
              <div className="mb-2.5">
                {message.eval_result.mode === 'grounded' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950/40 border border-emerald-500/30 text-emerald-450">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Verified ✓
                  </span>
                ) : message.eval_result.mode === 'honest_no_coverage' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-950/40 border border-amber-500/30 text-amber-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Outside Database
                  </span>
                ) : null}
              </div>
            )}

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

            {/* Clarifying questions form if needs_more_info is true and callback is provided */}
            {isAi && message.needs_more_info && message.clarifying_questions?.length > 0 && onClarifyingSubmit && (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const answers = {};
                  message.clarifying_questions.forEach((q, idx) => {
                    answers[idx] = formData.get(`q-${idx}`)?.toString().trim() || 'Not specified';
                  });
                  onClarifyingSubmit(answers);
                }}
                className="mt-4 p-4 bg-slate-950/50 border border-slate-800/80 rounded-xl space-y-4 text-left"
              >
                <div className="text-xs font-semibold text-accent-blue uppercase tracking-wider">
                  Clarifying Details Needed:
                </div>
                {message.clarifying_questions.map((q, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-350 leading-relaxed">
                      {q}
                    </label>
                    <input 
                      type="text"
                      name={`q-${idx}`}
                      required
                      placeholder="Type your response..."
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-650 text-xs focus:outline-none focus:border-accent-blue transition-colors"
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  className="w-full py-2.5 bg-accent-blue hover:bg-accent-blue-hover text-white text-xs font-semibold rounded-xl shadow-md transition-colors cursor-pointer flex justify-center items-center gap-1.5"
                >
                  Submit Details
                </button>
              </form>
            )}

            {/* Generate demand notice option if we have case facts */}
            {isAi && !message.needs_more_info && message.case_facts && Object.keys(message.case_facts).length > 0 && onDraftNotice && (
              <div className="mt-4 pt-3.5 border-t border-slate-800/40">
                <button
                  onClick={() => onDraftNotice(message.case_facts, message.language)}
                  disabled={isGeneratingNotice}
                  className="inline-flex items-center gap-2 py-2 px-4 bg-slate-950 hover:bg-slate-900 border border-accent-blue/30 hover:border-accent-blue/60 text-accent-blue text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-md"
                >
                  {isGeneratingNotice ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 text-accent-blue" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Drafting Notice...
                    </>
                  ) : (
                    <>
                      <FileText size={14} />
                      Generate Legal Demand Notice
                    </>
                  )}
                </button>
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
