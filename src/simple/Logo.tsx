// Marca Kalisfy: la K es una persona (cabeza, brazo arriba a 45 grados y pierna dando el paso).
// Los archivos para anuncios y redes estan en public/marca/.

import React from 'react';

export const Isotipo: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <rect width="64" height="64" rx="15" fill="#0D0F0C" />
    <g transform="translate(32 32) scale(0.78) translate(-32 -32)">
      <circle cx="25" cy="13" r="6.3" fill="#F3F5EF" />
      
      <path d="M21 39L47.5 12.5" stroke="#C6F24E" strokeWidth="8.5" strokeLinecap="round" />
      <path d="M20 25.5V50" stroke="#C6F24E" strokeWidth="8.5" strokeLinecap="round" />
      <path d="M31 29L46 50" stroke="#C6F24E" strokeWidth="8.5" strokeLinecap="round" />
    </g>
  </svg>
);

export const Logo: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <div className="flex items-center justify-center gap-2">
    <Isotipo size={size} />
    <span className="font-extrabold" style={{ fontSize: size * 0.66, letterSpacing: '-0.035em' }}>
      Kalis<span className="text-[var(--k-accent)]">fy</span>
    </span>
  </div>
);
