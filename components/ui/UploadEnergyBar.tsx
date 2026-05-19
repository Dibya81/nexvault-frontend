"use client";

import { motion } from "framer-motion";

interface UploadEnergyBarProps {
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
}

export function UploadEnergyBar({ progress, status }: UploadEnergyBarProps) {
  const getColor = () => {
    switch (status) {
      case "completed": return "#00ff88";
      case "error": return "#ff0040";
      case "uploading": return "#00f0ff";
      default: return "#7000ff";
    }
  };

  const color = getColor();

  return (
    <div className="relative h-2 bg-cyber-dark rounded-full overflow-hidden">
      {/* Background glow */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{ backgroundColor: color }}
      />

      {/* Progress bar */}
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{
          background: `linear-gradient(90deg, ${color}, ${color}80)`,
          boxShadow: `0 0 10px ${color}, 0 0 20px ${color}40`,
        }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />

      {/* Energy particles */}
      {status === "uploading" && (
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              `linear-gradient(90deg, transparent 0%, ${color}30 50%, transparent 100%)`,
              `linear-gradient(90deg, transparent 100%, ${color}30 150%, transparent 200%)`,
            ],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      )}

      {/* Glow at the tip */}
      {progress > 0 && progress < 100 && (
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
          style={{
            left: `${progress}%`,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
        />
      )}
    </div>
  );
}
