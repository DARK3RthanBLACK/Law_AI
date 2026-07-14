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
        transform: "translateY(-50%) translateY(35px)",
        height: "470px", // Matches sign-in card height
        ...style 
      }}
    >
      <svg 
        className="w-full h-full max-h-full max-w-full" 
        viewBox="0 0 680 560" 
        xmlns="http://www.w3.org/2000/svg"
        style={{
          // Solid 3D edge extrusion (offset shadow) + soft warm gold ambient glow
          filter: "drop-shadow(0 6px 0px rgba(140, 102, 23, 0.55)) drop-shadow(0 15px 30px rgba(212, 175, 55, 0.2))"
        }}
      >
        <defs>
          {/* Saturated and bright golden gradients matching the UI buttons exactly */}
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a37a1a" />
            <stop offset="25%" stopColor="#d4af37" />
            <stop offset="50%" stopColor="#ffeb84" />
            <stop offset="75%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#a37a1a" />
          </linearGradient>
          
          <linearGradient id="panGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffeb84" />
            <stop offset="50%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#8c6617" />
          </linearGradient>
        </defs>

        <style>{`
          @keyframes tiltBeam {
            0%   { transform: rotate(-7deg); }
            50%  { transform: rotate(7deg); }
            100% { transform: rotate(-7deg); }
          }
          .scale-beam-group {
            /* Aligned pivot point to (340, 74) to match the center of the rotating beam dip */
            transform-origin: 340px 74px;
            animation: tiltBeam 3.5s ease-in-out infinite;
          }
        `}</style>

        {/* base plinth */}
        <rect x="255" y="486" width="170" height="20" rx="4" fill="url(#goldGrad)" stroke="#8a6d3b" strokeWidth="1" />
        <rect x="285" y="468" width="110" height="20" rx="3" fill="url(#goldGrad)" stroke="#8a6d3b" strokeWidth="1" />

        {/* goblet-shaped bulb connecting pole to base */}
        <path
          d="M320 380
             C303 402, 298 424, 308 447
             C314 460, 326 468, 340 468
             C354 468, 366 460, 372 447
             C382 424, 377 402, 360 380
             Z"
          fill="url(#goldGrad)"
          stroke="#8a6d3b"
          strokeWidth="1"
        />
        <rect x="322" y="362" width="36" height="20" rx="5" fill="url(#goldGrad)" stroke="#8a6d3b" strokeWidth="1" />

        {/* central pole - started at y=66 to tuck seamlessly behind the thick beam path (which visually spans y=61 to y=75) */}
        <rect x="328" y="66" width="24" height="298" fill="url(#goldGrad)" stroke="#8a6d3b" strokeWidth="1" />

        <g className="scale-beam-group">
          <path
            d="M110 60 Q225 18 340 68 Q455 18 570 60"
            fill="none"
            stroke="url(#goldGrad)"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* left strings, anchored exactly at beam tip (110,60) */}
          <line x1="110" y1="60" x2="70" y2="222" stroke="#fff2bc" strokeWidth="2.5" />
          <line x1="110" y1="60" x2="160" y2="222" stroke="#fff2bc" strokeWidth="2.5" />
          <ellipse cx="115" cy="228" rx="90" ry="18" fill="url(#panGrad)" stroke="#8a6d3b" strokeWidth="1" />

          {/* right strings, anchored exactly at beam tip (570,60) */}
          <line x1="570" y1="60" x2="530" y2="222" stroke="#fff2bc" strokeWidth="2.5" />
          <line x1="570" y1="60" x2="620" y2="222" stroke="#fff2bc" strokeWidth="2.5" />
          <ellipse cx="575" cy="228" rx="90" ry="18" fill="url(#panGrad)" stroke="#8a6d3b" strokeWidth="1" />

          {/* small hooks at each tip for a finished attachment point */}
          <circle cx="110" cy="60" r="5" fill="url(#goldGrad)" stroke="#8a6d3b" strokeWidth="1" />
          <circle cx="570" cy="60" r="5" fill="url(#goldGrad)" stroke="#8a6d3b" strokeWidth="1" />
        </g>

        {/* Removed the pivot pin circle at (340, 74) to let the beam rest directly on top of the pole */}
      </svg>
    </div>
  );
}
