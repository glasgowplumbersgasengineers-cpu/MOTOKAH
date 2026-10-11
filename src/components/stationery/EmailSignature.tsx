import React, { forwardRef } from 'react';
import { Phone, Mail, Globe, MapPin } from 'lucide-react';
import icon from '@/assets/motokah-icon-transparent.png';

const EmailSignature = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      className="overflow-hidden"
      style={{
        width: '600px',
        height: '200px',
        backgroundColor: '#ffffff',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div className="flex h-full">
        <div
          className="w-48 h-full flex items-center justify-center"
          style={{ backgroundColor: '#0066CC' }}
        >
          <img
            src={icon}
            alt="Motokah Logo"
            className="w-28 h-28 object-contain"
          />
        </div>

        <div
          className="w-1 h-full"
          style={{ backgroundColor: '#0066CC' }}
        />

        <div className="flex-1 p-5 flex flex-col justify-center">
          <div className="mb-3">
            <h2
              className="text-xl font-bold"
              style={{ color: '#0066CC' }}
            >
              Umar Sheikh Shahid
            </h2>
            <p
              className="text-sm font-medium"
              style={{ color: '#0066CC' }}
            >
              Chairman &amp; Director, Motokah
            </p>
          </div>

          <div
            className="w-24 h-0.5 mb-3"
            style={{ backgroundColor: '#0066CC' }}
          />

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Phone size={14} style={{ color: '#0066CC' }} />
              <span className="text-xs" style={{ color: '#0066CC' }}>
                +255 797 666 777
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} style={{ color: '#0066CC' }} />
              <span className="text-xs" style={{ color: '#0066CC' }}>
                umar@motokah.com
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Globe size={14} style={{ color: '#0066CC' }} />
              <span className="text-xs" style={{ color: '#0066CC', fontWeight: 600 }}>
                www.motokah.com
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} style={{ color: '#0066CC' }} />
              <span className="text-xs" style={{ color: '#0066CC' }}>
                Mbagala Industrial Area, Dar es Salaam
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

EmailSignature.displayName = 'EmailSignature';

export default EmailSignature;
