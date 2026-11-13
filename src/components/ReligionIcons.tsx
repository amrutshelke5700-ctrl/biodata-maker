import React from 'react';
import { ReligionType } from '../types/biodata';

interface ReligionEmblemProps {
  religion: ReligionType;
  color?: string;
  size?: number;
}

export const ReligionEmblem: React.FC<ReligionEmblemProps> = ({
  religion,
  color = '#7C2D12',
  size = 34,
}) => {
  switch (religion) {
    case 'hindu':
      // Stylized Ganesh Emblem
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          aria-hidden="true"
        >
          {/* Crown / Mukut */}
          <path
            d="M17 13L24 5L31 13H17Z"
            stroke={color}
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <circle cx="24" cy="9.5" r="1.4" fill={color} />
          {/* Ears */}
          <path
            d="M14 17C9.5 17 7 21 8.5 25.5C9.5 28.5 13 29 15 27"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M34 17C38.5 17 41 21 39.5 25.5C38.5 28.5 35 29 33 27"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Forehead & Tilak */}
          <path
            d="M15 18C15 14 19 12.5 24 12.5C29 12.5 33 14 33 18"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M24 15V19.5"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Eyes */}
          <circle cx="19.5" cy="21" r="1.3" fill={color} />
          <circle cx="28.5" cy="21" r="1.3" fill={color} />
          {/* Curved Trunk */}
          <path
            d="M21 24C21 28.5 21 34 25 37.5C27.5 39.5 31.5 38.5 31.5 35.5C31.5 33.5 29.5 32.5 28 33.5"
            stroke={color}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          {/* Tusk & Base */}
          <path
            d="M16 41.5H32"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>
      );

    case 'buddhist':
      // Dhammachakra (8-spoked Wheel of Dharma)
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="24" cy="24" r="15.5" stroke={color} strokeWidth="2.4" />
          <circle cx="24" cy="24" r="12" stroke={color} strokeWidth="1.2" opacity="0.6" />
          <circle cx="24" cy="24" r="4" stroke={color} strokeWidth="2" />
          {/* 8 Spokes & Rim Finials */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const x1 = 24 + Math.cos(rad) * 4;
            const y1 = 24 + Math.sin(rad) * 4;
            const x2 = 24 + Math.cos(rad) * 15.5;
            const y2 = 24 + Math.sin(rad) * 15.5;
            const x3 = 24 + Math.cos(rad) * 19;
            const y3 = 24 + Math.sin(rad) * 19;
            return (
              <g key={deg}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={color}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle cx={x3} cy={y3} r="1.5" fill={color} />
              </g>
            );
          })}
        </svg>
      );

    case 'jain':
      // Jain Swastika + Ratnatraya (3 dots) + Siddhashila crescent
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          aria-hidden="true"
        >
          {/* Siddhashila Crescent & Bindu */}
          <path
            d="M17 10.5C19.5 13 28.5 13 31 10.5"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="24" cy="7.5" r="1.8" fill={color} />
          {/* Three Ratnatraya Dots */}
          <circle cx="19" cy="16" r="1.5" fill={color} />
          <circle cx="24" cy="16" r="1.5" fill={color} />
          <circle cx="29" cy="16" r="1.5" fill={color} />
          {/* Swastika */}
          <path
            d="M24 21V39M15 30H33"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M24 21H32M33 30V38M24 39H16M15 30V22"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'muslim':
      // Crescent Moon & Star Emblem
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M29.5 10.5C21.5 11.2 15.5 17.8 15.5 25.8C15.5 34.2 22.3 41 30.7 41C33.4 41 35.9 40.3 38.1 39C35.8 39.8 33.4 40 31 39.5C24.5 38.2 20.2 32.1 21 25.4C21.7 19.3 26.5 14.5 32.5 13.7C34.2 13.5 35.8 13.7 37.3 14.1C35.1 11.7 32.4 10.3 29.5 10.5Z"
            fill={color}
          />
          <path
            d="M32 18L33.5 21.8L37.5 22L34.3 24.4L35.4 28.3L32 26L28.6 28.3L29.7 24.4L26.5 22L30.5 21.8L32 18Z"
            fill={color}
          />
        </svg>
      );

    case 'christian':
      // Ornamental Cross Emblem
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M24 8V40M14 18.5H34"
            stroke={color}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <circle cx="24" cy="8" r="2" fill={color} />
          <circle cx="24" cy="40" r="2" fill={color} />
          <circle cx="14" cy="18.5" r="2" fill={color} />
          <circle cx="34" cy="18.5" r="2" fill={color} />
          <circle cx="24" cy="18.5" r="3" fill="#FFFFFF" stroke={color} strokeWidth="2" />
        </svg>
      );

    case 'sikh':
      // Khanda Emblem
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          aria-hidden="true"
        >
          {/* Central Double-Edged Sword */}
          <path
            d="M24 6L26.5 12V35H21.5V12L24 6Z"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M20 35H28M24 35V42M21 42H27"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Chakkar (Circle) */}
          <circle cx="24" cy="24" r="7.5" stroke={color} strokeWidth="2.2" />
          {/* Left & Right Kirpans */}
          <path
            d="M15 14C9.5 19.5 9.5 29.5 15 35.5"
            stroke={color}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M33 14C38.5 19.5 38.5 29.5 33 35.5"
            stroke={color}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'parsi':
      // Classic Ornamental Sun & Ceremonial Fire Emblem
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          aria-hidden="true"
        >
          {/* Radiant Flame */}
          <path
            d="M24 7C26.5 11 29.5 13.5 29.5 17.5C29.5 20.5 27 23 24 23C21 23 18.5 20.5 18.5 17.5C18.5 13.5 21.5 11 24 7Z"
            stroke={color}
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Winged Ornamental Crest */}
          <path
            d="M8 25H40M11 29H37"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Fire Urn Pedestal */}
          <path
            d="M17 25L19.5 33H28.5L31 25"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M21 33L18 40H30L27 33"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'secular':
    default:
      // Minimalist Floral / Geometric Lotus Emblem
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M24 9C27.5 14.5 29 19.5 29 25C29 30 26.8 34 24 36C21.2 34 19 30 19 25C19 19.5 20.5 14.5 24 9Z"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M19.5 29C14.5 27.5 10.5 23.5 9.5 18C14.5 18.5 18.5 21 20.5 25"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M28.5 29C33.5 27.5 37.5 23.5 38.5 18C33.5 18.5 29.5 21 27.5 25"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M13 38.5H35"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.75"
          />
        </svg>
      );
  }
};
