import React from 'react';
import { User, Scale, FileText } from 'lucide-react';

export default function ChatBubble({ message, isTyping = false }) {
  const isAi = message?.sender === 'ai';

  return (
    <div className={`flex w-full gap-3 ${isAi ? 'justify-start animate-chat-bubble-left' : 'justify-end animate-chat-bubble-right'} mb-4`}>
      {/* AI Profile Avatar */}
      {isAi && (
        <div className="w-8 h-8 rounded-lg bg-accent-blue/10 border border-accent-blue/20 text-accent-blue flex items-center justify-center flex-shrink-0 self-end">
          <Scale size={15} />
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
            <p className="whitespace-pre-line">{message.text}</p>
            
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
