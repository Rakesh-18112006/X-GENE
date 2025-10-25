import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  isLoading?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  isLoading,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2';

  const variants = {
    primary: 'bg-gradient-to-r from-[#00d9ff] to-[#0099ff] text-white hover:shadow-[0_0_20px_rgba(0,217,255,0.5)] hover:scale-105',
    secondary: 'bg-[#1a1c24] text-white border border-[#2a2d3a] hover:bg-[#20222d] hover:border-[#00d9ff]',
    outline: 'border-2 border-[#00d9ff] text-[#00d9ff] hover:bg-[#00d9ff] hover:text-white',
    ghost: 'text-[#a0a3bd] hover:text-white hover:bg-[#1a1c24]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      disabled={disabled || isLoading}
      type={props.type}
      onClick={props.onClick}
    >
      {isLoading ? (
        <>
          <div className="loading-spinner w-5 h-5 border-2" />
          Loading...
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}
