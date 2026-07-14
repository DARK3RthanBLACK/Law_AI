import React from 'react';

/**
 * AnimatedGavelBackground
 *
 * Renders a premium polished-wood & brass gavel that swings down,
 * strikes the sounding block, bounces once, then lifts back up —
 * replicating the classic judge-hammer Lottie animation style.
 */
export default function AnimatedScaleBackground({
  opacity = 0.92,
  className = '',
  style = {}
}) {
  return (
    <div
      aria-hidden="true"
      className={`absolute left-0 right-0 pointer-events-none z-0 flex items-center justify-center ${className}`}
      style={{
        opacity,
        top: '50%',
        transform: 'translateY(-50%) translateY(-80px)',
        height: '480px',
        ...style
      }}
    >
      <svg
        className="w-full h-full max-h-full max-w-full"
        viewBox="0 0 520 480"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter:
            'drop-shadow(0 20px 30px rgba(0,0,0,0.6)) drop-shadow(0 4px 8px rgba(0,0,0,0.4))'
        }}
      >
        <defs>
          {/* ── Rich mahogany wood ── */}
          <linearGradient id="wood" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#5c2d0e" />
            <stop offset="30%"  stopColor="#3b1a08" />
            <stop offset="60%"  stopColor="#6b3312" />
            <stop offset="100%" stopColor="#2a1005" />
          </linearGradient>

          {/* ── Wood side/shadow face ── */}
          <linearGradient id="woodDark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#3b1a08" />
            <stop offset="100%" stopColor="#1a0b04" />
          </linearGradient>

          {/* ── Handle wood ── */}
          <linearGradient id="handle" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#8b4513" />
            <stop offset="40%"  stopColor="#5c2d0e" />
            <stop offset="100%" stopColor="#3b1a08" />
          </linearGradient>

          {/* ── Polished brass/gold ring ── */}
          <linearGradient id="brass" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#ffe88a" />
            <stop offset="30%"  stopColor="#d4a820" />
            <stop offset="70%"  stopColor="#b8860b" />
            <stop offset="100%" stopColor="#7a5c00" />
          </linearGradient>

          {/* ── Brass top highlight ── */}
          <linearGradient id="brassShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#fff4b0" />
            <stop offset="50%"  stopColor="#d4a820" />
            <stop offset="100%" stopColor="#8a6312" />
          </linearGradient>

          {/* ── Sounding block top ── */}
          <linearGradient id="blockTop" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#a0522d" />
            <stop offset="50%"  stopColor="#6b2f0a" />
            <stop offset="100%" stopColor="#3b1608" />
          </linearGradient>

          {/* ── Glossy specular sheen ── */}
          <linearGradient id="gloss" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.18)" />
            <stop offset="35%"  stopColor="rgba(255,255,255,0.04)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.25)" />
          </linearGradient>

          {/* ── Impact flash radial ── */}
          <radialGradient id="flash" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ffe066" stopOpacity="0.9" />
            <stop offset="60%"  stopColor="#f5a623" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f5a623" stopOpacity="0"   />
          </radialGradient>

          <clipPath id="headClip">
            <rect x="148" y="30" width="130" height="200" rx="14" />
          </clipPath>
        </defs>

        {/* ════════════════════════════════════
             KEYFRAME ANIMATIONS
             The gavel pivot is the RIGHT end of the handle (~430, 230).
             At rest  → rotated  +50° (head up-left)
             At strike → rotated  0°  (head down, hits block)
             ════════════════════════════════════ */}
        <style>{`
          /* --- Main swing group (handle + head) --- */
          @keyframes gavelSwing {
            /* rest / raised */
            0%   { transform: rotate(50deg); }
            /* pause raised */
            10%  { transform: rotate(50deg); }
            /* fast swing DOWN */
            28%  { transform: rotate(0deg); }
            /* tiny bounce up */
            36%  { transform: rotate(-8deg); }
            /* settle on block */
            44%  { transform: rotate(0deg); }
            /* hold on block */
            58%  { transform: rotate(0deg); }
            /* lift back up slowly */
            80%  { transform: rotate(50deg); }
            /* rest */
            100% { transform: rotate(50deg); }
          }
          .gavel-swing {
            transform-origin: 430px 210px;
            animation: gavelSwing 2.8s cubic-bezier(0.4,0,0.2,1) infinite;
          }

          /* --- Impact flash --- */
          @keyframes impactFlash {
            0%,26%  { opacity: 0; transform: scale(0.4); }
            28%     { opacity: 1; transform: scale(1.1); }
            38%     { opacity: 0; transform: scale(1.6); }
            100%    { opacity: 0; transform: scale(1.6); }
          }
          .impact-flash {
            transform-origin: 208px 225px;
            animation: impactFlash 2.8s ease-out infinite;
          }


        `}</style>

        {/* ══════════════════ SOUNDING BLOCK ══════════════════ */}
        {/* Ground shadow */}
        <ellipse
          cx="230" cy="403" rx="160" ry="22"
          fill="rgba(0,0,0,0.45)"
        />

        <g>
          {/* Block body */}
          <rect x="80" y="318" width="300" height="72" rx="10" fill="url(#wood)" stroke="#1a0b04" strokeWidth="1.5" />
          {/* Block body gloss */}
          <rect x="80" y="318" width="300" height="72" rx="10" fill="url(#gloss)" />

          {/* Block top face — aligned to hammer strike at y=308 */}
          <rect x="80" y="308" width="300" height="22" rx="8" fill="url(#blockTop)" stroke="#1a0b04" strokeWidth="1" />
          {/* Block top gloss */}
          <rect x="80" y="308" width="300" height="22" rx="8" fill="url(#gloss)" />

          {/* Brass inlay strip on block */}
          <rect x="90" y="345" width="280" height="10" rx="4" fill="url(#brass)" stroke="#7a5c00" strokeWidth="0.5" />
          <rect x="90" y="345" width="280" height="10" rx="4" fill="url(#gloss)" />

          {/* Block feet */}
          <rect x="100" y="386" width="260" height="12" rx="5" fill="url(#woodDark)" stroke="#1a0b04" strokeWidth="1" />
        </g>



        {/* ══════════════════ GAVEL (animates) ══════════════════ */}
        <g transform="translate(0, 83)">
        <g className="gavel-swing">

          {/* ── Handle ── long thin rod from head center to grip */}
          {/* Handle shadow strip (bottom edge) */}
          <rect x="198" y="122" width="248" height="10" rx="5" fill="rgba(0,0,0,0.3)" />
          {/* Handle body — centered on head mid-height (y≈112) */}
          <rect x="198" y="112" width="248" height="30" rx="10" fill="url(#handle)" stroke="#1a0b04" strokeWidth="1.5" />
          {/* Handle gloss */}
          <rect x="198" y="112" width="248" height="30" rx="10" fill="url(#gloss)" />

          {/* ── Grip wrap (gold rings at end) ── */}
          <rect x="390" y="106" width="55" height="42" rx="8" fill="url(#brassShine)" stroke="#8a6312" strokeWidth="1" />
          <rect x="390" y="106" width="55" height="42" rx="8" fill="url(#gloss)" />
          {/* Grip grooves */}
          {[400, 412, 424, 436].map(x => (
            <line key={x} x1={x} y1="106" x2={x} y2="148" stroke="#7a5c00" strokeWidth="2" opacity="0.55" />
          ))}

          {/* ── Head connector (brass ferrule) ── */}
          <rect x="185" y="102" width="28" height="50" rx="5" fill="url(#brassShine)" stroke="#8a6312" strokeWidth="1" />
          <rect x="185" y="102" width="28" height="50" rx="5" fill="url(#gloss)" />

          {/* ── Hammer head ── tall rectangular head (wood) ── */}
          {/* Head back shadow */}
          <rect x="152" y="33" width="126" height="196" rx="14" fill="rgba(0,0,0,0.25)" />
          {/* Head body */}
          <rect x="148" y="30" width="120" height="195" rx="14" fill="url(#wood)" stroke="#1a0b04" strokeWidth="2" />
          {/* Head gloss */}
          <rect x="148" y="30" width="120" height="195" rx="14" fill="url(#gloss)" />

          {/* ── Brass band – top ── */}
          <rect x="142" y="42" width="132" height="24" rx="6" fill="url(#brass)" stroke="#7a5c00" strokeWidth="1" />
          <rect x="142" y="42" width="132" height="24" rx="6" fill="url(#gloss)" />

          {/* ── Brass band – bottom ── */}
          <rect x="142" y="188" width="132" height="24" rx="6" fill="url(#brass)" stroke="#7a5c00" strokeWidth="1" />
          <rect x="142" y="188" width="132" height="24" rx="6" fill="url(#gloss)" />

          {/* ── Strike face specular dot ── */}
          <ellipse cx="208" cy="120" rx="28" ry="40" fill="rgba(255,255,255,0.06)" />

          {/* ══════════════════ IMPACT FLASH (lower face, synced with hammer) ══════════════════ */}
          <ellipse
            cx="208" cy="225" rx="90" ry="45"
            fill="url(#flash)"
            className="impact-flash"
            style={{ pointerEvents: 'none' }}
          />
        </g>
        </g>
      </svg>
    </div>
  );
}
