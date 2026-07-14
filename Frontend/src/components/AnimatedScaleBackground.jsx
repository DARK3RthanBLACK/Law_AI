import React from 'react';

export default function AnimatedScaleBackground({ 
  opacity = 0.95, // Bright and visible
  className = '',
  style = {}
}) {
  return (
    <div
      aria-hidden="true"
      className={`absolute left-0 right-0 pointer-events-none z-0 flex items-center justify-center ${className}`}
      style={{ 
        opacity, 
        top: "50%",
        transform: "translateY(-50%) translateY(-40px)", // Shifted more upwards
        height: "470px", // Matches sign-in card height
        ...style 
      }}
    >
      <svg 
        className="w-full h-full max-h-full max-w-full" 
        viewBox="0 0 680 560" 
        xmlns="http://www.w3.org/2000/svg"
        style={{
          // Deeper, more realistic drop shadow for a premium 3D pop
          filter: "drop-shadow(0 15px 12px rgba(0, 0, 0, 0.55)) drop-shadow(0 30px 40px rgba(0, 0, 0, 0.4))"
        }}
      >
        <defs>
          {/* Realistic Premium Polished Wood Gradient */}
          <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3d2314" />
            <stop offset="25%" stopColor="#291509" />
            <stop offset="50%" stopColor="#4a2916" />
            <stop offset="75%" stopColor="#291509" />
            <stop offset="100%" stopColor="#1a0b04" />
          </linearGradient>

          {/* Premium Gold/Brass Elements */}
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a37a1a" />
            <stop offset="25%" stopColor="#f5d676" />
            <stop offset="50%" stopColor="#c79a32" />
            <stop offset="75%" stopColor="#f5d676" />
            <stop offset="100%" stopColor="#8a6312" />
          </linearGradient>
          
          <linearGradient id="goldShine" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff2bc" />
            <stop offset="50%" stopColor="#c79a32" />
            <stop offset="100%" stopColor="#634509" />
          </linearGradient>

          {/* Glossy Overlay for realistic shine */}
          <linearGradient id="glossOverlay" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="20%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="40%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
          </linearGradient>
          
          {/* Edge highlight */}
          <linearGradient id="edgeHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.2)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0.5)" />
          </linearGradient>
        </defs>

        <style>{`
          @keyframes oscillateGavel {
            0%, 100% { transform: rotate(-30deg); }
            50%      { transform: rotate(-12deg); }
          }
          .gavel-strike-group {
            transform-origin: 550px 380px;
            animation: oscillateGavel 4s ease-in-out infinite;
          }
        `}</style>

        {/* --- Sound Block Base --- */}
        {/* Base shadow */}
        <ellipse cx="250" cy="470" rx="145" ry="45" fill="rgba(0,0,0,0.4)" />
        {/* Plinth */}
        <ellipse cx="250" cy="460" rx="140" ry="40" fill="url(#woodGrad)" stroke="#1a0b04" strokeWidth="2" />
        <rect x="110" y="440" width="280" height="20" fill="url(#woodGrad)" />
        {/* Plinth Gloss */}
        <rect x="110" y="440" width="280" height="20" fill="url(#glossOverlay)" />
        <ellipse cx="250" cy="460" rx="140" ry="40" fill="url(#glossOverlay)" pointerEvents="none" />
        
        {/* Sound Block Top */}
        <ellipse cx="250" cy="440" rx="140" ry="40" fill="url(#woodGrad)" stroke="#291509" strokeWidth="1" />
        <ellipse cx="250" cy="440" rx="140" ry="40" fill="url(#glossOverlay)" pointerEvents="none" />
        {/* Inner Strike Plate (Brass) */}
        <ellipse cx="250" cy="435" rx="100" ry="25" fill="url(#goldGrad)" stroke="#c79a32" strokeWidth="1" />
        <ellipse cx="250" cy="435" rx="100" ry="25" fill="url(#glossOverlay)" pointerEvents="none" />

        {/* --- Gavel Group --- */}
        <g className="gavel-strike-group">
          {/* Handle */}
          <rect x="250" y="368" width="320" height="24" rx="12" fill="url(#woodGrad)" stroke="#1a0b04" strokeWidth="2" />
          <rect x="250" y="368" width="320" height="24" rx="12" fill="url(#glossOverlay)" pointerEvents="none" />
          
          {/* Handle Grip Details (Gold Base) */}
          <rect x="450" y="360" width="80" height="40" rx="6" fill="url(#goldShine)" stroke="#8a6312" strokeWidth="1" />
          <line x1="462" y1="360" x2="462" y2="400" stroke="#634509" strokeWidth="2" opacity="0.6" />
          <line x1="477" y1="360" x2="477" y2="400" stroke="#634509" strokeWidth="2" opacity="0.6" />
          <line x1="492" y1="360" x2="492" y2="400" stroke="#634509" strokeWidth="2" opacity="0.6" />
          <line x1="507" y1="360" x2="507" y2="400" stroke="#634509" strokeWidth="2" opacity="0.6" />
          <line x1="522" y1="360" x2="522" y2="400" stroke="#634509" strokeWidth="2" opacity="0.6" />

          {/* Gavel Head */}
          <rect x="200" y="290" width="90" height="150" rx="15" fill="url(#woodGrad)" stroke="#1a0b04" strokeWidth="2" />
          <rect x="200" y="290" width="90" height="150" rx="15" fill="url(#glossOverlay)" pointerEvents="none" />
          
          {/* Gavel Head Bands (Gold) */}
          <rect x="195" y="315" width="100" height="18" rx="4" fill="url(#goldShine)" stroke="#8a6312" strokeWidth="1" />
          <rect x="195" y="315" width="100" height="18" rx="4" fill="url(#glossOverlay)" pointerEvents="none" />

          <rect x="195" y="400" width="100" height="18" rx="4" fill="url(#goldShine)" stroke="#8a6312" strokeWidth="1" />
          <rect x="195" y="400" width="100" height="18" rx="4" fill="url(#glossOverlay)" pointerEvents="none" />
        </g>
      </svg>
    </div>
  );
}
