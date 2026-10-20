// Marca Kalisfy (diseno de Lucas, 2026-10-20): la K de Outfit 700 con el palo cortado y un
// punto lima como cabeza, "alis" en blanco y "fy" en lima. Todo en vector en public/marca/
// (logos completos, iconos y PNG para anuncios y redes); el favicon es kalisfy-icono-oscuro.

import React from 'react';

export const Isotipo: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <img src="/marca/kalisfy-icono-oscuro.svg" width={size} height={size} alt="" aria-hidden="true" />
);

export const Logo: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <div className="flex items-center justify-center">
    <img src="/marca/kalisfy-logo-transparente.svg" alt="Kalisfy" style={{ height: size * 1.15, width: 'auto' }} />
  </div>
);
