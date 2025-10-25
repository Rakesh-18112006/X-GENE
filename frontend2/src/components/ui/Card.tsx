import type { HTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  glass?: boolean;
}

export default function Card({
  children,
  hover = true,
  glass = false,
  className = '',
  ...props
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={hover ? { y: -4, boxShadow: '0 8px 32px rgba(0, 217, 255, 0.15)' } : {}}
      className={`
        ${glass ? 'glass-effect' : 'bg-[#13141a]'}
        rounded-xl p-6
        border border-[#2a2d3a]
        transition-all duration-300
        ${className}
      `}
      onClick={props.onClick}
    >
      {children}
    </motion.div>
  );
}
