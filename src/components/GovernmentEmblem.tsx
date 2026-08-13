import React, { useState } from 'react';

interface GovernmentEmblemProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const GovernmentEmblem: React.FC<GovernmentEmblemProps> = ({ className = '', size = 56, showText = false }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}>
      {!imgError ? (
        <img
          src="https://i.postimg.cc/wMh1R3Xc/images.png"
          alt="Bangladesh Government Emblem"
          style={{ width: size, height: size, objectFit: 'contain' }}
          className="drop-shadow-md transition-transform duration-300 hover:scale-105 rounded-full"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
      ) : (
        <svg
          viewBox="0 0 200 200"
          width={size}
          height={size}
          className="drop-shadow-md transition-transform duration-300 hover:scale-105"
          aria-label="Bangladesh Government Emblem"
        >
          <circle cx="100" cy="100" r="96" fill="#006A4E" stroke="#D4AF37" strokeWidth="5" />
          <circle cx="100" cy="100" r="50" fill="#D91C2B" />
        </svg>
      )}

      {showText && (
        <span className="mt-1 text-[11px] font-bold font-bengali text-[#006A4E] dark:text-[#34D399] tracking-tight text-center">
          গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
        </span>
      )}
    </div>
  );
};
