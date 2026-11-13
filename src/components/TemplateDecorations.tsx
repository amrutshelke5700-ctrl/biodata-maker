import React from 'react';

export const RoyalGoldCorner: React.FC<{ position: 'tl' | 'tr' | 'bl' | 'br' }> = ({ position }) => {
  const rotateMap = {
    tl: '0deg',
    tr: '90deg',
    br: '180deg',
    bl: '270deg',
  };
  const posStyle: React.CSSProperties = {
    position: 'absolute',
    width: '64px',
    height: '64px',
    pointerEvents: 'none',
    transform: `rotate(${rotateMap[position]})`,
    ...(position.includes('t') ? { top: '18px' } : { bottom: '18px' }),
    ...(position.includes('l') ? { left: '18px' } : { right: '18px' }),
  };

  return (
    <svg viewBox="0 0 80 80" fill="none" style={posStyle} aria-hidden="true">
      <path d="M4 4 H44 C26 4 14 16 14 34 V76" stroke="#B8860B" strokeWidth="2" />
      <path d="M10 10 H36 C24 10 18 18 18 30 V58" stroke="#D4AF37" strokeWidth="1.2" />
      <circle cx="10" cy="10" r="3.5" fill="#7C2D12" stroke="#D4AF37" strokeWidth="1.2" />
      <path d="M22 4 C22 14 14 22 4 22" stroke="#B8860B" strokeWidth="1.4" />
      <circle cx="28" cy="10" r="1.8" fill="#B8860B" />
      <circle cx="10" cy="28" r="1.8" fill="#B8860B" />
    </svg>
  );
};

export const RoyalKalashEmblem: React.FC = () => (
  <svg viewBox="0 0 64 56" fill="none" style={{ width: '44px', height: '38px' }} aria-hidden="true">
    {/* Decorative aura arch */}
    <path d="M10 46 C10 24 54 24 54 46" stroke="#D4AF37" strokeWidth="1.2" strokeDasharray="3 3" />
    {/* Mango leaves */}
    <path d="M24 22 C18 14 22 8 28 16" fill="#0F5C53" stroke="#B8860B" strokeWidth="1" />
    <path d="M40 22 C46 14 42 8 36 16" fill="#0F5C53" stroke="#B8860B" strokeWidth="1" />
    <path d="M32 18 C28 8 36 8 32 18" fill="#15803D" stroke="#B8860B" strokeWidth="1" />
    {/* Coconut / Shree */}
    <circle cx="32" cy="19" r="6" fill="#9A3412" stroke="#D4AF37" strokeWidth="1.4" />
    {/* Kalash Neck */}
    <path d="M24 24 H40 L37 29 H27 Z" fill="#D4AF37" stroke="#7C2D12" strokeWidth="1.1" />
    {/* Kalash Pot */}
    <ellipse cx="32" cy="39" rx="13" ry="10.5" fill="#B8860B" stroke="#7C2D12" strokeWidth="1.4" />
    <path d="M22 39 C26 42 38 42 42 39" stroke="#FFFDF7" strokeWidth="1.2" />
    {/* Base */}
    <path d="M25 49 H39 L41 52 H23 Z" fill="#7C2D12" />
  </svg>
);

export const PaithaniBorderPattern: React.FC<{ side: 'top' | 'bottom' }> = ({ side }) => {
  const units = Array.from({ length: 14 });
  return (
    <div
      style={{
        position: 'absolute',
        left: '16px',
        right: '16px',
        height: '24px',
        ...(side === 'top' ? { top: '16px' } : { bottom: '16px' }),
        backgroundColor: '#8E1A50',
        borderTop: '2px solid #D4AF37',
        borderBottom: '2px solid #D4AF37',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 8px',
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {units.map((_, idx) => (
        <svg key={idx} viewBox="0 0 28 18" style={{ width: '28px', height: '16px', flexShrink: 0 }}>
          {/* Classic Paithani Zari Diamond + Lotus Motif */}
          <polygon points="14,1 24,9 14,17 4,9" fill="#0F5C53" stroke="#EAB308" strokeWidth="1.2" />
          <circle cx="14" cy="9" r="3" fill="#FDE047" />
          <circle cx="2" cy="9" r="1.4" fill="#FDE047" />
          <circle cx="26" cy="9" r="1.4" fill="#FDE047" />
        </svg>
      ))}
    </div>
  );
};

export const PaithaniSideStrip: React.FC<{ side: 'left' | 'right' }> = ({ side }) => (
  <div
    style={{
      position: 'absolute',
      top: '40px',
      bottom: '40px',
      width: '10px',
      ...(side === 'left' ? { left: '16px' } : { right: '16px' }),
      backgroundColor: '#0F5C53',
      borderLeft: '2px solid #D4AF37',
      borderRight: '2px solid #D4AF37',
    }}
    aria-hidden="true"
  />
);

export const OrnateCorner: React.FC<{
  position: 'tl' | 'tr' | 'bl' | 'br';
  primaryColor: string;
  accentColor: string;
}> = ({ position, primaryColor, accentColor }) => {
  const rotateMap = {
    tl: '0deg',
    tr: '90deg',
    br: '180deg',
    bl: '270deg',
  };
  const posStyle: React.CSSProperties = {
    position: 'absolute',
    width: '58px',
    height: '58px',
    pointerEvents: 'none',
    transform: `rotate(${rotateMap[position]})`,
    ...(position.includes('t') ? { top: '16px' } : { bottom: '16px' }),
    ...(position.includes('l') ? { left: '16px' } : { right: '16px' }),
  };

  return (
    <svg viewBox="0 0 80 80" fill="none" style={posStyle} aria-hidden="true">
      <path d="M4 4 H52 C32 4 16 18 16 38 V76" stroke={primaryColor} strokeWidth="2.2" />
      <path d="M12 12 H40 C26 12 20 20 20 34 V62" stroke={accentColor} strokeWidth="1.3" />
      <polygon points="12,5 17,12 12,19 7,12" fill={accentColor} />
      <circle cx="28" cy="12" r="2" fill={primaryColor} />
      <circle cx="12" cy="28" r="2" fill={primaryColor} />
    </svg>
  );
};

export const LotusCorner: React.FC<{
  position: 'tl' | 'tr' | 'bl' | 'br';
}> = ({ position }) => {
  const rotateMap = {
    tl: '0deg',
    tr: '90deg',
    br: '180deg',
    bl: '270deg',
  };
  const posStyle: React.CSSProperties = {
    position: 'absolute',
    width: '62px',
    height: '62px',
    pointerEvents: 'none',
    transform: `rotate(${rotateMap[position]})`,
    ...(position.includes('t') ? { top: '16px' } : { bottom: '16px' }),
    ...(position.includes('l') ? { left: '16px' } : { right: '16px' }),
  };

  return (
    <svg viewBox="0 0 80 80" fill="none" style={posStyle} aria-hidden="true">
      <path d="M6 6 C24 6 38 14 48 24 C34 22 22 34 24 48 C14 38 6 24 6 6 Z" fill="#FCE7F3" stroke="#BE185D" strokeWidth="1.6" />
      <path d="M10 10 C22 12 28 18 32 28 C20 24 12 20 10 10 Z" fill="#FBCFE8" stroke="#9D174D" strokeWidth="1.2" />
      <circle cx="12" cy="12" r="3" fill="#9D174D" />
      <circle cx="42" cy="12" r="2" fill="#DB2777" />
      <circle cx="12" cy="42" r="2" fill="#DB2777" />
    </svg>
  );
};

export const SaffronHeritageBand: React.FC<{ side: 'top' | 'bottom' }> = ({ side }) => {
  const scallops = Array.from({ length: 18 });
  return (
    <div
      style={{
        position: 'absolute',
        left: '16px',
        right: '16px',
        height: '16px',
        ...(side === 'top' ? { top: '16px' } : { bottom: '16px' }),
        backgroundColor: '#9A3412',
        borderTop: '1.5px solid #F59E0B',
        borderBottom: '1.5px solid #F59E0B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 10px',
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {scallops.map((_, idx) => (
        <span
          key={idx}
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '9999px',
            backgroundColor: '#FDE68A',
            border: '1px solid #D97706',
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
};
