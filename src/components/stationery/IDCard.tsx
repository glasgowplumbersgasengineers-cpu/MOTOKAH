import React, { forwardRef } from 'react';
import { Phone, MapPin, User } from 'lucide-react';
import icon from '@/assets/motokah-icon-transparent.png';

const IDCardFront = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      style={{
        width: '1013px',
        height: '638px',
        backgroundColor: '#0066CC',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-3"
        style={{ backgroundColor: '#ffffff' }}
      />

      <div className="absolute top-6 left-0 right-0 flex justify-center items-center gap-4">
        <img
          src={icon}
          alt="Motokah Logo"
          className="w-12 h-12 object-contain"
        />
        <h1
          className="text-2xl font-bold tracking-[0.15em]"
          style={{ color: '#ffffff' }}
        >
          MOTOKAH
        </h1>
      </div>

      <div className="absolute top-24 left-6 right-6 bottom-6 flex gap-6">
        <div
          className="w-44 h-52 flex items-center justify-center border-2"
          style={{
            borderColor: 'rgba(255, 255, 255, 0.5)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }}
        >
          <User size={64} style={{ color: 'rgba(255, 255, 255, 0.3)' }} />
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-3">
            <div>
              <p className="text-xs uppercase tracking-wider" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Name
              </p>
              <p className="text-xl font-semibold" style={{ color: '#ffffff' }}>
                Umar Sheikh Shahid
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Designation
              </p>
              <p className="text-lg" style={{ color: '#ffffff' }}>
                Chairman &amp; Director
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Employee ID
              </p>
              <p className="text-base font-mono" style={{ color: '#ffffff' }}>
                MTK-2026-001
              </p>
            </div>
          </div>
        </div>
      </div>

      <svg className="absolute bottom-2 right-2 w-12 h-12 opacity-20" viewBox="0 0 100 100">
        <polygon points="50,5 93.3,27.5 93.3,72.5 50,95 6.7,72.5 6.7,27.5" fill="#ffffff"/>
      </svg>
    </div>
  );
});

const IDCardBack = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      style={{
        width: '1013px',
        height: '638px',
        backgroundColor: '#0066CC',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-3"
        style={{ backgroundColor: '#ffffff' }}
      />

      <div className="absolute top-8 right-8">
        <div
          className="w-32 h-32 flex items-center justify-center border-2"
          style={{
            borderColor: 'rgba(255, 255, 255, 0.5)',
            backgroundColor: '#ffffff',
          }}
        >
          <div className="text-center">
            <div className="grid grid-cols-4 gap-1 p-2">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className="w-5 h-5"
                  style={{ backgroundColor: i % 3 === 0 ? '#0066CC' : 'transparent' }}
                />
              ))}
            </div>
          </div>
        </div>
        <p className="text-xs text-center mt-2" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          Scan to verify
        </p>
      </div>

      <div className="absolute top-8 left-8 max-w-[550px]">
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: '#ffffff' }}
        >
          Motokah Africa Limited
        </h2>

        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <MapPin size={16} className="mt-1 flex-shrink-0" style={{ color: '#ffffff' }} />
            <p className="text-sm leading-relaxed" style={{ color: '#ffffff' }}>
              Plot No. 18, Kurasini Mji Mpya St, Mbagala Industrial Area<br />
              Temeke, Dar es Salaam, Tanzania
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Phone size={16} style={{ color: '#ffffff' }} />
            <p className="text-sm" style={{ color: '#ffffff' }}>
              +255 797 666 777
            </p>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-8 right-8 p-4 rounded"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
      >
        <p className="text-sm text-center" style={{ color: '#ffffff' }}>
          If found, please return to the above address or call the provided numbers.
        </p>
      </div>

      <img
        src={icon}
        alt=""
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 object-contain opacity-5"
      />
    </div>
  );
});

IDCardFront.displayName = 'IDCardFront';
IDCardBack.displayName = 'IDCardBack';

export { IDCardFront, IDCardBack };
