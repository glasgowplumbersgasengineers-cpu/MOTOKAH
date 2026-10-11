import React, { forwardRef } from 'react';
import icon from '@/assets/motokah-icon-transparent.png';

const Cap = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      style={{
        width: '1200px',
        height: '800px',
        backgroundColor: '#0066CC',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          clipPath: 'polygon(5% 100%, 0% 20%, 15% 0%, 85% 0%, 100% 20%, 95% 100%)',
          backgroundColor: '#0066CC',
          border: '2px solid rgba(255, 255, 255, 0.2)',
        }}
      />

      <div
        className="absolute top-8 left-1/4 right-1/4 h-px"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, #ffffff 0px, #ffffff 8px, transparent 8px, transparent 16px)',
          opacity: 0.3,
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <img
          src={icon}
          alt="Motokah Logo"
          className="w-56 h-56 object-contain mb-6"
        />

        <h1
          className="text-5xl font-bold tracking-[0.25em] uppercase"
          style={{
            color: '#ffffff',
            textShadow: '2px 2px 0 rgba(0,0,0,0.3)',
          }}
        >
          MOTOKAH
        </h1>
      </div>

      <div
        className="absolute bottom-12 left-1/4 right-1/4 h-px"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, #ffffff 0px, #ffffff 8px, transparent 8px, transparent 16px)',
          opacity: 0.3,
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 3h1v1H1V3zm2-2h1v1H3V1z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
});

Cap.displayName = 'Cap';

export default Cap;
