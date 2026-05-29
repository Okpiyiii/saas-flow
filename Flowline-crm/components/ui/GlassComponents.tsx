import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
  noPadding?: boolean;
}

export const GlassCard: React.FC<CardProps> = ({ children, className = '', onClick, hoverEffect = false, noPadding = false }) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hoverEffect ? { scale: 1.015, y: -2 } : undefined}
      whileTap={hoverEffect ? { scale: 0.985 } : undefined}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`rounded-[16px] backdrop-blur-[30px] ${noPadding ? '' : 'p-5'} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      style={{
        background: 'rgba(255,255,255,0.45)',
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: 'inset 0px 4px 4px 0px rgba(255,255,255,0.25), 0px 1px 3px 0px rgba(0,0,0,0.04)',
      }}
    >
      {children}
    </motion.div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'icon';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyles = "inline-flex items-center justify-center font-inter font-medium transition-all duration-200 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "text-white border border-transparent",
    secondary: "text-zinc-900 hover:bg-white/40 border border-transparent",
    outline: "text-zinc-700 border border-black/10 hover:bg-white/40 hover:text-zinc-900",
    ghost: "bg-transparent text-zinc-500 hover:text-zinc-900 hover:bg-white/30"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    icon: "p-2"
  };

  const primaryStyle = variant === 'primary'
    ? {
        background: 'rgba(0,132,255,0.8)',
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)',
        boxShadow: 'inset 0px 4px 4px 0px rgba(255,255,255,0.35)',
      }
    : {};

  return (
    <motion.button
      whileHover={variant === 'primary' ? { scale: 1.03 } : { scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      style={primaryStyle}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; color?: 'green' | 'blue' | 'yellow' | 'red' | 'gray'; size?: 'sm' | 'md'; className?: string }> = ({ children, color = 'gray', size = 'md', className = '' }) => {
  const colors = {
    green: 'bg-emerald-50/80 text-emerald-700 border-emerald-200/50',
    blue: 'bg-blue-50/80 text-blue-700 border-blue-200/50',
    yellow: 'bg-amber-50/80 text-amber-700 border-amber-200/50',
    red: 'bg-rose-50/80 text-rose-700 border-rose-200/50',
    gray: 'bg-zinc-100/80 text-zinc-600 border-zinc-200/50',
  };

  const sizeClasses = {
    sm: 'px-1.5 py-0 text-[10px]',
    md: 'px-2 py-0.5 text-[11px]',
  };

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      className={`${sizeClasses[size]} rounded-[8px] font-medium border backdrop-blur-sm font-inter ${colors[color]} ${className}`}
    >
      {children}
    </motion.span>
  );
};
