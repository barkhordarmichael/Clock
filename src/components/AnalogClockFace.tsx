import React from 'react';
import { ClockTheme } from '../types';
import { TimeState } from '../hooks/useCurrentTime';

interface AnalogClockFaceProps {
  theme: ClockTheme;
  timeState: TimeState;
  showDate: boolean;
  showSubdial: boolean;
  glassReflection: boolean;
  sizePx: number;
}

const ROMAN_NUMERALS = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];

export const AnalogClockFace: React.FC<AnalogClockFaceProps> = ({
  theme,
  timeState,
  showDate,
  showSubdial,
  glassReflection,
  sizePx,
}) => {
  const { hoursDeg, minutesDeg, secondsDeg, dayName, dateNum, isPm } = timeState;

  // Generate 60 minute ticks
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const angle = (i * 6 * Math.PI) / 180;
    const isHour = i % 5 === 0;
    const isCardinal = i % 15 === 0;

    const outerR = 212;
    const innerR = isCardinal ? 190 : isHour ? 194 : 204;

    const x1 = 250 + outerR * Math.sin(angle);
    const y1 = 250 - outerR * Math.cos(angle);
    const x2 = 250 + innerR * Math.sin(angle);
    const y2 = 250 - innerR * Math.cos(angle);

    return {
      index: i,
      x1,
      y1,
      x2,
      y2,
      isHour,
      isCardinal,
    };
  });

  // Generate sub-second ticks (1/5th second vintage regulator track)
  const subTicks = Array.from({ length: 120 }, (_, i) => {
    if (i % 2 === 0) return null; // skip ones overlapping with minute ticks
    const angle = (i * 3 * Math.PI) / 180;
    const outerR = 212;
    const innerR = 207;

    const x1 = 250 + outerR * Math.sin(angle);
    const y1 = 250 - outerR * Math.cos(angle);
    const x2 = 250 + innerR * Math.sin(angle);
    const y2 = 250 - innerR * Math.cos(angle);

    return { index: i, x1, y1, x2, y2 };
  }).filter(Boolean);

  // Generate hour numerals (1 to 12)
  const numerals = Array.from({ length: 12 }, (_, i) => {
    const num = i === 0 ? 12 : i;
    const angle = (i * 30 * Math.PI) / 180;
    const radius = theme.numeralStyle === 'military' ? 168 : 172;

    const x = 250 + radius * Math.sin(angle);
    const y = 250 - radius * Math.cos(angle);

    let displayLabel = num.toString();
    if (theme.numeralStyle === 'roman') {
      displayLabel = ROMAN_NUMERALS[i];
    }

    return { num, displayLabel, x, y };
  });

  // 24hr inner track for military aviation theme
  const military24Numerals = Array.from({ length: 12 }, (_, i) => {
    const num24 = i === 0 ? 24 : i + 12;
    const angle = (i * 30 * Math.PI) / 180;
    const radius = 138;
    const x = 250 + radius * Math.sin(angle);
    const y = 250 - radius * Math.cos(angle);
    return { num24, x, y };
  });

  // Screws on the outer bezel at 45 degree diagonals
  const bezelScrews = [45, 135, 225, 315].map((deg) => {
    const rad = (deg * Math.PI) / 180;
    const r = 238;
    return {
      x: 250 + r * Math.sin(rad),
      y: 250 - r * Math.cos(rad),
      deg,
    };
  });

  return (
    <div
      id="retro-analog-clock-container"
      className="relative flex items-center justify-center transition-all duration-300 select-none"
      style={{
        width: `${sizePx}px`,
        height: `${sizePx}px`,
        maxWidth: '100%',
        aspectRatio: '1/1',
      }}
    >
      <svg
        id="analog-clock-svg"
        viewBox="0 0 500 500"
        className="w-full h-full drop-shadow-[0_24px_45px_rgba(0,0,0,0.65)]"
        aria-label={`Retro clock showing ${timeState.hours}:${timeState.minutes.toString().padStart(2, '0')}`}
      >
        <defs>
          {/* Bezel Outer Wood/Metal Gradients */}
          <radialGradient id="bezel-outer-gradient" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor={theme.bezelHighlight} stopOpacity="0.8" />
            <stop offset="40%" stopColor={theme.bezelOuter} />
            <stop offset="85%" stopColor={theme.bezelAccent} />
            <stop offset="100%" stopColor="#080706" />
          </radialGradient>

          {/* Stepped Inner Bezel (Brushed Brass/Steel) */}
          <linearGradient id="bezel-inner-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.bezelHighlight} />
            <stop offset="25%" stopColor={theme.bezelInner} />
            <stop offset="50%" stopColor={theme.bezelAccent} />
            <stop offset="75%" stopColor={theme.bezelInner} />
            <stop offset="100%" stopColor={theme.bezelHighlight} />
          </linearGradient>

          {/* Dial Face Vintage Gradient */}
          <radialGradient id="dial-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={theme.dialTextureGradient[0]} />
            <stop offset="75%" stopColor={theme.dialTextureGradient[1]} />
            <stop offset="100%" stopColor={theme.dialTextureGradient[2]} />
          </radialGradient>

          {/* Dial Inner Rim Shadow for Sunken Appearance */}
          <radialGradient id="dial-inner-shadow" cx="50%" cy="50%" r="50%">
            <stop offset="88%" stopColor="#000000" stopOpacity="0" />
            <stop offset="97%" stopColor="#000000" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.6" />
          </radialGradient>

          {/* Convex Glass Dome Specular Glare */}
          <linearGradient id="glass-glare-top" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
            <stop offset="35%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="glass-glare-bottom" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Realistic Cast Shadows for Hands */}
          <filter id="hand-cast-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="3" dy="4" stdDeviation="3.2" floodColor="#0a0806" floodOpacity="0.45" />
          </filter>

          <filter id="second-hand-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#0a0806" floodOpacity="0.35" />
          </filter>

          {/* Subdial Circular Guilloché / Azurage Ring Pattern */}
          <pattern id="subdial-rings" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="2.5" fill="none" stroke={theme.subTextColor} strokeOpacity="0.12" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* 1. OUTSIDE CASING & BEZEL */}
        {/* Outer Casing Ring */}
        <circle cx="250" cy="250" r="248" fill="url(#bezel-outer-gradient)" stroke="#110e0c" strokeWidth="2" />

        {/* Outer Rim Lip Accent */}
        <circle cx="250" cy="250" r="236" fill="none" stroke={theme.bezelAccent} strokeWidth="2" opacity="0.6" />

        {/* Authentic Bezel Screws / Rivets */}
        {bezelScrews.map(({ x, y, deg }, idx) => (
          <g key={idx} transform={`translate(${x}, ${y}) rotate(${deg + 25})`}>
            <circle cx="0" cy="0" r="5" fill={theme.bezelInner} stroke={theme.bezelAccent} strokeWidth="1" />
            <line x1="-3" y1="0" x2="3" y2="0" stroke={theme.bezelAccent} strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="-1.5" cy="-1.5" r="1.5" fill="#ffffff" opacity="0.4" />
          </g>
        ))}

        {/* Stepped Brushed Brass/Steel Middle Bezel */}
        <circle cx="250" cy="250" r="226" fill="url(#bezel-inner-ring)" stroke={theme.bezelAccent} strokeWidth="1.5" />

        {/* Inner Chamfer Rim */}
        <circle cx="250" cy="250" r="219" fill="none" stroke="#000000" strokeWidth="2.5" opacity="0.8" />

        {/* 2. DIAL FACE */}
        {/* Main Dial Plate */}
        <circle cx="250" cy="250" r="218" fill="url(#dial-gradient)" />

        {/* Sunken Inner Dial Shadow */}
        <circle cx="250" cy="250" r="218" fill="url(#dial-inner-shadow)" />

        {/* Outer Minute Track Circles */}
        <circle cx="250" cy="250" r="212" fill="none" stroke={theme.dialBorder} strokeWidth="1.2" opacity="0.75" />
        <circle cx="250" cy="250" r="204" fill="none" stroke={theme.dialBorder} strokeWidth="0.8" opacity="0.5" />
        <circle cx="250" cy="250" r="190" fill="none" stroke={theme.dialBorder} strokeWidth="0.5" opacity="0.3" />

        {/* Sub-second precision track */}
        {subTicks.map((tick) => tick && (
          <line
            key={`sub-${tick.index}`}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke={theme.minuteTickColor}
            strokeWidth="0.75"
            opacity="0.55"
          />
        ))}

        {/* Minute & Hour Ticks */}
        {ticks.map((tick) => (
          <g key={`tick-${tick.index}`}>
            <line
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              stroke={tick.isHour ? theme.hourTickColor : theme.minuteTickColor}
              strokeWidth={tick.isCardinal ? 3.5 : tick.isHour ? 2.6 : 1.2}
              strokeLinecap="round"
            />
            {/* Luminous Pips or Diamonds at 5-minute intervals */}
            {tick.isHour && (
              <circle
                cx={250 + 208 * Math.sin((tick.index * 6 * Math.PI) / 180)}
                cy={250 - 208 * Math.cos((tick.index * 6 * Math.PI) / 180)}
                r={tick.isCardinal ? 2.5 : 1.8}
                fill={theme.accentColor}
                opacity={0.85}
              />
            )}
          </g>
        ))}

        {/* Hour Numerals */}
        {numerals.map(({ num, displayLabel, x, y }) => {
          // If Date window is shown at 3 o'clock, suppress "3" or "III" to keep genuine horological layout
          if (showDate && num === 3) return null;
          // If Subdial is shown at 6 o'clock and occupies space, reduce or omit 6
          if (showSubdial && num === 6 && theme.numeralStyle !== 'minimal') {
            return (
              <text
                key={`num-${num}`}
                x={x}
                y={y + 12}
                textAnchor="middle"
                dominantBaseline="central"
                fill={theme.textColor}
                fontFamily={theme.hourNumeralFont}
                fontSize={theme.numeralStyle === 'roman' ? '18' : '22'}
                fontWeight="600"
                opacity="0.85"
                letterSpacing={theme.numeralStyle === 'roman' ? '1px' : '0'}
              >
                {displayLabel}
              </text>
            );
          }

          return (
            <text
              key={`num-${num}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={theme.textColor}
              fontFamily={theme.hourNumeralFont}
              fontSize={theme.numeralStyle === 'roman' ? '24' : '30'}
              fontWeight="600"
              opacity="0.95"
              letterSpacing={theme.numeralStyle === 'roman' ? '1px' : '0'}
            >
              {displayLabel}
            </text>
          );
        })}

        {/* 24-Hour Inner Scale for Military Cockpit Theme */}
        {theme.numeralStyle === 'military' && military24Numerals.map(({ num24, x, y }) => (
          <text
            key={`mil-${num24}`}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fill={theme.subTextColor}
            fontFamily={theme.hourNumeralFont}
            fontSize="12"
            fontWeight="500"
            opacity="0.75"
          >
            {num24}
          </text>
        ))}

        {/* 3. DIAL BRAND TEXT & ORIGIN */}
        <g id="dial-typography">
          {/* Brand Inscription */}
          <text
            x="250"
            y={showSubdial ? 162 : 166}
            textAnchor="middle"
            fill={theme.textColor}
            fontFamily={theme.hourNumeralFont}
            fontSize="14"
            fontWeight="700"
            letterSpacing="2.5px"
            opacity="0.9"
          >
            {theme.brandText}
          </text>

          {/* Sub-text / Movement Type */}
          <text
            x="250"
            y={showSubdial ? 178 : 184}
            textAnchor="middle"
            fill={theme.subTextColor}
            fontFamily="'Space Mono', monospace"
            fontSize="8.5"
            fontWeight="600"
            letterSpacing="1.8px"
            opacity="0.8"
          >
            {theme.originText}
          </text>

          {/* Bottom Origin stamp */}
          <text
            x="250"
            y="410"
            textAnchor="middle"
            fill={theme.subTextColor}
            fontFamily="'Space Mono', monospace"
            fontSize="8"
            fontWeight="500"
            letterSpacing="1.5px"
            opacity="0.7"
          >
            SWISS - T &lt; 25
          </text>
        </g>

        {/* 4. COMPLICATIONS */}

        {/* DATE APERTURE (3 o'clock) */}
        {showDate && (
          <g id="date-aperture" transform="translate(365, 236)">
            {/* Beveled Outer Window Frame */}
            <rect
              x="-48"
              y="-14"
              width="82"
              height="28"
              rx="3"
              fill={theme.dateBoxBg}
              stroke={theme.dateBoxBorder}
              strokeWidth="2"
              filter="drop-shadow(1px 2px 2px rgba(0,0,0,0.35))"
            />
            {/* Inner Recessed Shadow */}
            <rect
              x="-46"
              y="-12"
              width="78"
              height="24"
              rx="2"
              fill="none"
              stroke="#000000"
              strokeWidth="1"
              opacity="0.25"
            />
            {/* Subtle Divider between Day & Date */}
            <line x1="-12" y1="-12" x2="-12" y2="12" stroke={theme.dateBoxBorder} strokeWidth="1" opacity="0.6" />

            {/* Day of Week */}
            <text
              x="-29"
              y="2"
              textAnchor="middle"
              dominantBaseline="central"
              fill={theme.accentColor}
              fontFamily="'Space Mono', monospace"
              fontSize="11"
              fontWeight="700"
              letterSpacing="0.5px"
            >
              {dayName}
            </text>

            {/* Date Number */}
            <text
              x="11"
              y="2"
              textAnchor="middle"
              dominantBaseline="central"
              fill={theme.dateTextColor}
              fontFamily="'EB Garamond', serif"
              fontSize="16"
              fontWeight="700"
            >
              {dateNum}
            </text>
          </g>
        )}

        {/* AUXILIARY SUBDIAL (6 o'clock): Continuous Second / 24-hr Subdial */}
        {showSubdial && (
          <g id="auxiliary-subdial" transform="translate(250, 335)">
            {/* Subdial Circular Recess */}
            <circle cx="0" cy="0" r="44" fill={theme.dialBg} stroke={theme.dialBorder} strokeWidth="1" />
            <circle cx="0" cy="0" r="44" fill="url(#dial-inner-shadow)" opacity="0.6" />

            {/* Azurage Concentric Texture */}
            <circle cx="0" cy="0" r="42" fill="none" stroke={theme.subTextColor} strokeWidth="0.5" opacity="0.25" />
            <circle cx="0" cy="0" r="32" fill="none" stroke={theme.subTextColor} strokeWidth="0.5" opacity="0.2" />
            <circle cx="0" cy="0" r="22" fill="none" stroke={theme.subTextColor} strokeWidth="0.5" opacity="0.2" />

            {/* Subdial Ticks (12 indices) */}
            {Array.from({ length: 12 }, (_, i) => {
              const ang = (i * 30 * Math.PI) / 180;
              const isMajor = i % 3 === 0;
              const r1 = 43;
              const r2 = isMajor ? 35 : 38;
              return (
                <line
                  key={`subtick-${i}`}
                  x1={r1 * Math.sin(ang)}
                  y1={-r1 * Math.cos(ang)}
                  x2={r2 * Math.sin(ang)}
                  y2={-r2 * Math.cos(ang)}
                  stroke={isMajor ? theme.hourTickColor : theme.minuteTickColor}
                  strokeWidth={isMajor ? 1.5 : 0.8}
                />
              );
            })}

            {/* Subdial Numerals (10, 20, 30, 40, 50, 60) */}
            {[60, 20, 40].map((val, idx) => {
              const ang = (idx * 120 * Math.PI) / 180;
              const r = 26;
              return (
                <text
                  key={`subnum-${val}`}
                  x={r * Math.sin(ang)}
                  y={-r * Math.cos(ang) + 3}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={theme.subTextColor}
                  fontFamily="'Space Mono', monospace"
                  fontSize="8"
                  fontWeight="600"
                >
                  {val}
                </text>
              );
            })}

            {/* Subdial Hand (Smooth/Ticking Seconds) */}
            <g transform={`rotate(${secondsDeg})`}>
              <line x1="0" y1="8" x2="0" y2="-38" stroke={theme.secondHandColor} strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="0" cy="0" r="2.5" fill={theme.secondHandCapColor} />
            </g>
          </g>
        )}

        {/* 5. MAIN TIMEPIECE HANDS (with dynamic 3D drop shadow) */}

        {/* HOUR HAND */}
        <g id="hour-hand" transform={`rotate(${hoursDeg}, 250, 250)`} filter="url(#hand-cast-shadow)">
          {theme.handStyle === 'spade' ? (
            // Vintage Station Spade Hand
            <path
              d="M 250 274 L 246 250 L 247 180 Q 242 165 240 156 Q 238 140 250 128 Q 262 140 260 156 Q 258 165 253 180 L 254 250 L 250 274 Z"
              fill={theme.hourHandColor}
              stroke={theme.hourHandAccent || theme.bezelAccent}
              strokeWidth="0.8"
            />
          ) : theme.handStyle === 'syringe' ? (
            // Aviator Syringe Hand with luminous inlay channel
            <g>
              <path
                d="M 245 272 L 244 175 L 247 165 L 250 135 L 253 165 L 256 175 L 255 272 Z"
                fill={theme.hourHandColor}
              />
              <rect
                x="247"
                y="172"
                width="6"
                height="65"
                rx="2"
                fill={theme.hourHandAccent || theme.textColor}
                opacity="0.9"
              />
              <circle cx="250" cy="272" r="6" fill={theme.hourHandColor} />
            </g>
          ) : (
            // Classic Mid-Century Baton / Teardrop Hand
            <g>
              <path
                d="M 245 272 L 246 160 L 250 142 L 254 160 L 255 272 Q 250 278 245 272 Z"
                fill={theme.hourHandColor}
              />
              {theme.hourHandAccent && (
                <path
                  d="M 248 248 L 248 168 L 250 154 L 252 168 L 252 248 Z"
                  fill={theme.hourHandAccent}
                  opacity="0.85"
                />
              )}
            </g>
          )}
        </g>

        {/* MINUTE HAND */}
        <g id="minute-hand" transform={`rotate(${minutesDeg}, 250, 250)`} filter="url(#hand-cast-shadow)">
          {theme.handStyle === 'spade' ? (
            // Elongated Vintage Minute Pear/Spade Hand
            <path
              d="M 250 278 L 247 250 L 248 120 Q 244 105 243 95 Q 242 80 250 68 Q 258 80 257 95 Q 256 105 252 120 L 253 250 L 250 278 Z"
              fill={theme.minuteHandColor}
              stroke={theme.minuteHandAccent || theme.bezelAccent}
              strokeWidth="0.8"
            />
          ) : theme.handStyle === 'syringe' ? (
            // Aviator Syringe Minute Hand
            <g>
              <path
                d="M 246 276 L 245 105 L 248 95 L 250 62 L 252 95 L 255 105 L 254 276 Z"
                fill={theme.minuteHandColor}
              />
              <rect
                x="247.5"
                y="104"
                width="5"
                height="120"
                rx="2"
                fill={theme.minuteHandAccent || theme.textColor}
                opacity="0.9"
              />
              <circle cx="250" cy="276" r="5" fill={theme.minuteHandColor} />
            </g>
          ) : (
            // Classic Baton Minute Hand
            <g>
              <path
                d="M 246 278 L 247 92 L 250 72 L 253 92 L 254 278 Q 250 284 246 278 Z"
                fill={theme.minuteHandColor}
              />
              {theme.minuteHandAccent && (
                <path
                  d="M 248.5 248 L 248.5 102 L 250 82 L 251.5 102 L 251.5 248 Z"
                  fill={theme.minuteHandAccent}
                  opacity="0.85"
                />
              )}
            </g>
          )}
        </g>

        {/* SECONDS HAND */}
        {/* Even with subdial, a central sweep seconds hand is standard in many retro chronos or toggleable */}
        <g id="second-hand" transform={`rotate(${secondsDeg}, 250, 250)`} filter="url(#second-hand-shadow)">
          {/* Needle Stem */}
          <line
            x1="250"
            y1="300"
            x2="250"
            y2="55"
            stroke={theme.secondHandColor}
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Counterbalance Tail */}
          {theme.id === 'braun-bauhaus' ? (
            // Signature Bauhaus circular ring counterweight
            <circle cx="250" cy="286" r="6" fill="none" stroke={theme.secondHandColor} strokeWidth="2" />
          ) : theme.id === 'cockpit-pilot' ? (
            // Aviation arrowhead tail
            <path d="M 246 295 L 250 306 L 254 295 Z" fill={theme.secondHandColor} />
          ) : (
            // Vintage teardrop / pear counterweight
            <path
              d="M 250 302 C 246 302 245 288 250 280 C 255 288 254 302 250 302 Z"
              fill={theme.secondHandColor}
            />
          )}

          {/* Tip pointer accent */}
          <circle cx="250" cy="74" r="3" fill={theme.secondHandColor} />
        </g>

        {/* 6. CENTER PINION / CANNON PINION */}
        <g id="center-pinion">
          {/* Bottom Brass Collar */}
          <circle cx="250" cy="250" r="10" fill={theme.bezelAccent} />
          {/* Main Pinion Cap */}
          <circle cx="250" cy="250" r="7.5" fill={theme.pinionColor} stroke={theme.bezelAccent} strokeWidth="1" />
          {/* Specular Highlight on Pinion */}
          <circle cx="247.5" cy="247.5" r="2.5" fill="#ffffff" opacity="0.6" />
          {/* Center Rivet */}
          <circle cx="250" cy="250" r="2" fill={theme.bezelAccent} />
        </g>

        {/* 7. GLASS CRYSTAL SPECULAR HIGHLIGHT (Convex lens effect) */}
        {glassReflection && (
          <g id="glass-reflection" pointerEvents="none">
            {/* Top crescent specular reflection */}
            <path
              d="M 85 180 Q 250 115 415 180 A 216 216 0 0 0 85 180 Z"
              fill="url(#glass-glare-top)"
            />
            {/* Bottom soft rim reflection */}
            <path
              d="M 120 370 Q 250 420 380 370 A 216 216 0 0 1 120 370 Z"
              fill="url(#glass-glare-bottom)"
            />
            {/* Curved Glare Diagonal Arc */}
            <ellipse
              cx="200"
              cy="160"
              rx="120"
              ry="55"
              transform="rotate(-28, 200, 160)"
              fill="#ffffff"
              opacity="0.06"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
