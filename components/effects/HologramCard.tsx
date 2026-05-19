"use client";

import { ReactNode, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface HologramCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export function HologramCard({ children, className = "", intensity = 1 }: HologramCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const rotateX = useTransform(ySpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  const glowX = useTransform(xSpring, [-0.5, 0.5], ["-50%", "50%"]);
  const glowY = useTransform(ySpring, [-0.5, 0.5], ["-50%", "50%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Holographic sheen */}
      <motion.div
        className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-10"
        style={{
          background: `radial-gradient(circle at ${glowX} ${glowY}, rgba(0, 240, 255, ${0.15 * intensity}), transparent 60%)`,
        }}
      />

      {/* Edge glow */}
      <div 
        className="absolute inset-0 rounded-xl pointer-events-none z-10"
        style={{
          boxShadow: `inset 0 0 30px rgba(0, 240, 255, ${0.1 * intensity})`,
        }}
      />

      {/* Content */}
      <div className="relative z-0">
        {children}
      </div>
    </motion.div>
  );
}
