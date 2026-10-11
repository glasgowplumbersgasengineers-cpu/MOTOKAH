import React, { forwardRef } from 'react';
import icon from '@/assets/motokah-icon-transparent.png';

const BusinessCardFront = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      style={{
        width: '1050px',
        height: '600px',
        backgroundColor: '#0066CC',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Geometric Pattern Border */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 right-0 h-6"
          style={{
            background: 'repeating-linear-gradient(90deg, #ffffff 0px, #ffffff 2px, transparent 2px, transparent 20px)',
            opacity: 0.3,
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-6"
          style={{
            background: 'repeating-linear-gradient(90deg, #ffffff 0px, #ffffff 2px, transparent 2px, transparent 20px)',
            opacity: 0.3,
          }}
        />
        <svg className="absolute top-4 left-4 w-16 h-16 opacity-20" viewBox="0 0 100 100">
          <path d="M0 0 L50 0 L50 10 L10 10 L10 50 L0 50 Z" fill="#ffffff" />
        </svg>
        <svg className="absolute top-4 right-4 w-16 h-16 opacity-20" viewBox="0 0 100 100">
          <path d="M100 0 L50 0 L50 10 L90 10 L90 50 L100 50 Z" fill="#ffffff" />
        </svg>
        <svg className="absolute bottom-4 left-4 w-16 h-16 opacity-20" viewBox="0 0 100 100">
          <path d="M0 100 L50 100 L50 90 L10 90 L10 50 L0 50 Z" fill="#ffffff" />
        </svg>
        <svg className="absolute bottom-4 right-4 w-16 h-16 opacity-20" viewBox="0 0 100 100">
          <path d="M100 100 L50 100 L50 90 L90 90 L90 50 L100 50 Z" fill="#ffffff" />
        </svg>
      </div>

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <img
          src={icon}
          alt="Motokah Logo"
          className="w-48 h-48 object-contain mb-6"
        />

        <h1
          className="text-5xl font-bold tracking-[0.3em] uppercase"
          style={{ color: '#ffffff' }}
        >
          MOTOKAH
        </h1>

        <p
          className="mt-3 text-lg tracking-[0.2em] uppercase"
          style={{ color: '#ffffff', opacity: 0.7 }}
        >
          One Platform. All Cars.
        </p>
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)',
        }}
      />
    </div>
  );
});

BusinessCardFront.displayName = 'BusinessCardFront';

export default BusinessCardFront;
