// Foto de fondo con degrade hacia el color de la app, para que el texto se lea encima.

import React from 'react';
import { getAssetUrl } from '../utils/assets';

export const Portada: React.FC<{ foto: string; className?: string; children?: React.ReactNode }> = ({ foto, className = '', children }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <img src={getAssetUrl(foto)} alt="" className="absolute inset-0 w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-[var(--k-bg)] via-[var(--k-bg)]/60 to-[var(--k-bg)]/10" />
    {/* Sombra a 45 grados desde arriba a la izquierda, para que el logo se despegue de las fotos claras (pedido de Lucas). */}
    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 18%, rgba(0,0,0,0) 45%)' }} />
    <div className="relative h-full">{children}</div>
  </div>
);
