import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Scale, ChevronRight } from 'lucide-react';
import Button from './Button';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

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
            Home
          </Link>
          <Link 
            to="/features" 
            className={`text-sm font-medium transition-colors ${
              isActive('/features') ? 'text-accent-blue' : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            Features
          </Link>
          <Link 
            to="/how-it-works" 
            className={`text-sm font-medium transition-colors ${
              isActive('/how-it-works') ? 'text-accent-blue' : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            How It Works
          </Link>
          <Link 
            to="/faq" 
            className={`text-sm font-medium transition-colors ${
              isActive('/faq') ? 'text-accent-blue' : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            FAQ
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/chat')}
            className="text-sm font-medium text-slate-350 hover:text-white transition-colors cursor-pointer"
          >
            Sign In
          </button>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => navigate('/chat')}
            className="gap-1 px-4 py-1.5"
          >
            Launch App <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    </header>
  );
}
