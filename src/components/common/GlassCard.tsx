import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  id,
  onClick,
  hoverEffect = false
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`
        bg-white/80 backdrop-blur-xl border border-white/90 rounded-[28px] p-6 
        shadow-[0_12px_36px_-12px_rgba(32,49,45,0.06)]
        transition-all duration-300
        ${hoverEffect ? 'hover:-translate-y-1 hover:shadow-[0_18px_45px_-12px_rgba(32,49,45,0.12)] cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const GlassPill: React.FC<{
  children: React.ReactNode;
  className?: string;
  id?: string;
  onClick?: () => void;
  active?: boolean;
}> = ({ children, className = '', id, onClick, active = false }) => {
  return (
    <button
      id={id}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold
        transition-all duration-200 border whitespace-nowrap
        ${active 
          ? 'bg-[#20312D] text-white border-[#20312D] shadow-sm' 
          : 'bg-white/70 text-[#20312D] border-white/80 hover:bg-white hover:border-[#56B89D]/40'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
};
