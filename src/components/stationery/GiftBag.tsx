import React, { forwardRef } from 'react';
import icon from '@/assets/motokah-icon-transparent.png';

const GiftBagSmall = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      style={{
        width: '2400px',
        height: '3000px',
        backgroundColor: '#0066CC',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div className="absolute top-0 left-1/3 right-1/3 h-16 flex justify-center gap-32">
        <div className="w-32 h-full rounded-b-full border-4 border-t-0" style={{ borderColor: 'rgba(255, 255, 255, 0.4)' }} />
        <div className="w-32 h-full rounded-b-full border-4 border-t-0" style={{ borderColor: 'rgba(255, 255, 255, 0.4)' }} />
      </div>

      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231A8CFF' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div
        className="absolute inset-8 border-2"
        style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <img
          src={icon}
          alt="Motokah Logo"
          className="w-72 h-72 object-contain mb-8"
        />

        <h1
          className="text-6xl font-bold tracking-[0.3em] uppercase mb-4"
          style={{ color: '#ffffff' }}
        >
          MOTOKAH
        </h1>

        <div
          className="w-40 h-1 mb-4"
          style={{ backgroundColor: '#ffffff' }}
        />

        <p
          className="text-2xl tracking-[0.2em] uppercase"
          style={{ color: '#ffffff' }}
        >
          One Platform. All Cars.
        </p>
      </div>

      <div className="absolute bottom-16 left-0 right-0 text-center">
        <p
          className="text-xl tracking-widest"
          style={{ color: '#ffffff' }}
        >
          www.motokah.com
        </p>
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)',
        }}
      />
    </div>
  );
});

const GiftBagMedium = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      style={{
        width: '3600px',
        height: '4500px',
        backgroundColor: '#0066CC',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div className="absolute top-0 left-1/3 right-1/3 h-24 flex justify-center gap-48">
        <div className="w-48 h-full rounded-b-full border-4 border-t-0" style={{ borderColor: 'rgba(255, 255, 255, 0.4)' }} />
        <div className="w-48 h-full rounded-b-full border-4 border-t-0" style={{ borderColor: 'rgba(255, 255, 255, 0.4)' }} />
      </div>

      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231A8CFF' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div
        className="absolute inset-12 border-2"
        style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <img
          src={icon}
          alt="Motokah Logo"
          className="w-[450px] h-[450px] object-contain mb-12"
        />

        <h1
          className="text-8xl font-bold tracking-[0.35em] uppercase mb-6"
          style={{ color: '#ffffff' }}
        >
          MOTOKAH
        </h1>

        <div
          className="w-64 h-1.5 mb-6"
          style={{ backgroundColor: '#ffffff' }}
        />

        <p
          className="text-4xl tracking-[0.25em] uppercase"
          style={{ color: '#ffffff' }}
        >
          One Platform. All Cars.
        </p>
      </div>

      <div className="absolute bottom-24 left-0 right-0 text-center">
        <p
          className="text-3xl tracking-widest"
          style={{ color: '#ffffff' }}
        >
          www.motokah.com
        </p>
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)',
        }}
      />
    </div>
  );
});

GiftBagSmall.displayName = 'GiftBagSmall';
GiftBagMedium.displayName = 'GiftBagMedium';

export { GiftBagSmall, GiftBagMedium };
