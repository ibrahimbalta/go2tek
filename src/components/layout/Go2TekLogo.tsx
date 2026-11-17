import React from 'react';

export function Go2TekLogo({
  variant = 'light',
  size = 'md',
}: {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}) {
  const isDark = variant === 'dark';
  const heightClass =
    size === 'sm' ? 'h-10' : size === 'lg' ? 'h-16' : 'h-12 sm:h-14';

  return (
    <div className="inline-flex items-center select-none">
      <svg
        viewBox="0 0 370 105"
        className={`${heightClass} w-auto`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Go2Tek 2.El Teknoloji Mağazası"
      >
        <defs>
          <linearGradient id="g2tRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="55%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
          <filter id="g2tShadow" x="-10%" y="-10%" width="125%" height="125%">
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="1.5"
              floodColor="#000000"
              floodOpacity={isDark ? '0.5' : '0.18'}
            />
          </filter>
        </defs>

        {/* Left 3D Laptop Icon with Dynamic Orbital Swoosh (Matching Storefront Sign) */}
        <g filter="url(#g2tShadow)">
          {/* Orbital swoosh behind/around laptop */}
          <path
            d="M68 24C84 18 95 24 89 40C85 50 73 61 58 68"
            stroke="url(#g2tRedGrad)"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          <path
            d="M16 56C6 68 8 81 26 81C40 81 58 74 74 64"
            stroke="url(#g2tRedGrad)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Laptop Screen */}
          <polygon
            points="24,22 64,19 67,56 27,60"
            fill="url(#g2tRedGrad)"
          />
          <polygon
            points="28,26 60,23.5 62.5,52 30.5,55.5"
            fill={isDark ? '#18181B' : '#FFFFFF'}
          />
          {/* Laptop Keyboard Base */}
          <polygon
            points="27,61 67,57 86,69 44,75"
            fill="url(#g2tRedGrad)"
          />
          {/* Keyboard lines */}
          <line
            x1="35"
            y1="64"
            x2="66"
            y2="61"
            stroke={isDark ? '#18181B' : '#FFFFFF'}
            strokeWidth="1.6"
          />
          <line
            x1="40"
            y1="68"
            x2="72"
            y2="64.5"
            stroke={isDark ? '#18181B' : '#FFFFFF'}
            strokeWidth="1.6"
          />
        </g>

        {/* Overhead Dynamic Red Arc Swoosh above "Go2Tek" */}
        <path
          d="M205 22C258 3 338 5 355 34C363 48 354 63 340 69C348 56 348 41 334 31C308 13 252 14 205 22Z"
          fill="url(#g2tRedGrad)"
          filter="url(#g2tShadow)"
        />

        {/* Main Wordmark: Go2Tek */}
        <text
          x="102"
          y="67"
          fill={isDark ? '#FFFFFF' : 'url(#g2tRedGrad)'}
          stroke={isDark ? '#DC2626' : '#7F1D1D'}
          strokeWidth={isDark ? '1.5' : '0.6'}
          fontFamily="Arial Black, Impact, Inter, sans-serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize="54"
          letterSpacing="-1.5"
          filter="url(#g2tShadow)"
        >
          Go2Tek
        </text>

        {/* Left & Right Accent Lines + "2.El Teknoloji Mağazası" */}
        <rect
          x="82"
          y="85"
          width="32"
          height="3.5"
          rx="1.75"
          fill="#DC2626"
        />
        <text
          x="224"
          y="91"
          fill={isDark ? '#F8FAFC' : '#DC2626'}
          fontFamily="Inter, Arial, sans-serif"
          fontWeight="800"
          fontStyle="italic"
          fontSize="15.5"
          textAnchor="middle"
        >
          2.El Teknoloji Mağazası
        </text>
        <rect
          x="332"
          y="85"
          width="28"
          height="3.5"
          rx="1.75"
          fill="#DC2626"
        />
      </svg>
    </div>
  );
}
