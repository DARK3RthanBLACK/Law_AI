import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Scale } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-slate-100">
        <div className="p-3 bg-accent-blue/10 border border-accent-blue/20 rounded-xl text-accent-blue animate-pulse mb-4">
          <Scale size={24} />
        </div>
        <p className="text-xs text-slate-500 font-semibold tracking-widest uppercase">Initializing Session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
