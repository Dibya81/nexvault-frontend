"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  HardDrive, Upload, Download, Trash2, Folder, File, Image, Video, Music,
  FileText, Archive, Code, MoreVertical, Search, Grid, List, Plus,
  ChevronRight, Activity, Shield, Zap, Clock, AlertTriangle
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useFilesStore } from "@/store/files";
import { formatBytes, formatDate } from "@/utils/helpers";
import { NeonText } from "@/components/effects/NeonText";
import { HologramCard } from "@/components/effects/HologramCard";
import { StorageGlobe } from "@/components/3d/StorageGlobe";
import { FileCard3D } from "@/components/3d/FileCard3D";
import { ActivityGraph } from "@/components/ui/ActivityGraph";

// Stats Card with Physics
function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  trend, 
  delay 
}: {
  title: string;
  value: string;
  icon: any;
  color: string;
  trend?: string;
  delay: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative"
    >
      <HologramCard>
        <div className="glass-panel rounded-xl p-6 relative overflow-hidden group">
          {/* Animated background glow */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${color}15, transparent 70%)`,
            }}
          />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div 
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
              >
                <Icon size={20} style={{ color }} />
              </div>
              {trend && (
                <span className="text-xs px-2 py-1 rounded-full bg-cyber-green/10 text-cyber-green border border-cyber-green/30">
                  {trend}
                </span>
              )}
            </div>

            <motion.h3 
              className="text-2xl font-bold text-white mb-1"
              animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
            >
              {value}
            </motion.h3>
            <p className="text-sm text-gray-400">{title}</p>
          </div>

          {/* Bottom accent line */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px]"
            style={{ backgroundColor: color }}
            initial={{ width: "0%" }}
            animate={{ width: isHovered ? "100%" : "30%" }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </HologramCard>
    </motion.div>
  );
}

// Storage Visualization
function StorageVisualization() {
  const { storageStats } = useFilesStore();
  const used = storageStats?.used || 0;
  const total = storageStats?.total || 1;
  const percentage = (used / total) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="relative"
    >
      <HologramCard className="h-full">
        <div className="glass-panel rounded-xl p-6 h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <HardDrive size={18} className="text-cyber-cyan" />
              Storage Core
            </h3>
            <span className="text-sm text-cyber-cyan">{percentage.toFixed(1)}% Used</span>
          </div>

          <div className="relative h-48 mb-4">
            <StorageGlobe percentage={percentage} />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Used</span>
              <span className="text-white font-medium">{formatBytes(used)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total</span>
              <span className="text-white font-medium">{formatBytes(total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Free</span>
              <span className="text-cyber-green font-medium">{formatBytes(total - used)}</span>
            </div>
          </div>

          {/* Progress bar with energy effect */}
          <div className="mt-4 h-3 bg-cyber-dark rounded-full overflow-hidden relative">
            <motion.div
              className="h-full rounded-full relative"
              style={{
                background: `linear-gradient(90deg, #00f0ff, #7000ff, #ff00a0)`,
                backgroundSize: "200% 100%",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
            >
              <div 
                className="absolute inset-0 animate-energy-flow"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                  backgroundSize: "200% 100%",
                }}
              />
            </motion.div>
          </div>
        </div>
      </HologramCard>
    </motion.div>
  );
}

// Recent Files with 3D Cards
function RecentFiles() {
  const { files, viewMode, setViewMode, isLoading } = useFilesStore();
  const router = useRouter();

  const getFileIcon = (type: string | undefined) => {
    if (!type) return File;
    const icons: Record<string, any> = { image: Image, video: Video, audio: Music, document: FileText, archive: Archive, code: Code };
    return icons[type] || File;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
    >
      <div className="glass-panel rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Clock size={18} className="text-cyber-purple" />
            Recent Transmissions
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-cyber-cyan/20 text-cyber-cyan" : "text-gray-500 hover:text-white"}`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-cyber-cyan/20 text-cyber-cyan" : "text-gray-500 hover:text-white"}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <motion.div
              className="w-8 h-8 border-2 border-cyber-cyan border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-2"}>
            <AnimatePresence>
              {files.slice(0, 8).map((file, index) => {
                const Icon = getFileIcon(file.type);
                return viewMode === "grid" ? (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                  >
                    <FileCard3D file={file} icon={Icon} />
                  </motion.div>
                ) : (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-cyber-cyan/5 transition-colors group cursor-pointer"
                  >
                    <div className="p-2 rounded-lg bg-cyber-cyan/10 text-cyber-cyan">
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatBytes(file.size || file.size_bytes || 0)} · {formatDate(file.created_at || file.upload_date)}</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-600 group-hover:text-cyber-cyan transition-colors" />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Activity Feed
function ActivityFeed() {
  const activities = [
    { id: 1, action: "Uploaded", target: "project_files.zip", time: "2 min ago", type: "upload" },
    { id: 2, action: "Created folder", target: "Design Assets", time: "15 min ago", type: "folder" },
    { id: 3, action: "Downloaded", target: "report_2024.pdf", time: "1 hour ago", type: "download" },
    { id: 4, action: "Deleted", target: "old_backup.tar", time: "3 hours ago", type: "delete" },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "upload": return <Upload size={14} className="text-cyber-cyan" />;
      case "download": return <Download size={14} className="text-cyber-green" />;
      case "delete": return <Trash2 size={14} className="text-cyber-red" />;
      case "folder": return <Folder size={14} className="text-cyber-yellow" />;
      default: return <Activity size={14} className="text-gray-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
    >
      <div className="glass-panel rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
          <Activity size={18} className="text-cyber-magenta" />
          System Activity
        </h3>

        <div className="space-y-3">
          <AnimatePresence>
            {activities.map((activity, i) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-cyber-cyan/5 transition-colors"
              >
                <div className="p-2 rounded-lg bg-cyber-dark">
                  {getIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">
                    <span className="text-gray-400">{activity.action}</span>{" "}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-4 pt-4 border-t border-cyber-border/30">
          <ActivityGraph />
        </div>
      </div>
    </motion.div>
  );
}

// Security Status
function SecurityStatus() {
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setScanning(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <div className="glass-panel rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Shield size={18} className="text-cyber-green" />
            Security Protocol
          </h3>
          <motion.div
            className="flex items-center gap-2"
            animate={scanning ? { opacity: [1, 0.5, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <span className={`w-2 h-2 rounded-full ${scanning ? "bg-cyber-yellow animate-pulse" : "bg-cyber-green"}`} />
            <span className="text-xs text-gray-400">
              {scanning ? "Scanning..." : "Secure"}
            </span>
          </motion.div>
        </div>

        <div className="space-y-3">
          {[
            { label: "Encryption", status: "AES-256", active: true },
            { label: "Firewall", status: "Active", active: true },
            { label: "Intrusion Detection", status: "Monitoring", active: true },
            { label: "Backup Status", status: "Synced", active: true },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="flex items-center justify-between p-2 rounded-lg bg-cyber-dark/50"
            >
              <span className="text-sm text-gray-300">{item.label}</span>
              <span className="text-xs px-2 py-1 rounded-full bg-cyber-green/10 text-cyber-green border border-cyber-green/30">
                {item.status}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Quick Actions
function QuickActions() {
  const router = useRouter();
  const actions = [
    { label: "Upload Files", icon: Upload, color: "#00f0ff", href: "/upload" },
    { label: "New Folder", icon: Folder, color: "#ffea00", action: () => {} },
    { label: "Gallery", icon: Image, color: "#ff00a0", href: "/gallery" },
    { label: "Settings", icon: Zap, color: "#00ff88", href: "/settings" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      {actions.map((action, i) => (
        <motion.button
          key={action.label}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => action.href ? router.push(action.href) : action.action?.()}
          className="glass-panel rounded-xl p-4 text-center group relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + i * 0.1 }}
        >
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: `radial-gradient(circle at 50% 50%, ${action.color}10, transparent 70%)` }}
          />
          <action.icon size={24} style={{ color: action.color }} className="mx-auto mb-2" />
          <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{action.label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}

// Main Dashboard
export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { fetchFiles, fetchStorageStats, storageStats, files } = useFilesStore();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ container: containerRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFiles();
      fetchStorageStats();
    }
  }, [isAuthenticated, fetchFiles, fetchStorageStats]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="w-12 h-12 border-2 border-cyber-cyan border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div ref={containerRef} className="min-h-screen p-6 lg:p-8 overflow-y-auto">
      {/* Scroll Progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-magenta z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <NeonText size="xl" color="cyan">
              COMMAND CENTER
            </NeonText>
            <p className="text-gray-400 mt-1">System Overview · All Systems Nominal</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="glass-panel rounded-lg px-4 py-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
              <span className="text-sm text-gray-300">Online</span>
            </div>
            <div className="glass-panel rounded-lg px-4 py-2 text-sm text-gray-400">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Files"
          value="2,847"
          icon={File}
          color="#00f0ff"
          trend="+12%"
          delay={0}
        />
        <StatCard
          title="Storage Used"
          value="750 GB"
          icon={HardDrive}
          color="#7000ff"
          trend="75%"
          delay={0.1}
        />
        <StatCard
          title="Uploads Today"
          value="156"
          icon={Upload}
          color="#00ff88"
          trend="+24"
          delay={0.2}
        />
        <StatCard
          title="Security Score"
          value="98/100"
          icon={Shield}
          color="#ffea00"
          delay={0.3}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Storage Visualization */}
        <div className="lg:col-span-1">
          <StorageVisualization />
        </div>

        {/* Recent Files */}
        <div className="lg:col-span-2">
          <RecentFiles />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <QuickActions />
        </div>
        <div>
          <SecurityStatus />
        </div>
      </div>

      {/* Activity Feed */}
      <div className="max-w-2xl">
        <ActivityFeed />
      </div>
    </div>
  );
}
