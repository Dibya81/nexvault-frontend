"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Upload, X, File, Zap, AlertTriangle, CheckCircle, Cloud, ArrowUp } from "lucide-react";
import { useFilesStore } from "@/store/files";
import { formatBytes } from "@/utils/helpers";
import { NeonText } from "@/components/effects/NeonText";
import { HologramCard } from "@/components/effects/HologramCard";
import { UploadEnergyBar } from "@/components/ui/UploadEnergyBar";

// Magnetic Drop Zone
function MagneticDropZone({ onDrop, isDragActive }: { onDrop: (files: File[]) => void; isDragActive: boolean }) {
  const zoneRef = useRef<HTMLDivElement>(null);
  const [magnetOffset, setMagnetOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!zoneRef.current || isDragActive) return;
    const rect = zoneRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < 200) {
      const force = (200 - distance) / 200;
      setMagnetOffset({
        x: distX * force * 0.3,
        y: distY * force * 0.3,
      });
    } else {
      setMagnetOffset({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setMagnetOffset({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={zoneRef}
      className="relative"
      animate={{
        x: magnetOffset.x,
        y: magnetOffset.y,
        scale: isDragActive ? 1.05 : 1,
      }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
          ${isDragActive 
            ? "border-cyber-cyan bg-cyber-cyan/10 shadow-[0_0_40px_rgba(0,240,255,0.2)]" 
            : "border-cyber-border/50 hover:border-cyber-cyan/30 hover:bg-cyber-cyan/5"
          }
        `}
      >
        {/* Animated border corners */}
        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-cyber-cyan/30 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-cyber-cyan/30 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-cyber-cyan/30 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-cyber-cyan/30 rounded-br-2xl" />

        <motion.div
          animate={isDragActive ? { y: [0, -10, 0] } : { y: 0 }}
          transition={{ duration: 1, repeat: isDragActive ? Infinity : 0 }}
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20 flex items-center justify-center border border-cyber-cyan/20">
            <Upload size={36} className="text-cyber-cyan" />
          </div>
        </motion.div>

        <NeonText size="lg" color="cyan">
          {isDragActive ? "DROP TO TRANSMIT" : "DROP FILES HERE"}
        </NeonText>

        <p className="text-gray-400 mt-2 text-sm">
          or click to browse your local storage
        </p>

        <div className="mt-4 flex justify-center gap-4 text-xs text-gray-500">
          <span className="px-2 py-1 rounded-full bg-cyber-dark border border-cyber-border/30">Images</span>
          <span className="px-2 py-1 rounded-full bg-cyber-dark border border-cyber-border/30">Videos</span>
          <span className="px-2 py-1 rounded-full bg-cyber-dark border border-cyber-border/30">Documents</span>
          <span className="px-2 py-1 rounded-full bg-cyber-dark border border-cyber-border/30">Archives</span>
        </div>
      </div>
    </motion.div>
  );
}

// Upload Item with Energy Bar
function UploadItem({ upload, onRemove }: { upload: any; onRemove: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50, height: 0 }}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <HologramCard>
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-10 rounded-lg bg-cyber-cyan/10 flex items-center justify-center">
              <File size={20} className="text-cyber-cyan" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{upload.file.name}</p>
              <p className="text-xs text-gray-500">{formatBytes(upload.file.size)}</p>
            </div>
            <div className="flex items-center gap-2">
              {upload.status === "completed" && (
                <CheckCircle size={18} className="text-cyber-green" />
              )}
              {upload.status === "error" && (
                <AlertTriangle size={18} className="text-cyber-red" />
              )}
              <motion.button
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onRemove}
                className="p-1 rounded-lg hover:bg-cyber-red/10 text-gray-500 hover:text-cyber-red transition-colors"
              >
                <X size={16} />
              </motion.button>
            </div>
          </div>

          {/* Energy-style progress bar */}
          <UploadEnergyBar progress={upload.progress} status={upload.status} />

          {/* Status text */}
          <div className="flex justify-between mt-2 text-xs">
            <span className={`
              ${upload.status === "uploading" ? "text-cyber-cyan" : ""}
              ${upload.status === "completed" ? "text-cyber-green" : ""}
              ${upload.status === "error" ? "text-cyber-red" : ""}
              ${upload.status === "pending" ? "text-gray-500" : ""}
            `}>
              {upload.status === "uploading" && "Transmitting..."}
              {upload.status === "completed" && "Transmission Complete"}
              {upload.status === "error" && "Transmission Failed"}
              {upload.status === "pending" && "Queued..."}
            </span>
            <span className="text-gray-500">{upload.progress}%</span>
          </div>
        </div>
      </HologramCard>
    </motion.div>
  );
}

// Main Upload Page
export default function UploadPage() {
  const [files, setFiles] = useState<any[]>([]);
  const { addUpload } = useFilesStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newUploads = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 15),
      file,
      progress: 0,
      status: "pending" as const,
      speed: 0,
    }));

    setFiles((prev) => [...prev, ...newUploads]);

    // Real backend upload
    newUploads.forEach((upload) => {
      setFiles((prev) => prev.map((f) => f.id === upload.id ? { ...f, status: "uploading" } : f));
      filesApi.upload(upload.file, undefined, (progress) => {
        setFiles((prev) => prev.map((f) => f.id === upload.id ? { ...f, progress } : f));
      }).then((result: any) => {
        setFiles((prev) => prev.map((f) => f.id === upload.id ? { ...f, progress: 100, status: "completed" } : f));
      }).catch(() => {
        setFiles((prev) => prev.map((f) => f.id === upload.id ? { ...f, status: "error" } : f));
      });
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const totalProgress = files.length > 0 
    ? files.reduce((acc, f) => acc + f.progress, 0) / files.length 
    : 0;

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <NeonText size="xl" color="cyan">
          TRANSMISSION CENTER
        </NeonText>
        <p className="text-gray-400 mt-1">Upload files to the cloud core</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Area */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <MagneticDropZone onDrop={onDrop} isDragActive={isDragActive} />
            </div>
          </motion.div>

          {/* Upload Queue */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Zap size={18} className="text-cyber-yellow" />
                    Transmission Queue
                  </h3>
                  <span className="text-sm text-gray-400">
                    {files.filter((f) => f.status === "completed").length} / {files.length} Complete
                  </span>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  <AnimatePresence>
                    {files.map((upload) => (
                      <UploadItem
                        key={upload.id}
                        upload={upload}
                        onRemove={() => removeFile(upload.id)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <HologramCard>
              <div className="glass-panel rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Cloud size={18} className="text-cyber-cyan" />
                  Transfer Stats
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Overall Progress</span>
                      <span className="text-cyber-cyan">{Math.round(totalProgress)}%</span>
                    </div>
                    <div className="h-3 bg-cyber-dark rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-magenta"
                        initial={{ width: 0 }}
                        animate={{ width: `${totalProgress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-cyber-dark/50 text-center">
                      <p className="text-2xl font-bold text-cyber-cyan">{files.length}</p>
                      <p className="text-xs text-gray-500">Files</p>
                    </div>
                    <div className="p-3 rounded-lg bg-cyber-dark/50 text-center">
                      <p className="text-2xl font-bold text-cyber-green">
                        {formatBytes(files.reduce((acc, f) => acc + f.file.size, 0))}
                      </p>
                      <p className="text-xs text-gray-500">Total Size</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-cyber-dark/50">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowUp size={14} className="text-cyber-cyan" />
                      <span className="text-sm text-gray-400">Upload Speed</span>
                    </div>
                    <p className="text-xl font-bold text-white">45.2 MB/s</p>
                  </div>
                </div>
              </div>
            </HologramCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
