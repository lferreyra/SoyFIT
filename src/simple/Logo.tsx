// Marca Kalisfy: una K que patea hacia arriba, con un punto que marca el movimiento.

import React from 'react';

export const Isotipo: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <rect width="64" height="64" rx="16" fill="#20312D" />
    <path d="M22 16v32M22 33l17-17M27 29l14 19" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <circle cx="45" cy="17" r="5" fill="#56B89D" />
  </svg>
);

export const Logo: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <div className="flex items-center justify-center gap-2">
    <Isotipo size={size} />
    <span className="font-extrabold tracking-tight" style={{ fontSize: size * 0.62 }}>
      Kalis<span className="text-[#56B89D]">fy</span>
    </span>
  </div>
);
