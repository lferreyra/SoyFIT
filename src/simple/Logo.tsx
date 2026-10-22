// Marca Kalisfy (diseno de Lucas, 2026-10-20): la K de Outfit 700 con el palo cortado y un
// punto lima como cabeza, "alis" en blanco y "fy" en lima. Todo en vector en public/marca/
// (logos completos, iconos y PNG para anuncios y redes); el favicon es kalisfy-icono-oscuro.

import React from 'react';

export const Isotipo: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <img src="/marca/kalisfy-icono-oscuro.svg" width={size} height={size} alt="" aria-hidden="true" />
);

export const Logo: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <div className="flex items-center justify-center">
    <img src="/marca/kalisfy-logo-transparente.svg" alt="Kalisfy" style={{ height: size * 1.15, width: 'auto', filter: 'drop-shadow(0 1px 6px rgba(0,0,0,0.45))' }} />
  </div>
);

// Cargador: la K suelta, sin recuadro (pedido de Lucas, 2026-10-21), con el punto lima latiendo (la animacion k-punto vive
// en index.html, junto a la pantalla de carga que se ve antes de que baje la app).
export const Cargador: React.FC<{ size?: number; texto?: string }> = ({ size = 168, texto }) => (
  <div role="status" aria-label={texto ?? 'Cargando'} className="flex flex-col items-center gap-4">
    <svg width={size} height={size} viewBox="-274 -983 1261 1261" aria-hidden="true">
      <g transform="scale(1 -1)">
        <clipPath id="kc-cargador"><path d="M-2000 -2000H4000V4000H-2000Z M17.5 1206.0 H227.9 V387.7 H17.5 Z" clipRule="evenodd" /></clipPath>
        <g clipPath="url(#kc-cargador)"><path fill="#F3F5EF" d="M495 0 208.5 368 485.5 706H679.5L367.5 339V402.5L690 0ZM67.5 0V706H225V0Z" /></g>
        <circle className="k-punto" cx="136" cy="615" r="118" fill="#CBFF4B" />
      </g>
    </svg>
    {texto && <p className="text-sm text-[var(--k-muted)]">{texto}</p>}
  </div>
);
