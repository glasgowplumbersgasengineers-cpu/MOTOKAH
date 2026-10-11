import React, { forwardRef } from 'react';

// Official Stamp
const StampOfficial = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      className="flex items-center justify-center"
      style={{
        width: '450px',
        height: '450px',
        backgroundColor: '#ffffff',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle cx="100" cy="100" r="95" fill="none" stroke="#0066CC" strokeWidth="3" />
        <circle cx="100" cy="100" r="88" fill="none" stroke="#0066CC" strokeWidth="1" />

        <defs>
          <path id="topArc" d="M 25 100 A 75 75 0 0 1 175 100" fill="none" />
          <path id="bottomArc" d="M 175 100 A 75 75 0 0 1 25 100" fill="none" />
        </defs>

        <text fill="#0066CC" fontSize="11" fontWeight="600" letterSpacing="2">
          <textPath href="#topArc" startOffset="50%" textAnchor="middle">
            MOTOKAH AFRICA LIMITED
          </textPath>
        </text>

        <text fill="#0066CC" fontSize="10" fontWeight="500" letterSpacing="1.5">
          <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
            DAR ES SALAAM • TANZANIA
          </textPath>
        </text>

        <circle cx="100" cy="100" r="55" fill="none" stroke="#0066CC" strokeWidth="2" />
        <circle cx="100" cy="100" r="50" fill="none" stroke="#0066CC" strokeWidth="0.5" />

        <polygon
          points="100,55 135,75 135,115 100,135 65,115 65,75"
          fill="none"
          stroke="#0066CC"
          strokeWidth="2"
        />

        <text x="100" y="95" textAnchor="middle" fill="#0066CC" fontSize="12" fontWeight="700">
          OFFICIAL
        </text>
        <text x="100" y="110" textAnchor="middle" fill="#0066CC" fontSize="8" fontWeight="500">
          STAMP
        </text>

        <circle cx="25" cy="100" r="2" fill="#0066CC" />
        <circle cx="175" cy="100" r="2" fill="#0066CC" />
        <circle cx="100" cy="25" r="2" fill="#0066CC" />
        <circle cx="100" cy="175" r="2" fill="#0066CC" />
      </svg>
    </div>
  );
});

// Verified Stamp
const StampVerified = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      className="flex items-center justify-center"
      style={{
        width: '450px',
        height: '450px',
        backgroundColor: '#ffffff',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle cx="100" cy="100" r="95" fill="none" stroke="#28AF60" strokeWidth="3" />
        <circle cx="100" cy="100" r="88" fill="none" stroke="#28AF60" strokeWidth="1" />

        <defs>
          <path id="verifyTop" d="M 25 100 A 75 75 0 0 1 175 100" fill="none" />
          <path id="verifyBottom" d="M 175 100 A 75 75 0 0 1 25 100" fill="none" />
        </defs>

        <text fill="#28AF60" fontSize="11" fontWeight="600" letterSpacing="2">
          <textPath href="#verifyTop" startOffset="50%" textAnchor="middle">
            MOTOKAH AFRICA LIMITED
          </textPath>
        </text>

        <text fill="#28AF60" fontSize="10" fontWeight="500" letterSpacing="1.5">
          <textPath href="#verifyBottom" startOffset="50%" textAnchor="middle">
            VEHICLE VERIFIED
          </textPath>
        </text>

        <circle cx="100" cy="100" r="55" fill="none" stroke="#28AF60" strokeWidth="2" />

        <path
          d="M 70 100 L 90 120 L 130 75"
          fill="none"
          stroke="#28AF60"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <text x="100" y="145" textAnchor="middle" fill="#28AF60" fontSize="8" fontWeight="600">
          VERIFIED
        </text>

        <circle cx="25" cy="100" r="2" fill="#28AF60" />
        <circle cx="175" cy="100" r="2" fill="#28AF60" />
      </svg>
    </div>
  );
});

// Received Stamp
const StampReceived = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      className="flex items-center justify-center"
      style={{
        width: '400px',
        height: '180px',
        backgroundColor: '#ffffff',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <svg viewBox="0 0 200 90" className="w-full h-full">
        <rect x="5" y="5" width="190" height="80" rx="5" fill="none" stroke="#0066CC" strokeWidth="2" />
        <rect x="10" y="10" width="180" height="70" rx="3" fill="none" stroke="#0066CC" strokeWidth="1" />

        <text x="100" y="40" textAnchor="middle" fill="#0066CC" fontSize="18" fontWeight="700" letterSpacing="4">
          RECEIVED
        </text>

        <line x1="40" y1="60" x2="160" y2="60" stroke="#0066CC" strokeWidth="1" />
        <text x="100" y="75" textAnchor="middle" fill="#0066CC" fontSize="8" fontWeight="400">
          DATE
        </text>

        <text x="100" y="52" textAnchor="middle" fill="#0066CC" fontSize="6" fontWeight="500" letterSpacing="1">
          MOTOKAH AFRICA LIMITED
        </text>
      </svg>
    </div>
  );
});

StampOfficial.displayName = 'StampOfficial';
StampVerified.displayName = 'StampVerified';
StampReceived.displayName = 'StampReceived';

export { StampOfficial, StampVerified, StampReceived };
