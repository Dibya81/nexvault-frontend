"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { FileItem } from "@/store/files";
import { formatBytes } from "@/utils/helpers";
import { Image, Video, Music, FileText, Archive, Code, File, Download, Trash2, Eye } from "lucide-react";

const iconMap: Record<string, any> = {
  image: Image,
  video: Video,
  audio: Music,
  document: FileText,
  archive: Archive,
  code: Code,
};

const colorMap: Record<string, string> = {
  image: "#00f0ff",
  video: "#ff00a0",
  audio: "#7000ff",
  document: "#ffea00",
  archive: "#00ff88",
  code: "#ff0040",
};

export function FileCard3D({ file, icon: IconOverride }: { file: FileItem; icon?: any }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const rotateX = useTransform(ySpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const Icon = IconOverride || (file.type ? iconMap[file.type] : null) || File;
  const color = (file.type ? colorMap[file.type] : null) || "#00f0ff";

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative cursor-pointer"
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="glass-panel rounded-xl p-4 relative overflow-hidden group">
        {/* Holographic sheen */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${50 + x.get() * 50}% ${50 + y.get() * 50}%, ${color}15, transparent 60%)`,
          }}
        />

        {/* Type indicator */}
        <div 
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
        />

        {/* Icon */}
        <div className="flex items-center justify-center mb-3">
          <motion.div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
            animate={isHovered ? { rotate: [0, -10, 10, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            <Icon size={24} style={{ color }} />
          </motion.div>
        </div>

        {/* File info */}
        <div className="text-center">
          <p className="text-sm font-medium text-white truncate mb-1">{file.name || file.original_filename}</p>
          <p className="text-xs text-gray-500">{formatBytes(file.size || file.size_bytes || 0)}</p>
        </div>

        {/* Hover actions */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-2 left-2 right-2 flex justify-center gap-2"
            >
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-cyber-dark/80 text-cyber-cyan hover:bg-cyber-cyan/20"
              >
                <Eye size={14} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-cyber-dark/80 text-cyber-green hover:bg-cyber-green/20"
              >
                <Download size={14} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-cyber-dark/80 text-cyber-red hover:bg-cyber-red/20"
              >
                <Trash2 size={14} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Corner decoration */}
        <div 
          className="absolute bottom-0 right-0 w-6 h-6"
          style={{
            background: `linear-gradient(135deg, transparent 50%, ${color}20 50%)`,
          }}
        />
      </div>
    </motion.div>
  );
}
