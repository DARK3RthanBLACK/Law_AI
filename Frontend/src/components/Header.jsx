import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Scale, ChevronRight, LogOut, User, Globe } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const isActive = (path) => location.pathname === path;

  // Extract initials for the user profile circle
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 glass border-b border-slate-900/50">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-1.5 bg-[#1e293b]/60 rounded-lg border border-slate-800 text-accent-blue group-hover:scale-105 transition-transform duration-200 shadow-md">
            <Scale size={18} />
          </div>
          <span className="font-sans font-bold text-lg tracking-tight">
            <span className="text-white">Law</span>
            <span className="text-accent-blue">AI</span>
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors ${
              isActive('/') ? 'text-accent-blue font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'en' ? 'Home' : 'मुख्य पृष्ठ'}
          </Link>
          <Link 
            to="/features" 
            className={`text-sm font-medium transition-colors ${
              isActive('/features') ? 'text-accent-blue font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('features')}
          </Link>
          <Link 
            to="/how-it-works" 
            className={`text-sm font-medium transition-colors ${
              isActive('/how-it-works') ? 'text-accent-blue font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('howItWorks')}
          </Link>
          <Link 
            to="/faq" 
            className={`text-sm font-medium transition-colors ${
              isActive('/faq') ? 'text-accent-blue font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('faq')}
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {/* Language Switcher Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-700 text-slate-350 hover:text-white text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer shadow-inner"
            title="Switch Language / भाषा बदलें"
          >
            <Globe size={13} className="text-accent-blue" />
            <span>{language === 'en' ? 'EN' : 'हि'}</span>
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* User Profile Badge */}
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full border border-accent-blue/35 bg-[#1d2433]/70 text-accent-blue flex items-center justify-center font-sans font-bold text-xs select-none shadow-sm">
                  {getInitials(user?.name)}
                </div>
                <span className="hidden sm:inline text-sm font-medium text-slate-300">
                  {user?.name?.split(' ')[0]}
                </span>
              </div>

              {/* Logout Button */}
              <button 
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-slate-200 transition-all duration-200 cursor-pointer"
                title={t('logout')}
              >
                <LogOut size={16} />
              </button>

              <button 
                onClick={() => navigate('/chat')}
                className="flex items-center gap-1 px-4 py-1.5 bg-accent-blue hover:bg-accent-blue-hover text-slate-950 font-semibold text-xs rounded-full cursor-pointer transition-all duration-200 shadow-md active:scale-95"
              >
                <span>{language === 'en' ? 'Workspace' : 'कार्यस्थान'}</span>
                <span>&rarr;</span>
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={() => navigate('/login')}
                className="text-sm font-medium text-slate-350 hover:text-white transition-colors cursor-pointer"
              >
                {t('login')}
              </button>
              <button 
                onClick={() => navigate('/chat')}
                className="flex items-center gap-1 px-4 py-1.5 bg-accent-blue hover:bg-accent-blue-hover text-slate-950 font-semibold text-xs rounded-full cursor-pointer transition-all duration-200 shadow-md active:scale-95"
              >
                <span>{language === 'en' ? 'Launch App' : 'ऐप खोलें'}</span>
                <span>&rarr;</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
