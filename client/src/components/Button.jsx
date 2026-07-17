import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  onClick, 
  type = 'button',
  disabled = false,
  loading = false
}) => {
  const baseStyle = "font-display font-semibold rounded-xl flex items-center justify-center gap-2 transition-all focus:outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50";
  
  const variants = {
    primary: "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-[0_4px_20px_rgba(139,92,246,0.35)]",
    secondary: "glass-panel bg-cyan-950/20 text-cyan-400 border-cyan-800/40 hover:bg-cyan-900/30 hover:border-cyan-500/50 hover:text-cyan-300",
    accent: "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-[0_4px_20px_rgba(236,72,153,0.35)]",
    outline: "glass-panel bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30 text-white",
    danger: "bg-red-650 hover:bg-red-500 border border-red-800 text-white"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-base"
  };

  return (
    <motion.button
      whileHover={disabled || loading ? {} : { scale: 1.02 }}
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? (
        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
      ) : null}
      {children}
    </motion.button>
  );
};

export default Button;
