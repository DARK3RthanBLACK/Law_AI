import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MessageSquare, Settings, LogOut, X, Scale, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ 
  history = [], 
  currentChatId, 
  onSelectChat, 
  onNewChat, 
  isOpen, 
  onClose 
}) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-45 w-64 bg-slate-900 border-r border-slate-850 flex flex-col transition-transform duration-300 md:translate-x-0 md:static md:h-screen ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header (Logo & Close Button) */}
        <div className="p-4 flex items-center justify-between border-b border-slate-850">
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="p-1.5 bg-accent-blue/10 rounded-md text-accent-blue border border-accent-blue/20">
              <Scale size={18} />
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-white">
              Law<span className="text-accent-blue">AI</span>
            </span>
          </div>

          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-md md:hidden cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Action Button: New Chat */}
        <div className="p-4">
          <button 
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-750 border border-slate-700/60 text-slate-200 hover:text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            <Plus size={16} />
            <span>New Session</span>
          </button>
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto px-3 space-y-1 py-2">
          <div className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Recent Analysis
          </div>
          {history.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500 italic">
              No recent sessions
            </div>
          ) : (
            history.map((chat) => {
              const isActive = currentChatId === chat.id;
              return (
                <button
                  key={chat.id}
                  onClick={() => {
                    onSelectChat(chat);
                    onClose();
                  }}
                  className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-150 cursor-pointer ${
                    isActive 
                      ? 'bg-accent-blue/10 text-white border border-accent-blue/25' 
                      : 'text-slate-450 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <MessageSquare size={16} className={`mt-0.5 flex-shrink-0 ${isActive ? 'text-accent-blue' : 'text-slate-550'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{chat.title}</div>
                    <div className="text-xs text-slate-500 truncate mt-0.5">{chat.preview}</div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer (User & Settings) */}
        <div className="p-4 border-t border-slate-850 bg-slate-900/50">
          <div className="flex items-center gap-3 p-1.5 rounded-lg">
            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-350 border border-slate-700/40">
              <User size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-250 truncate">
                {user ? 'Logged In' : 'Guest Account'}
              </div>
              <div className="text-xs text-slate-500 truncate">
                {user?.email || 'guest@lawai.com'}
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-1 border-t border-slate-800/40 pt-2 text-xs">
            <button className="flex items-center gap-1.5 py-1.5 px-2 text-slate-450 hover:text-slate-200 transition-colors rounded hover:bg-slate-800 cursor-pointer justify-center">
              <Settings size={14} />
              <span>Settings</span>
            </button>
            <button 
              onClick={() => {
                logout();
                navigate('/');
              }} 
              className="flex items-center gap-1.5 py-1.5 px-2 text-slate-450 hover:text-red-400 transition-colors rounded hover:bg-slate-800 cursor-pointer justify-center"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
