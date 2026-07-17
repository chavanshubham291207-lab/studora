import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', hover = true, onClick, delay = 0 }) => {
  const CardComponent = onClick ? motion.button : motion.div;

  const cardProps = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay },
    className: `glass-panel rounded-2xl p-6 text-left ${hover ? 'glass-card-hover' : ''} ${className}`,
    onClick
  };

  if (onClick) {
    cardProps.whileHover = { scale: 1.01 };
    cardProps.whileTap = { scale: 0.99 };
  }

  return (
    <CardComponent {...cardProps}>
      {children}
    </CardComponent>
  );
};

export default GlassCard;
