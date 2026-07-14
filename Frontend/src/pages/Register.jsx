import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, User, Mail, Lock, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { useLanguage } from '../context/LanguageContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Client-side validation
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) {
      errors.name = 'Full name is required';
    }

    if (!email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await register(name, email, password);
      // Success: redirect to chat workspace
      navigate('/chat', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col md:flex-row relative overflow-hidden">
      {/* LEFT PANEL - Lady of Justice Premium Splitscreen Panel */}
      <div 
        className="hidden md:flex md:w-5/12 bg-cover bg-center relative border-r border-slate-900 flex-col justify-between p-10 z-10"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.40), rgba(0, 0, 0, 0.85)), url('/lady_of_justice.png')",
        }}
      >
        {/* Brand Logo */}
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="p-2.5 bg-accent-blue/10 rounded-xl border border-accent-blue/20 text-accent-blue group-hover:scale-105 transition-transform duration-250">
            <Scale size={24} />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-white">
            Law<span className="text-accent-blue">AI</span>
          </span>
        </Link>

        {/* Bottom Legal Quote & Brand Tag */}
        <div className="space-y-5">
          <p className="text-xl font-display font-medium text-slate-200 leading-relaxed italic">
            "Justice is sweet and musical; but law is rough and harsh."
          </p>
          <div className="h-1 w-12 bg-accent-blue rounded-full" />
          <div>
            <p className="text-xs text-slate-400 tracking-wider font-semibold uppercase">
              Advanced AI Legal Analysis Suite
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              Secure MongoDB & JWT Authentication Enabled
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Authentication Form and Homepage Link */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10 overflow-y-auto min-h-screen">
        {/* Background Glows for Right Panel */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent-blue/5 rounded-full blur-[100px] pointer-events-none z-0" />
        <div className="absolute bottom-10 right-10 w-[250px] h-[250px] bg-accent-emerald/5 rounded-full blur-[80px] pointer-events-none z-0" />

        {/* Navigation back to Homepage */}
        <Link 
          to="/" 
          className="absolute top-6 right-6 inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors py-2 px-3.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-xl cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>{language === 'en' ? 'Back to Home' : 'मुख्य पृष्ठ पर वापस'}</span>
        </Link>

        {/* Mobile Header (Only visible when Left Panel is hidden) */}
        <div className="md:hidden text-center mb-8 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 group mb-4">
            <div className="p-2 bg-accent-blue/10 rounded-lg border border-accent-blue/20 text-accent-blue group-hover:scale-105 transition-transform duration-250">
              <Scale size={20} />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">
              Law<span className="text-accent-blue">AI</span>
            </span>
          </Link>
          <h2 className="text-2xl font-display font-semibold text-white tracking-tight">
            {language === 'en' ? 'Create your account' : 'अपना खाता बनाएं'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {language === 'en' ? 'Get started with our AI-powered legal analysis suite' : 'हमारे एआई-संचालित कानूनी विश्लेषण सूट के साथ शुरुआत करें'}
          </p>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          {/* Desktop Form Header (Hidden on Mobile) */}
          <div className="hidden md:block mb-8">
            <h2 className="text-3xl font-display font-semibold text-white tracking-tight">
              {language === 'en' ? 'Get started for free' : 'मुफ़्त में शुरू करें'}
            </h2>
            <p className="mt-2 text-sm text-slate-455">
              {language === 'en' ? 'Create an account to gain private document storage and unlimited queries.' : 'निजी दस्तावेज़ भंडारण और असीमित प्रश्न प्राप्त करने के लिए एक खाता बनाएं।'}
            </p>
          </div>

          <div className="glass rounded-2xl border border-slate-800 shadow-2xl p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-950/20 border border-red-500/30 rounded-xl flex items-start gap-3 text-red-250 text-sm">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name Field */}
              <div>
                <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-slate-450 mb-2">
                  {t('nameLabel')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User size={18} />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-2.5 bg-slate-950/65 border rounded-xl text-slate-100 placeholder-slate-550 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue transition-all duration-200 ${
                      validationErrors.name ? 'border-red-500/50' : 'border-slate-800'
                    }`}
                    placeholder="Attorney John Doe"
                  />
                </div>
                {validationErrors.name && (
                  <p className="mt-1.5 text-xs text-red-400">{validationErrors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-450 mb-2">
                  {t('emailLabel')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail size={18} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-2.5 bg-slate-950/65 border rounded-xl text-slate-100 placeholder-slate-550 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue transition-all duration-200 ${
                      validationErrors.email ? 'border-red-500/50' : 'border-slate-800'
                    }`}
                    placeholder="lawyer@firm.com"
                  />
                </div>
                {validationErrors.email && (
                  <p className="mt-1.5 text-xs text-red-400">{validationErrors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-450 mb-2">
                  {t('passwordLabel')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock size={18} />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`block w-full pl-10 pr-10 py-2.5 bg-slate-950/65 border rounded-xl text-slate-100 placeholder-slate-550 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue transition-all duration-200 ${
                      validationErrors.password ? 'border-red-500/50' : 'border-slate-800'
                    }`}
                    placeholder="Minimum 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-350 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="mt-1.5 text-xs text-red-400">{validationErrors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-slate-450 mb-2">
                  {language === 'en' ? 'Confirm Password' : 'पासवर्ड की पुष्टि करें'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock size={18} />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-2.5 bg-slate-950/65 border rounded-xl text-slate-100 placeholder-slate-550 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue transition-all duration-200 ${
                      validationErrors.confirmPassword ? 'border-red-500/50' : 'border-slate-800'
                    }`}
                    placeholder={language === 'en' ? "Repeat your password" : "अपना पासवर्ड दोहराएं"}
                  />
                </div>
                {validationErrors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-400">{validationErrors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold tracking-wide flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>{language === 'en' ? 'Creating account...' : 'खाता बनाया जा रहा है...'}</span>
                    </>
                  ) : (
                    language === 'en' ? 'Create Account' : 'खाता बनाएं'
                  )}
                </Button>
              </div>
            </form>

            {/* Bottom Link */}
            <div className="mt-6 pt-6 border-t border-slate-900 text-center">
              <p className="text-sm text-slate-400">
                {t('hasAccount')}{' '}
                <Link to="/login" className="font-semibold text-accent-blue hover:text-accent-blue-hover transition-colors">
                  {t('signIn')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
