import React, { forwardRef } from 'react';
import icon from '@/assets/motokah-icon-transparent.png';

const Folder = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      style={{
        width: '2480px',
        height: '3508px',
        backgroundColor: '#0066CC',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div className="absolute inset-8 pointer-events-none">
        <div
          className="absolute inset-0 border-2"
          style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
        />

        <div
          className="absolute inset-12 border"
          style={{ borderColor: 'rgba(255, 255, 255, 0.15)' }}
        />

        <svg className="absolute -top-4 -left-4 w-48 h-48" viewBox="0 0 100 100">
          <path d="M10 0 L10 40 L0 40 L0 10 L0 0 L10 0 M0 10 L40 10 L40 0" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.5"/>
          <path d="M5 20 L5 30 L15 30" stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.3"/>
        </svg>
        <svg className="absolute -top-4 -right-4 w-48 h-48 rotate-90" viewBox="0 0 100 100">
          <path d="M10 0 L10 40 L0 40 L0 10 L0 0 L10 0 M0 10 L40 10 L40 0" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.5"/>
          <path d="M5 20 L5 30 L15 30" stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.3"/>
        </svg>
        <svg className="absolute -bottom-4 -left-4 w-48 h-48 -rotate-90" viewBox="0 0 100 100">
          <path d="M10 0 L10 40 L0 40 L0 10 L0 0 L10 0 M0 10 L40 10 L40 0" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.5"/>
          <path d="M5 20 L5 30 L15 30" stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.3"/>
        </svg>
        <svg className="absolute -bottom-4 -right-4 w-48 h-48 rotate-180" viewBox="0 0 100 100">
          <path d="M10 0 L10 40 L0 40 L0 10 L0 0 L10 0 M0 10 L40 10 L40 0" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.5"/>
          <path d="M5 20 L5 30 L15 30" stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.3"/>
        </svg>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <img
          src={icon}
          alt="Motokah Logo"
          className="w-96 h-96 object-contain mb-12"
        />

        <h1
          className="text-8xl font-bold tracking-[0.4em] uppercase mb-6"
          style={{ color: '#ffffff' }}
        >
          MOTOKAH
        </h1>

        <div
          className="w-64 h-1 mb-6"
          style={{ backgroundColor: '#ffffff' }}
        />

        <p
          className="text-4xl tracking-[0.3em] uppercase"
          style={{ color: 'rgba(255, 255, 255, 0.7)' }}
        >
          One Platform. All Cars.
        </p>

        <p
          className="text-2xl tracking-[0.2em] uppercase mt-8"
          style={{ color: 'rgba(255, 255, 255, 0.5)' }}
        >
          East Africa's Car Marketplace
        </p>
      </div>

      <div className="absolute bottom-24 left-0 right-0 flex justify-center">
        <p
          className="text-xl tracking-widest"
          style={{ color: 'rgba(255, 255, 255, 0.4)' }}
        >
          www.motokah.com
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

Folder.displayName = 'Folder';

export default Folder;
