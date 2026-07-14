import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, User, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-black text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-accent-emerald/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        {/* Brand Logo */}
        <Link to="/" className="inline-flex items-center gap-2.5 group mb-6">
          <div className="p-2.5 bg-accent-blue/10 rounded-xl border border-accent-blue/20 text-accent-blue group-hover:scale-105 transition-transform duration-250">
            <Scale size={24} />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-white">
            Law<span className="text-accent-blue">AI</span>
          </span>
        </Link>

        <h2 className="text-3xl font-display font-semibold text-white tracking-tight">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Get started with our AI-powered legal analysis suite
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
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
                Full Name
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
                Email Address
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
                Password
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
                Confirm Password
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
                  placeholder="Repeat your password"
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
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </div>
          </form>

          {/* Bottom Link */}
          <div className="mt-6 pt-6 border-t border-slate-900 text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-accent-blue hover:text-accent-blue-hover transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
