import React, { forwardRef } from 'react';
import { Phone, Mail, Globe, MapPin } from 'lucide-react';
import icon from '@/assets/motokah-icon-transparent.png';

const BusinessCardBack = forwardRef<HTMLDivElement>((_, ref) => {
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
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231A8CFF' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <img
        src={icon}
        alt=""
        className="absolute bottom-4 right-4 w-20 h-20 object-contain opacity-20"
      />

      <div
        className="absolute left-12 top-1/2 -translate-y-1/2 w-1 h-3/4"
        style={{ backgroundColor: '#ffffff' }}
      />

      <div className="absolute left-20 top-1/2 -translate-y-1/2">
        <h2
          className="text-3xl font-bold mb-2"
          style={{ color: '#ffffff' }}
        >
          Umar Sheikh Shahid
        </h2>

        <p
          className="text-xl mb-8 tracking-wide"
          style={{ color: 'rgba(255, 255, 255, 0.7)' }}
        >
          Chairman &amp; Director
        </p>

        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <Phone size={20} style={{ color: '#ffffff' }} />
            <span className="text-lg" style={{ color: '#ffffff' }}>
              +255 797 666 777
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Mail size={20} style={{ color: '#ffffff' }} />
            <span className="text-lg" style={{ color: '#ffffff' }}>
              umar@motokah.com
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Globe size={20} style={{ color: '#ffffff' }} />
            <span className="text-lg" style={{ color: '#ffffff' }}>
              www.motokah.com
            </span>
          </div>

          <div className="flex items-start gap-4">
            <MapPin size={20} className="mt-1 flex-shrink-0" style={{ color: '#ffffff' }} />
            <span className="text-base leading-relaxed" style={{ color: '#ffffff' }}>
              Plot No. 18, Kurasini Mji Mpya St, Mbagala Industrial Area<br />
              Temeke, Dar es Salaam, Tanzania
            </span>
          </div>
        </div>
      </div>

      <svg className="absolute top-4 right-4 w-12 h-12 opacity-30" viewBox="0 0 100 100">
        <path d="M100 0 L50 0 L50 10 L90 10 L90 50 L100 50 Z" fill="#ffffff" />
      </svg>
      <svg className="absolute bottom-4 left-4 w-12 h-12 opacity-30" viewBox="0 0 100 100">
        <path d="M0 100 L50 100 L50 90 L10 90 L10 50 L0 50 Z" fill="#ffffff" />
      </svg>
    </div>
  );
});

BusinessCardBack.displayName = 'BusinessCardBack';

export default BusinessCardBack;
