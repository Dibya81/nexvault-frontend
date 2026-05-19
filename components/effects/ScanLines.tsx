"use client";

import { motion } from "framer-motion";

export function ScanLines() {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {/* Horizontal scan lines */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 240, 255, 0.1) 2px, rgba(0, 240, 255, 0.1) 4px)',
        }}
      />

      {/* Moving scan line */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-cyan/30 to-transparent"
        animate={{
          top: ["0%", "100%"],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(10, 10, 15, 0.4) 100%)',
        }}
      />

      {/* Corner accents */}
      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-cyber-cyan/20" />
      <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-cyber-cyan/20" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-cyber-cyan/20" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-cyber-cyan/20" />
    </div>
  );
}
