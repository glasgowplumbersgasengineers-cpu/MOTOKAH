import React, { forwardRef } from 'react';
import { Phone, Mail, Globe, MapPin } from 'lucide-react';
import icon from '@/assets/motokah-icon-transparent.png';

const Letterhead = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      className="relative"
      style={{
        width: '2480px',
        height: '3508px',
        backgroundColor: '#fefefe',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-80 flex items-center justify-between px-24"
        style={{ backgroundColor: '#0066CC' }}
      >
        <div className="flex items-center gap-8">
          <img
            src={icon}
            alt="Motokah Logo"
            className="w-44 h-44 object-contain"
          />
          <div>
            <h1
              className="text-6xl font-bold tracking-[0.2em]"
              style={{ color: '#ffffff' }}
            >
              MOTOKAH
            </h1>
            <p
              className="text-2xl tracking-[0.15em] mt-2"
              style={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              One Platform. All Cars.
            </p>
          </div>
        </div>

        <div className="text-right space-y-2">
          <p className="text-xl" style={{ color: '#ffffff' }}>
            +255 797 666 777
          </p>
          <p className="text-xl" style={{ color: '#ffffff' }}>
            www.motokah.com
          </p>
        </div>
      </div>

      <div
        className="absolute top-80 left-0 right-0 h-3"
        style={{ backgroundColor: '#ffffff' }}
      />

      <svg className="absolute top-96 left-12 w-32 h-32 opacity-10" viewBox="0 0 100 100">
        <polygon points="50,5 93.3,27.5 93.3,72.5 50,95 6.7,72.5 6.7,27.5" fill="#0066CC"/>
      </svg>
      <svg className="absolute top-96 right-12 w-32 h-32 opacity-10" viewBox="0 0 100 100">
        <polygon points="50,5 93.3,27.5 93.3,72.5 50,95 6.7,72.5 6.7,27.5" fill="#0066CC"/>
      </svg>

      <div
        className="absolute top-[450px] left-24 right-24 bottom-[350px]"
        style={{
          borderLeft: '3px solid rgba(0, 102, 204, 0.15)',
          paddingLeft: '40px',
        }}
      >
        <div className="space-y-8 opacity-20">
          <div className="h-6 bg-gray-300 rounded w-1/3" />
          <div className="h-6 bg-gray-300 rounded w-full" />
          <div className="h-6 bg-gray-300 rounded w-full" />
          <div className="h-6 bg-gray-300 rounded w-4/5" />
          <div className="h-6 bg-gray-300 rounded w-full mt-12" />
          <div className="h-6 bg-gray-300 rounded w-full" />
          <div className="h-6 bg-gray-300 rounded w-3/4" />
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-64"
        style={{ backgroundColor: '#0066CC' }}
      >
        <div
          className="absolute -top-3 left-0 right-0 h-3"
          style={{ backgroundColor: '#ffffff' }}
        />

        <div className="h-full flex items-center justify-between px-24">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <Phone size={24} style={{ color: '#ffffff' }} />
              <span className="text-xl" style={{ color: '#ffffff' }}>
                +255 797 666 777
              </span>
            </div>
            <div className="w-px h-8 bg-white/30" />
            <div className="flex items-center gap-3">
              <Mail size={24} style={{ color: '#ffffff' }} />
              <span className="text-xl" style={{ color: '#ffffff' }}>
                info@motokah.com
              </span>
            </div>
            <div className="w-px h-8 bg-white/30" />
            <div className="flex items-center gap-3">
              <Globe size={24} style={{ color: '#ffffff' }} />
              <span className="text-xl" style={{ color: '#ffffff' }}>
                www.motokah.com
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin size={24} style={{ color: '#ffffff' }} />
            <span className="text-lg" style={{ color: '#ffffff' }}>
              Plot No. 18, Kurasini Mji Mpya St, Mbagala, Temeke, Dar es Salaam
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

Letterhead.displayName = 'Letterhead';

export default Letterhead;
