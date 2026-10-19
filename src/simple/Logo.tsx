// Marca Kalisfy: la K es una persona (cabeza, brazo arriba y pierna abierta, simetricos a 45 grados).
// Los archivos para anuncios y redes estan en public/marca/.

import React from 'react';

export const Isotipo: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <rect width="64" height="64" rx="15" fill="#0D0F0C" />
    <g transform="translate(32 32) scale(0.8) translate(-32 -32)">
      <circle cx="19.5" cy="20.5" r="6" fill="#F3F5EF" />
      {/* palo, brazo y pierna nacen del mismo punto; brazo y pierna son espejo */}
      <path d="M25 32V51.8" stroke="#C6F24E" strokeWidth="8.5" strokeLinecap="round" />
      <path d="M25 32L44.8 12.2" stroke="#C6F24E" strokeWidth="8.5" strokeLinecap="round" />
      <path d="M25 32L44.8 51.8" stroke="#C6F24E" strokeWidth="8.5" strokeLinecap="round" />
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
