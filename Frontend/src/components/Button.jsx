import React from 'react';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-blue/40 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer';
  
  const variants = {
    primary: 'bg-accent-blue hover:bg-accent-blue-hover text-white shadow-md shadow-accent-blue/10 hover:shadow-lg hover:shadow-accent-blue/20',
    emerald: 'bg-accent-emerald hover:bg-accent-emerald-hover text-white shadow-md shadow-accent-emerald/10 hover:shadow-lg hover:shadow-accent-emerald/20',
    secondary: 'bg-slate-800 hover:bg-slate-750 text-slate-100 border border-slate-700/80',
    outline: 'bg-transparent border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-300 hover:text-white',
    ghost: 'bg-transparent hover:bg-slate-900/60 text-slate-400 hover:text-slate-200',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4.5 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}
