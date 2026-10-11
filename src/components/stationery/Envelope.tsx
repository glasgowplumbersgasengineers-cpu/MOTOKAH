import React, { forwardRef } from 'react';
import { Phone, Globe, MapPin } from 'lucide-react';
import icon from '@/assets/motokah-icon-transparent.png';

const Envelope = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      style={{
        width: '2598px',
        height: '1299px',
        backgroundColor: '#0066CC',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-[900px] flex flex-col justify-center pl-16"
        style={{ borderRight: '3px solid rgba(255, 255, 255, 0.3)' }}
      >
        <img
          src={icon}
          alt="Motokah Logo"
          className="w-36 h-36 object-contain mb-6"
        />

        <h1
          className="text-4xl font-bold tracking-[0.2em] mb-3"
          style={{ color: '#ffffff' }}
        >
          MOTOKAH
        </h1>

        <div className="space-y-3 mt-6">
          <div className="flex items-center gap-3">
            <MapPin size={20} style={{ color: '#ffffff' }} />
            <span className="text-lg" style={{ color: '#ffffff' }}>
              Plot No. 18, Kurasini Mji Mpya St
            </span>
          </div>
          <p className="text-lg ml-8" style={{ color: '#ffffff' }}>
            Mbagala Industrial Area, Temeke
          </p>
          <p className="text-lg ml-8" style={{ color: '#ffffff' }}>
            Dar es Salaam, Tanzania
          </p>
          <p className="text-lg ml-8" style={{ color: '#ffffff' }}>
            P.O. Box 12662
          </p>
        </div>

        <div className="flex items-center gap-4 mt-6">
          <Phone size={18} style={{ color: '#ffffff' }} />
          <span className="text-base" style={{ color: '#ffffff' }}>
            +255 797 666 777
          </span>
          <Globe size={18} style={{ color: '#ffffff' }} />
          <span className="text-base" style={{ color: '#ffffff' }}>
            www.motokah.com
          </span>
        </div>
      </div>

      <div className="absolute right-0 top-0 bottom-0 left-[900px] flex items-center justify-center">
        <div className="w-2/3 space-y-4 opacity-30">
          <div className="h-1 bg-white rounded w-3/4" />
          <div className="h-1 bg-white rounded w-full" />
          <div className="h-1 bg-white rounded w-full" />
          <div className="h-1 bg-white rounded w-1/2" />
        </div>
      </div>

      <div
        className="absolute top-12 right-12 w-40 h-48 border-2 border-dashed flex items-center justify-center"
        style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
      >
        <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
          STAMP
        </span>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-4"
        style={{ backgroundColor: '#ffffff' }}
      />

      <svg className="absolute top-6 left-6 w-16 h-16 opacity-20" viewBox="0 0 100 100">
        <path d="M0 0 L40 0 L40 8 L8 8 L8 40 L0 40 Z" fill="#ffffff" />
      </svg>
      <svg className="absolute bottom-10 right-6 w-16 h-16 opacity-20" viewBox="0 0 100 100">
        <path d="M100 100 L60 100 L60 92 L92 92 L92 60 L100 60 Z" fill="#ffffff" />
      </svg>
    </div>
  );
});

Envelope.displayName = 'Envelope';

export default Envelope;
