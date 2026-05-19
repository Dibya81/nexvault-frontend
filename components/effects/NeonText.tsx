"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface NeonTextProps {
  children: ReactNode;
  className?: string;
  color?: "cyan" | "magenta" | "purple" | "green" | "yellow";
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  flicker?: boolean;
  glitch?: boolean;
}

const colorMap = {
  cyan: "#00f0ff",
  magenta: "#ff00a0",
  purple: "#7000ff",
  green: "#00ff88",
  yellow: "#ffea00",
};

const sizeMap = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-2xl",
  "2xl": "text-4xl md:text-6xl",
};

export function NeonText({ 
  children, 
  className = "", 
  color = "cyan",
  size = "md",
  flicker = false,
  glitch = false 
}: NeonTextProps) {
  const hexColor = colorMap[color];

  return (
    <motion.span
      className={`font-bold tracking-wider ${sizeMap[size]} ${className}`}
      style={{
        color: hexColor,
        textShadow: `
          0 0 5px ${hexColor},
          0 0 10px ${hexColor},
          0 0 20px ${hexColor},
          0 0 40px ${hexColor}80
        `,
      }}
      animate={flicker ? {
        opacity: [1, 0.8, 1, 0.9, 1, 0.7, 1],
      } : {}}
      transition={flicker ? {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
      } : {}}
    >
      {glitch ? (
        <span className="relative inline-block">
          <span className="relative z-10">{children}</span>
          <span 
            className="absolute top-0 left-0 -z-10 opacity-70"
            style={{ 
              color: "#ff0040",
              clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
              transform: "translateX(2px)",
            }}
          >
            {children}
          </span>
          <span 
            className="absolute top-0 left-0 -z-10 opacity-70"
            style={{ 
              color: "#00f0ff",
              clipPath: "polygon(0 55%, 100% 55%, 100% 100%, 0 100%)",
              transform: "translateX(-2px)",
            }}
          >
            {children}
          </span>
        </span>
      ) : children}
    </motion.span>
  );
}
