import React, { forwardRef } from 'react';
import icon from '@/assets/motokah-icon-transparent.png';

const Diary = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      style={{
        width: '1748px',
        height: '2480px',
        backgroundColor: '#0066CC',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-8"
        style={{ backgroundColor: '#ffffff' }}
      />

      <div
        className="absolute inset-12 border-2"
        style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
      />
      <div
        className="absolute inset-16 border"
        style={{ borderColor: 'rgba(255, 255, 255, 0.15)' }}
      />

      <svg className="absolute top-20 left-20 w-32 h-32" viewBox="0 0 100 100">
        <path d="M0 0 L30 0 L30 5 L5 5 L5 30 L0 30 Z" fill="#ffffff" opacity="0.5"/>
        <path d="M10 10 L25 10 L25 15 L15 15 L15 25 L10 25 Z" fill="#ffffff" opacity="0.3"/>
      </svg>
      <svg className="absolute top-20 right-12 w-32 h-32 rotate-90" viewBox="0 0 100 100">
        <path d="M0 0 L30 0 L30 5 L5 5 L5 30 L0 30 Z" fill="#ffffff" opacity="0.5"/>
        <path d="M10 10 L25 10 L25 15 L15 15 L15 25 L10 25 Z" fill="#ffffff" opacity="0.3"/>
      </svg>
      <svg className="absolute bottom-12 left-20 w-32 h-32 -rotate-90" viewBox="0 0 100 100">
        <path d="M0 0 L30 0 L30 5 L5 5 L5 30 L0 30 Z" fill="#ffffff" opacity="0.5"/>
        <path d="M10 10 L25 10 L25 15 L15 15 L15 25 L10 25 Z" fill="#ffffff" opacity="0.3"/>
      </svg>
      <svg className="absolute bottom-12 right-12 w-32 h-32 rotate-180" viewBox="0 0 100 100">
        <path d="M0 0 L30 0 L30 5 L5 5 L5 30 L0 30 Z" fill="#ffffff" opacity="0.5"/>
        <path d="M10 10 L25 10 L25 15 L15 15 L15 25 L10 25 Z" fill="#ffffff" opacity="0.3"/>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <img
          src={icon}
          alt="Motokah Logo"
          className="w-80 h-80 object-contain mb-12"
        />

        <h1
          className="text-7xl font-bold tracking-[0.4em] uppercase mb-6"
          style={{ color: '#ffffff' }}
        >
          MOTOKAH
        </h1>

        <div
          className="w-48 h-1 mb-6"
          style={{ backgroundColor: '#ffffff' }}
        />

        <p
          className="text-3xl tracking-[0.25em] uppercase"
          style={{ color: '#ffffff' }}
        >
          One Platform. All Cars.
        </p>
      </div>

      <div className="absolute bottom-24 left-0 right-0 text-center">
        <p
          className="text-6xl font-light tracking-[0.5em]"
          style={{ color: 'rgba(255, 255, 255, 0.4)' }}
        >
          2026
        </p>
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.4) 100%)',
        }}
      />
    </div>
  );
});

Diary.displayName = 'Diary';

export default Diary;
