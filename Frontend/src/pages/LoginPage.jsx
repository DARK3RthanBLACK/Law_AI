import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Scale, Lock, Mail, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import Button from '../components/Button';

export default function LoginPage() {
  const { login, signup, sendOtp, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Tab state
  const [isLoginTab, setIsLoginTab] = useState(true);

  // Form input fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP Signup state
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [devOtp, setDevOtp] = useState('');

  // UI status states
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all credentials.');
      return;
    }

    if (isLoginTab) {
      setIsLoading(true);
      try {
        await login(email, password);
        navigate('/chat');
      } catch (err) {
        setError(err.message || 'An error occurred during authentication.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Sign Up Tab Flow
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      if (!isOtpSent) {
        // Phase 1: Request OTP Code
        setIsLoading(true);
        try {
          const res = await sendOtp(email);
          setIsOtpSent(true);
          if (res.devOtp) {
            setDevOtp(res.devOtp);
          }
        } catch (err) {
          setError(err.message || 'Failed to send OTP verification code.');
        } finally {
          setIsLoading(false);
        }
      } else {
        // Phase 2: Verify OTP and complete Registration
        if (!otp.trim()) {
          setError('Please enter the 6-digit verification code.');
          return;
        }
        setIsLoading(true);
        try {
          await signup(email, password, otp);
          navigate('/chat');
        } catch (err) {
          setError(err.message || 'Verification and registration failed.');
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const handleGoogleLogin = async (googleEmail) => {
    if (!googleEmail || !googleEmail.includes('@')) {
      setError('Please enter a valid Google email.');
      return;
    }

    setIsGoogleModalOpen(false);
    setIsLoading(true);
    setError('');

    try {
      await loginWithGoogle(googleEmail);
      navigate('/chat');
    } catch (err) {
      setError(err.message || 'Google authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow shadow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-md glass border border-slate-900 rounded-2xl p-8 relative z-10 shadow-2xl shadow-black/80">
        
        {/* Logo Title Block */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-accent-blue/10 border border-accent-blue/20 rounded-xl text-accent-blue mb-3">
            <Scale size={24} />
          </div>
          <h2 className="font-display font-bold text-2xl text-white">
            {isLoginTab ? 'Sign In to LawAI' : 'Create LawAI Account'}
          </h2>
          <p className="text-slate-500 text-xs mt-1.5 text-center">
            {isLoginTab 
              ? 'Access your saved documents and research sessions.' 
              : isOtpSent 
                ? 'Verify your email to complete registration.'
                : 'Start analyzing contracts and statutes for free.'}
          </p>
        </div>

        {/* Validation Errors Header */}
        {error && (
          <div className="mb-5 p-3 bg-red-950/20 border border-red-900/40 text-red-400 text-xs rounded-lg flex items-start gap-2">
            <span className="font-bold flex-shrink-0 mt-0.5">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Tab Toggle Header */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900/60 border border-slate-900 rounded-lg mb-6 text-xs font-semibold">
          <button
            onClick={() => {
              setIsLoginTab(true);
              setIsOtpSent(false);
              setOtp('');
              setDevOtp('');
              setError('');
            }}
            disabled={isLoading}
            className={`py-2 rounded-md transition-all cursor-pointer ${
              isLoginTab ? 'bg-accent-blue text-white shadow-md' : 'text-slate-455 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setIsLoginTab(false);
              setError('');
            }}
            disabled={isLoading}
            className={`py-2 rounded-md transition-all cursor-pointer ${
              !isLoginTab ? 'bg-accent-blue text-white shadow-md' : 'text-slate-455 hover:text-slate-200'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Email Address</label>
            <div className={`flex items-center bg-slate-950 border rounded-lg px-3 focus-within:border-accent-blue/50 transition-colors ${isOtpSent && !isLoginTab ? 'border-slate-850 opacity-60' : 'border-slate-900'}`}>
              <Mail size={16} className="text-slate-555 mr-2.5 flex-shrink-0" />
              <input
                type="email"
                required
                disabled={isOtpSent && !isLoginTab}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-0 outline-none text-sm text-white placeholder-slate-650 h-10.5 focus:ring-0"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Password</label>
            <div className={`flex items-center bg-slate-950 border rounded-lg px-3 focus-within:border-accent-blue/50 transition-colors ${isOtpSent && !isLoginTab ? 'border-slate-850 opacity-60' : 'border-slate-900'}`}>
              <Lock size={16} className="text-slate-555 mr-2.5 flex-shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={isOtpSent && !isLoginTab}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-0 outline-none text-sm text-white placeholder-slate-650 h-10.5 focus:ring-0"
              />
              <button
                type="button"
                disabled={isOtpSent && !isLoginTab}
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-slate-555 hover:text-slate-350 cursor-pointer"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {!isLoginTab && !isOtpSent && (
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Confirm Password</label>
              <div className="flex items-center bg-slate-950 border border-slate-900 rounded-lg px-3 focus-within:border-accent-blue/50 transition-colors">
                <Lock size={16} className="text-slate-555 mr-2.5 flex-shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent border-0 outline-none text-sm text-white placeholder-slate-650 h-10.5 focus:ring-0"
                />
              </div>
            </div>
          )}

          {/* OTP Code Verification Form Input */}
          {!isLoginTab && isOtpSent && (
            <div className="pt-2 animate-fade-in">
              <label className="block text-[10px] font-semibold text-accent-blue uppercase tracking-wide mb-1.5 text-center">
                Enter Verification Code (OTP)
              </label>
              <div className="flex items-center bg-slate-950 border border-accent-blue/40 rounded-lg px-3 focus-within:border-accent-blue/80 transition-colors">
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-transparent border-0 outline-none text-lg text-white font-bold tracking-widest text-center h-10.5 focus:ring-0"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-2 text-center">
                A 6-digit code has been dispatched to <span className="text-slate-350">{email}</span>.
              </p>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="w-full h-10.5 justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>
                  {isLoginTab 
                    ? 'Sign In' 
                    : isOtpSent 
                      ? 'Verify & Create Account' 
                      : 'Send Verification Code'}
                </span>
                <ArrowRight size={15} />
              </>
            )}
          </Button>
        </form>

        {/* Resend and Edit Info Links */}
        {!isLoginTab && isOtpSent && (
          <div className="mt-4 flex flex-col items-center gap-2 text-xs">
            <button
              type="button"
              disabled={isLoading}
              onClick={async () => {
                setError('');
                setOtp('');
                setIsLoading(true);
                try {
                  const res = await sendOtp(email);
                  if (res.devOtp) setDevOtp(res.devOtp);
                } catch (err) {
                  setError(err.message || 'Failed to resend code.');
                } finally {
                  setIsLoading(false);
                }
              }}
              className="text-accent-blue hover:underline cursor-pointer font-medium"
            >
              Resend Verification Code
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOtpSent(false);
                setOtp('');
                setDevOtp('');
              }}
              className="text-[10px] text-slate-500 hover:text-slate-400 cursor-pointer"
            >
              Edit email address
            </button>
          </div>
        )}

        {/* Staging Dev OTP Helper Card */}
        {!isLoginTab && isOtpSent && devOtp && (
          <div className="mt-4 p-3 bg-accent-blue/5 border border-accent-blue/15 rounded-xl text-[10px] text-slate-400 text-center leading-relaxed">
            <span className="font-semibold text-accent-blue block mb-0.5">⚙️ Staging Mode Helper</span>
            Mock OTP Code: <code className="font-bold text-accent-blue text-sm tracking-wider">{devOtp}</code>
            <span className="block mt-0.5 text-slate-500">Since no SMTP mail setup is active in `.env`, the code was logged to console.</span>
          </div>
        )}

        {/* Google Sign In Button */}
        {!isOtpSent && (
          <>
            {/* Separator */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-900"></div>
              </div>
              <span className="relative px-3 bg-[#0a0a0a] text-slate-500 text-[10px] uppercase font-semibold tracking-wider">Or continue with</span>
            </div>

            <button
              type="button"
              onClick={() => setIsGoogleModalOpen(true)}
              className="w-full flex items-center justify-center gap-3 px-4 h-10.5 border border-slate-900 bg-slate-950 hover:bg-slate-900 text-slate-200 hover:text-white rounded-lg transition-colors cursor-pointer text-sm font-semibold"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </>
        )}

        {/* Demo Account Indicator */}
        {isLoginTab && (
          <div className="mt-6 p-3 bg-slate-950 border border-slate-900 rounded-xl text-[10px] text-slate-450 leading-relaxed text-center">
            <span className="font-semibold text-accent-blue block mb-1">💡 Demo Credentials</span>
            Email: <code className="text-slate-300">user@lawai.com</code> &nbsp;|&nbsp; Password: <code className="text-slate-300">password123</code>
          </div>
        )}
      </div>

      <button
        onClick={() => navigate('/')}
        className="mt-6 text-xs text-slate-550 hover:text-slate-350 transition-colors cursor-pointer"
      >
        ← Return to home
      </button>

      {/* Google Account Chooser Modal Overlay */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-950 border border-slate-900 rounded-xl p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsGoogleModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 text-sm cursor-pointer"
            >
              ✕
            </button>
            <div className="flex flex-col items-center mb-6 text-center">
              <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full p-2 mb-3 shadow-md">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-base text-white">Sign in with Google</h3>
              <p className="text-slate-500 text-xs mt-1">to continue to LawAI</p>
            </div>

            {/* List of accounts */}
            <div className="space-y-2">
              <button
                onClick={() => handleGoogleLogin('DARK3RthanBLACK@gmail.com')}
                className="w-full flex items-center gap-3 p-3 bg-slate-900 hover:bg-slate-850 border border-slate-850 rounded-lg text-left transition-colors cursor-pointer text-sm"
              >
                <div className="w-8 h-8 rounded-full bg-accent-blue/15 flex items-center justify-center text-accent-blue font-bold">
                  D
                </div>
                <div>
                  <div className="font-semibold text-slate-200">DARK3RthanBLACK</div>
                  <div className="text-xs text-slate-550">DARK3RthanBLACK@gmail.com</div>
                </div>
              </button>

              <button
                onClick={() => handleGoogleLogin('guest.user@gmail.com')}
                className="w-full flex items-center gap-3 p-3 bg-slate-900 hover:bg-slate-850 border border-slate-850 rounded-lg text-left transition-colors cursor-pointer text-sm"
              >
                <div className="w-8 h-8 rounded-full bg-accent-emerald/15 flex items-center justify-center text-accent-emerald font-bold">
                  G
                </div>
                <div>
                  <div className="font-semibold text-slate-200">Guest User</div>
                  <div className="text-xs text-slate-550">guest.user@gmail.com</div>
                </div>
              </button>

              {/* Or input another email */}
              <div className="border-t border-slate-900 pt-3 mt-3">
                <label className="block text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Use another account</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="name@gmail.com"
                    id="customGoogleEmail"
                    className="flex-1 bg-slate-950 border border-slate-900 rounded px-2.5 py-1.5 text-xs outline-none focus:border-accent-blue/50 text-white"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleGoogleLogin(e.target.value);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const emailInput = document.getElementById('customGoogleEmail');
                      if (emailInput && emailInput.value) {
                        handleGoogleLogin(emailInput.value);
                      }
                    }}
                    className="px-3 bg-accent-blue hover:bg-accent-blue-hover text-white rounded text-xs font-semibold cursor-pointer"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[9px] text-slate-600 text-center mt-5 leading-relaxed">
              For staging/production Client ID binding, declare `VITE_GOOGLE_CLIENT_ID` in your `.env` and load Google Identity client SDK in your scripts.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
