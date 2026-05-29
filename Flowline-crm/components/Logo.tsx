import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  iconOnly?: boolean;
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ iconOnly = false, size = 24, className = '' }) => {
  return (
    <motion.div
      className={`flex items-center gap-2 select-none ${className}`}
      layout
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        whileHover={{ scale: 1.08 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      >
        <defs>
          <linearGradient id="bgGlow" x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.18" />
            <stop offset="50%" stopColor="#6366F1" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0.14" />
          </linearGradient>

          <linearGradient id="neonBlue" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#0084FF" />
            <stop offset="40%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>

          <linearGradient id="electricPurple" x1="1" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="50%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>

          <linearGradient id="intersectionGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="50%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>

          <filter id="noise" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
            <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
            <feBlend mode="soft-light" in="grayNoise" in2="SourceGraphic" result="textured" />
          </filter>

          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Dark background with rounded corners */}
        <rect x="2" y="2" width="60" height="60" rx="15" fill="#09090D" />

        {/* Subtle ambient gradient glow inside background */}
        <rect x="2" y="2" width="60" height="60" rx="15" fill="url(#bgGlow)" />

        {/* Textured noise overlay */}
        <rect x="2" y="2" width="60" height="60" rx="15" fill="#09090D" opacity="0.15" filter="url(#noise)" />

        {/* Subtle border highlight */}
        <rect x="2.5" y="2.5" width="59" height="59" rx="14.5" stroke="white" strokeWidth="0.5" opacity="0.08" />
        <rect x="3" y="3" width="58" height="58" rx="14" stroke="url(#intersectionGlow)" strokeWidth="0.5" opacity="0.15" />

        {/* Ribbon 1: Neon blue sweeping from bottom-left to upper-right */}
        <path
          d="M 5 54 C 17 36, 28 26, 46 12"
          stroke="url(#neonBlue)"
          strokeWidth="5.5"
          strokeLinecap="round"
          opacity="0.80"
          filter="url(#glow)"
        />

        {/* Ribbon 1 inner core highlight */}
        <path
          d="M 5 54 C 17 36, 28 26, 46 12"
          stroke="white"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.35"
        />

        {/* Ribbon 2: Electric purple sweeping from bottom-right to upper-left */}
        <path
          d="M 59 48 C 44 30, 34 22, 18 8"
          stroke="url(#electricPurple)"
          strokeWidth="5.5"
          strokeLinecap="round"
          opacity="0.80"
          filter="url(#glow)"
        />

        {/* Ribbon 2 inner core highlight */}
        <path
          d="M 59 48 C 44 30, 34 22, 18 8"
          stroke="white"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.35"
        />

        {/* Glassy sheen arc - top edge of ribbon 1 */}
        <path
          d="M 10 50 C 20 36, 30 28, 44 16"
          stroke="white"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.20"
        />

        {/* Glassy sheen arc - top edge of ribbon 2 */}
        <path
          d="M 54 44 C 42 30, 32 24, 20 12"
          stroke="white"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.20"
        />

        {/* Connection node - where ribbons intersect */}
        <circle cx="31" cy="24.5" r="3.5" fill="white" opacity="0.95" filter="url(#nodeGlow)" />
        <circle cx="31" cy="24.5" r="2.5" fill="url(#intersectionGlow)" opacity="0.9" />
        <circle cx="31" cy="24.5" r="1.2" fill="white" opacity="0.9" />

        {/* Small accent nodes along the flow */}
        <circle cx="20" cy="40" r="1" fill="url(#neonBlue)" opacity="0.8" filter="url(#softGlow)" />
        <circle cx="42" cy="18" r="1" fill="url(#electricPurple)" opacity="0.8" filter="url(#softGlow)" />

        {/* Studio light reflection - top-left glassy highlight */}
        <path
          d="M 8 10 C 16 6, 26 4, 36 4"
          stroke="white"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.12"
        />

        {/* Studio light reflection - bottom-right rim */}
        <path
          d="M 56 50 C 52 54, 48 56, 42 58"
          stroke="white"
          strokeWidth="0.6"
          strokeLinecap="round"
          opacity="0.08"
        />
      </motion.svg>
      {!iconOnly && (
        <motion.span
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -4 }}
          className="text-sm font-fustat font-bold tracking-tight text-zinc-900"
        >
          Flowline
        </motion.span>
      )}
    </motion.div>
  );
};
