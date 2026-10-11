import React, { forwardRef } from 'react';
import { Phone, Mail, Globe, MapPin } from 'lucide-react';
import icon from '@/assets/motokah-icon-transparent.png';

const ComplimentSlip = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      style={{
        width: '2480px',
        height: '1169px',
        backgroundColor: '#fefefe',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-6"
        style={{ backgroundColor: '#0066CC' }}
      />
      <div
        className="absolute top-6 left-0 right-0 h-2"
        style={{ backgroundColor: '#ffffff' }}
      />

      <div className="absolute top-16 left-16 flex items-center gap-6">
        <img
          src={icon}
          alt="Motokah Logo"
          className="w-28 h-28 object-contain"
        />
        <div>
          <h1
            className="text-4xl font-bold tracking-[0.15em]"
            style={{ color: '#0066CC' }}
          >
            MOTOKAH
          </h1>
          <p
            className="text-lg tracking-wider mt-1"
            style={{ color: 'rgba(0, 102, 204, 0.65)' }}
          >
            One Platform. All Cars.
          </p>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <p
          className="text-5xl italic font-light"
          style={{ color: '#0066CC' }}
        >
          With Compliments
        </p>
        <div
          className="w-48 h-0.5 mx-auto mt-4"
          style={{ backgroundColor: '#ffffff' }}
        />
      </div>

      <img
        src={icon}
        alt=""
        className="absolute right-12 top-1/2 -translate-y-1/2 w-64 h-64 object-contain opacity-5"
      />

      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{ backgroundColor: '#0066CC' }}
      >
        <div
          className="absolute -top-2 left-0 right-0 h-2"
          style={{ backgroundColor: '#ffffff' }}
        />

        <div className="h-full flex items-center justify-center gap-12 px-16">
          <div className="flex items-center gap-3">
            <Phone size={20} style={{ color: '#ffffff' }} />
            <span className="text-lg" style={{ color: '#ffffff' }}>
              +255 797 666 777
            </span>
          </div>
          <div className="w-px h-6 bg-white/30" />
          <div className="flex items-center gap-3">
            <Mail size={20} style={{ color: '#ffffff' }} />
            <span className="text-lg" style={{ color: '#ffffff' }}>
              info@motokah.com
            </span>
          </div>
          <div className="w-px h-6 bg-white/30" />
          <div className="flex items-center gap-3">
            <Globe size={20} style={{ color: '#ffffff' }} />
            <span className="text-lg" style={{ color: '#ffffff' }}>
              www.motokah.com
            </span>
          </div>
          <div className="w-px h-6 bg-white/30" />
          <div className="flex items-center gap-3">
            <MapPin size={20} style={{ color: '#ffffff' }} />
            <span className="text-lg" style={{ color: '#ffffff' }}>
              Mbagala Industrial Area, Temeke, Dar es Salaam
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

ComplimentSlip.displayName = 'ComplimentSlip';

export default ComplimentSlip;
