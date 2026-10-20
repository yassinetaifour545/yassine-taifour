import React, { useState } from 'react';
import { Car } from '../types';

interface CarVisualProps {
  car: Car;
  className?: string;
  isFlipped?: boolean;
}

export const CarVisual: React.FC<CarVisualProps> = ({ car, className = '' }) => {
  const [imgError, setImgError] = useState(false);
  const photoUrl = car.image;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl bg-white dark:bg-[#1C1C1C] p-2 sm:p-3 flex items-center justify-center border border-black/5 dark:border-white/5 transition-all duration-300 ${className}`}
    >
      {/* Studio Radial Accent Glow */}
      <div
        className="absolute inset-0 opacity-15 dark:opacity-25 blur-xl pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 50% 55%, ${car.imageAccent} 0%, transparent 65%)`,
        }}
      />

      {/* Subtle Studio Floor Grid / Reflection */}
      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/5 dark:from-white/5 to-transparent pointer-events-none" />

      {!imgError && photoUrl ? (
        <div className="relative z-10 w-full h-44 flex items-center justify-center">
          <img
            src={photoUrl}
            alt={`Yassine Location - ${car.name}`}
            className="w-full h-full object-contain transform transition-transform duration-500 hover:scale-105 drop-shadow-md"
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </div>
      ) : (
        /* Bespoke SVG Architectural Vector Silhouette Fallback */
        <div className="relative z-10 w-full h-44 flex flex-col items-center justify-center">
          <svg
            className="w-full h-32 text-neutral-800 dark:text-neutral-200 transition-transform duration-300 group-hover:scale-105"
            viewBox="0 0 320 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ground shadow */}
            <ellipse cx="160" cy="105" rx="130" ry="8" fill="currentColor" fillOpacity="0.12" />

            {/* Aerodynamic Chassis */}
            <path
              d={
                car.silhouetteType === 'suv'
                  ? 'M 25 80 L 40 50 Q 80 42 120 30 Q 180 28 225 35 L 265 60 Q 295 72 300 82 Q 302 92 290 94 L 270 94 Q 265 82 245 82 Q 225 82 220 94 L 105 94 Q 100 82 80 82 Q 60 82 55 94 L 25 94 Z'
                  : 'M 25 82 L 45 62 Q 95 48 135 34 Q 190 32 230 46 L 275 66 Q 298 76 300 84 Q 302 92 290 94 L 270 94 Q 265 82 245 82 Q 225 82 220 94 L 105 94 Q 100 82 80 82 Q 60 82 55 94 L 25 94 Z'
              }
              fill="currentColor"
              fillOpacity="0.88"
            />

            {/* Windshield & Windows */}
            <path
              d="M 125 38 L 175 36 L 218 42 L 210 60 L 115 60 Z"
              fill={car.imageAccent}
              fillOpacity="0.4"
            />

            {/* Alloy Wheels */}
            <g transform="translate(80, 94)">
              <circle cx="0" cy="0" r="16" fill="#171717" />
              <circle cx="0" cy="0" r="12" fill="#525252" />
              <circle cx="0" cy="0" r="6" fill="#D4D4D8" />
              <line x1="-10" y1="0" x2="10" y2="0" stroke="#E4E4E7" strokeWidth="2" />
              <line x1="0" y1="-10" x2="0" y2="10" stroke="#E4E4E7" strokeWidth="2" />
            </g>

            <g transform="translate(245, 94)">
              <circle cx="0" cy="0" r="16" fill="#171717" />
              <circle cx="0" cy="0" r="12" fill="#525252" />
              <circle cx="0" cy="0" r="6" fill="#D4D4D8" />
              <line x1="-10" y1="0" x2="10" y2="0" stroke="#E4E4E7" strokeWidth="2" />
              <line x1="0" y1="-10" x2="0" y2="10" stroke="#E4E4E7" strokeWidth="2" />
            </g>

            {/* Headlight beam */}
            <circle cx="295" cy="78" r="3" fill="#F5A623" />
            <path d="M 295 78 L 318 72 L 318 84 Z" fill="#F5A623" fillOpacity="0.3" />
          </svg>
          <span className="text-[11px] font-medium tracking-wider uppercase text-neutral-400 dark:text-neutral-500 mt-1">
            Studio Model Silhouette
          </span>
        </div>
      )}

      {/* Model Category Badge */}
      <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-black/75 text-white backdrop-blur-md">
        {car.category}
      </div>
    </div>
  );
};
