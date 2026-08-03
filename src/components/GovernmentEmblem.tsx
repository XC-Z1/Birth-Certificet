import React from 'react';

interface GovernmentEmblemProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const GovernmentEmblem: React.FC<GovernmentEmblemProps> = ({ className = '', size = 56, showText = false }) => {
  return (
    <div className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className="drop-shadow-lg transition-transform duration-300 hover:scale-105"
        aria-label="Bangladesh Government Emblem"
      >
        <defs>
          <linearGradient id="emblemGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          <linearGradient id="emblemGreenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#006A4E" />
            <stop offset="100%" stopColor="#004D38" />
          </linearGradient>

          <radialGradient id="redSunGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF3B4E" />
            <stop offset="85%" stopColor="#D91C2B" />
            <stop offset="100%" stopColor="#A6101D" />
          </radialGradient>
        </defs>

        {/* Outer Golden Border Circle */}
        <circle cx="100" cy="100" r="96" fill="url(#emblemGreenGrad)" stroke="url(#emblemGoldGrad)" strokeWidth="5" />
        <circle cx="100" cy="100" r="91" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="3,3" />

        {/* Outer Circular Ring Text Path */}
        <path id="textCircle" d="M 22 100 A 78 78 0 1 1 178 100 A 78 78 0 1 1 22 100" fill="none" />
        <text className="font-bengali font-bold text-[11px]" fill="#FEF08A" letterSpacing="1.2">
          <textPath href="#textCircle" startOffset="50%" textAnchor="middle">
            গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
          </textPath>
        </text>

        {/* Central Red Circle (Representing the Sun / Flag Center) */}
        <circle cx="100" cy="108" r="54" fill="url(#redSunGrad)" stroke="url(#emblemGoldGrad)" strokeWidth="2.5" />

        {/* Water Waves at Base of Shapla */}
        <path
          d="M 60 138 Q 70 134, 80 138 T 100 138 T 120 138 T 140 138 C 135 146, 120 152, 100 152 C 80 152, 65 146, 60 138 Z"
          fill="#38BDF8"
          stroke="#0284C7"
          strokeWidth="1"
        />
        <path
          d="M 68 143 Q 76 140, 84 143 T 100 143 T 116 143 T 132 143"
          fill="none"
          stroke="#E0F2FE"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Central Water Lily (Shapla) */}
        {/* Outer Back Petals */}
        <path d="M 100 115 C 60 100 50 125 72 135 C 85 130 95 125 100 115 Z" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1" />
        <path d="M 100 115 C 140 100 150 125 128 135 C 115 130 105 125 100 115 Z" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1" />

        {/* Mid Petals */}
        <path d="M 100 102 C 72 90 62 120 82 132 C 92 124 98 116 100 102 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
        <path d="M 100 102 C 128 90 138 120 118 132 C 108 124 102 116 100 102 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />

        {/* Center Main Petal */}
        <path d="M 100 82 C 88 100 92 122 100 130 C 108 122 112 100 100 82 Z" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.2" />

        {/* Paddy Sheaves (Paddy Grains / Rice Ears on Sides) */}
        {/* Left Sheaf Arc */}
        <path d="M 52 120 C 42 100 46 72 68 52" fill="none" stroke="url(#emblemGoldGrad)" strokeWidth="3" strokeLinecap="round" />
        {/* Left Paddy Grains */}
        {[
          { cx: 50, cy: 115, rx: 6, ry: 3, rot: -40 },
          { cx: 45, cy: 102, rx: 6, ry: 3, rot: -50 },
          { cx: 43, cy: 88, rx: 6, ry: 3, rot: -60 },
          { cx: 46, cy: 74, rx: 6, ry: 3, rot: -70 },
          { cx: 54, cy: 62, rx: 6, ry: 3, rot: -80 },
          { cx: 65, cy: 53, rx: 6, ry: 3, rot: -85 },
        ].map((g, idx) => (
          <ellipse key={`lg-${idx}`} cx={g.cx} cy={g.cy} rx={g.rx} ry={g.ry} transform={`rotate(${g.rot} ${g.cx} ${g.cy})`} fill="url(#emblemGoldGrad)" stroke="#B45309" strokeWidth="0.8" />
        ))}

        {/* Right Sheaf Arc */}
        <path d="M 148 120 C 158 100 154 72 132 52" fill="none" stroke="url(#emblemGoldGrad)" strokeWidth="3" strokeLinecap="round" />
        {/* Right Paddy Grains */}
        {[
          { cx: 150, cy: 115, rx: 6, ry: 3, rot: 40 },
          { cx: 155, cy: 102, rx: 6, ry: 3, rot: 50 },
          { cx: 157, cy: 88, rx: 6, ry: 3, rot: 60 },
          { cx: 154, cy: 74, rx: 6, ry: 3, rot: 70 },
          { cx: 146, cy: 62, rx: 6, ry: 3, rot: 80 },
          { cx: 135, cy: 53, rx: 6, ry: 3, rot: 85 },
        ].map((g, idx) => (
          <ellipse key={`rg-${idx}`} cx={g.cx} cy={g.cy} rx={g.rx} ry={g.ry} transform={`rotate(${g.rot} ${g.cx} ${g.cy})`} fill="url(#emblemGoldGrad)" stroke="#B45309" strokeWidth="0.8" />
        ))}

        {/* Jute Leaves at Top Center (3 Connected Leaves) */}
        {/* Center Leaf */}
        <path d="M 100 36 C 94 48 96 58 100 62 C 104 58 106 48 100 36 Z" fill="url(#emblemGoldGrad)" stroke="#78350F" strokeWidth="0.8" />
        {/* Left Leaf */}
        <path d="M 100 48 C 88 44 82 52 94 62 C 97 58 98 52 100 48 Z" fill="url(#emblemGoldGrad)" stroke="#78350F" strokeWidth="0.8" />
        {/* Right Leaf */}
        <path d="M 100 48 C 112 44 118 52 106 62 C 103 58 102 52 100 48 Z" fill="url(#emblemGoldGrad)" stroke="#78350F" strokeWidth="0.8" />

        {/* Four 5-Pointed Golden Stars (2 on Left, 2 on Right) */}
        {/* Left Stars */}
        <polygon points="72,36 74,40 78,40 75,43 76,47 72,44 68,47 69,43 66,40 70,40" fill="url(#emblemGoldGrad)" stroke="#78350F" strokeWidth="0.5" />
        <polygon points="85,28 87,32 91,32 88,35 89,39 85,36 81,39 82,35 79,32 83,32" fill="url(#emblemGoldGrad)" stroke="#78350F" strokeWidth="0.5" />

        {/* Right Stars */}
        <polygon points="115,28 117,32 121,32 118,35 119,39 115,36 111,39 112,35 109,32 113,32" fill="url(#emblemGoldGrad)" stroke="#78350F" strokeWidth="0.5" />
        <polygon points="128,36 130,40 134,40 131,43 132,47 128,44 124,47 125,43 122,40 126,40" fill="url(#emblemGoldGrad)" stroke="#78350F" strokeWidth="0.5" />
      </svg>

      {showText && (
        <span className="mt-1 text-[11px] font-bold font-bengali text-[#006A4E] dark:text-[#34D399] tracking-tight text-center">
          গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
        </span>
      )}
    </div>
  );
};
