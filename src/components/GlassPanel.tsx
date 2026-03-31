import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
}

export default function GlassPanel({ children, className = '' }: GlassPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}
