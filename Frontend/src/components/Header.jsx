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
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-2 bg-accent-blue/10 rounded-lg border border-accent-blue/20 text-accent-blue group-hover:scale-105 transition-transform duration-250">
            <Scale size={20} />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white">
            Law<span className="text-accent-blue">AI</span>
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors ${
              isActive('/') ? 'text-accent-blue' : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            {language === 'en' ? 'Home' : 'मुख्य पृष्ठ'}
          </Link>
          <Link 
            to="/features" 
            className={`text-sm font-medium transition-colors ${
              isActive('/features') ? 'text-accent-blue' : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            {t('features')}
          </Link>
          <Link 
            to="/how-it-works" 
            className={`text-sm font-medium transition-colors ${
              isActive('/how-it-works') ? 'text-accent-blue' : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            {t('howItWorks')}
          </Link>
          <Link 
            to="/faq" 
            className={`text-sm font-medium transition-colors ${
              isActive('/faq') ? 'text-accent-blue' : 'text-slate-400 hover:text-slate-100'
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
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer shadow-inner"
            title="Switch Language / भाषा बदलें"
          >
            <Globe size={13} className="text-accent-blue" />
            <span>{language === 'en' ? 'EN' : 'हि'}</span>
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {/* User Profile Badge */}
              <div className="flex items-center gap-2.5">
                <div className="h-8.5 w-8.5 rounded-full bg-accent-blue/10 border border-accent-blue/25 text-accent-blue flex items-center justify-center font-display font-bold text-xs select-none shadow-sm shadow-accent-blue/5">
                  {getInitials(user?.name)}
                </div>
                <span className="hidden sm:inline text-sm font-medium text-slate-200">
                  {user?.name?.split(' ')[0]}
                </span>
              </div>

              {/* Logout Button */}
              <button 
                onClick={logout}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/5 rounded-lg border border-transparent hover:border-red-500/10 transition-all duration-200 cursor-pointer"
                title={t('logout')}
              >
                <LogOut size={16} />
              </button>

              <Button 
                variant="primary" 
                size="sm"
                onClick={() => navigate('/chat')}
                className="gap-1 px-4 py-1.5"
              >
                {language === 'en' ? 'Workspace' : 'कार्यस्थान'} <ChevronRight size={14} />
              </Button>
            </div>
          ) : (
            <>
              <button 
                onClick={() => navigate('/login')}
                className="text-sm font-medium text-slate-350 hover:text-white transition-colors cursor-pointer"
              >
                {t('login')}
              </button>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => navigate('/chat')}
                className="gap-1 px-4 py-1.5"
              >
                {language === 'en' ? 'Launch App' : 'ऐप खोलें'} <ChevronRight size={14} />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
