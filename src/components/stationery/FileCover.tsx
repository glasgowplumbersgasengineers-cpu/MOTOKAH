import React, { forwardRef } from 'react';
import { Phone, Globe, MapPin } from 'lucide-react';
import icon from '@/assets/motokah-icon-transparent.png';

const FileCover = forwardRef<HTMLDivElement>((_, ref) => {
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
      <div
        className="absolute inset-12 border-4"
        style={{ borderColor: '#ffffff' }}
      />
      <div
        className="absolute inset-20 border-2"
        style={{ borderColor: 'rgba(255, 255, 255, 0.4)' }}
      />

      <svg className="absolute top-16 left-16 w-48 h-48" viewBox="0 0 100 100">
        <path d="M0 0 L40 0 L40 8 L8 8 L8 40 L0 40 Z" fill="#ffffff" opacity="0.6"/>
        <path d="M15 15 L35 15 L35 20 L20 20 L20 35 L15 35 Z" fill="#ffffff" opacity="0.3"/>
      </svg>
      <svg className="absolute top-16 right-16 w-48 h-48 rotate-90" viewBox="0 0 100 100">
        <path d="M0 0 L40 0 L40 8 L8 8 L8 40 L0 40 Z" fill="#ffffff" opacity="0.6"/>
        <path d="M15 15 L35 15 L35 20 L20 20 L20 35 L15 35 Z" fill="#ffffff" opacity="0.3"/>
      </svg>
      <svg className="absolute bottom-16 left-16 w-48 h-48 -rotate-90" viewBox="0 0 100 100">
        <path d="M0 0 L40 0 L40 8 L8 8 L8 40 L0 40 Z" fill="#ffffff" opacity="0.6"/>
        <path d="M15 15 L35 15 L35 20 L20 20 L20 35 L15 35 Z" fill="#ffffff" opacity="0.3"/>
      </svg>
      <svg className="absolute bottom-16 right-16 w-48 h-48 rotate-180" viewBox="0 0 100 100">
        <path d="M0 0 L40 0 L40 8 L8 8 L8 40 L0 40 Z" fill="#ffffff" opacity="0.6"/>
        <path d="M15 15 L35 15 L35 20 L20 20 L20 35 L15 35 Z" fill="#ffffff" opacity="0.3"/>
      </svg>

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
          className="text-3xl tracking-[0.3em] uppercase mb-16"
          style={{ color: '#ffffff' }}
        >
          One Platform. All Cars.
        </p>

        <div
          className="px-16 py-6 border-2"
          style={{ borderColor: '#ffffff' }}
        >
          <p
            className="text-4xl tracking-[0.3em] uppercase"
            style={{ color: '#ffffff' }}
          >
            Vehicle Documents
          </p>
        </div>
      </div>

      <div className="absolute bottom-32 left-0 right-0 flex justify-center gap-12">
        <div className="flex items-center gap-3">
          <Phone size={24} style={{ color: '#ffffff' }} />
          <span className="text-xl" style={{ color: '#ffffff' }}>
            +255 797 666 777
          </span>
        </div>
        <div className="w-px h-8 bg-white/30" />
        <div className="flex items-center gap-3">
          <Globe size={24} style={{ color: '#ffffff' }} />
          <span className="text-xl" style={{ color: '#ffffff' }}>
            www.motokah.com
          </span>
        </div>
        <div className="w-px h-8 bg-white/30" />
        <div className="flex items-center gap-3">
          <MapPin size={24} style={{ color: '#ffffff' }} />
          <span className="text-xl" style={{ color: '#ffffff' }}>
            Dar es Salaam, Tanzania
          </span>
        </div>
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

FileCover.displayName = 'FileCover';

export default FileCover;
