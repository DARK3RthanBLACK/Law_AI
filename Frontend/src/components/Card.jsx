import React from 'react';

export default function Card({ 
  children, 
  title, 
  icon: Icon, 
  className = '', 
  hoverEffect = true,
  ...props 
}) {
  return (
    <div 
      className={`${hoverEffect ? 'glass-card' : 'glass'} rounded-xl p-6 flex flex-col gap-4 text-left transition-all duration-300 ${className}`}
      {...props}
    >
      {title && (
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-2 bg-slate-900/50 rounded-lg text-accent-blue border border-slate-800">
              <Icon size={18} />
            </div>
          )}
          <h3 className="font-display font-semibold text-lg text-slate-100">{title}</h3>
        </div>
      )}
      <div className="text-slate-400 text-sm leading-relaxed flex-grow">
        {children}
      </div>
    </div>
  );
}
