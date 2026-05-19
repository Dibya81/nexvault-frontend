"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Upload,
  Image,
  Settings,
  LogOut,
  Menu,
  X,
  Cloud,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/utils/helpers";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/upload", icon: Upload, label: "Upload" },
  { href: "/gallery", icon: Image, label: "Gallery" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathname = usePathname();
  const { logout, user } = useAuthStore();

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-3 glass-panel rounded-xl neon-glow"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full w-72 z-40 glass-panel-strong border-r border-cyber-border/30"
          >
            {/* Logo */}
            <div className="p-6 border-b border-cyber-border/30">
              <Link href="/dashboard" className="flex items-center gap-3 group">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                  className="relative"
                >
                  <Cloud className="w-8 h-8 text-cyber-cyan" />
                  <div className="absolute inset-0 bg-cyber-cyan/20 blur-xl rounded-full" />
                </motion.div>
                <div>
                  <h1 className="text-xl font-bold tracking-wider text-glow">
                    <span className="text-cyber-cyan">CYBER</span>
                    <span className="text-cyber-magenta">CLOUD</span>
                  </h1>
                  <p className="text-xs text-cyber-cyan/50 tracking-[0.3em]">
                    SECURE STORAGE
                  </p>
                </div>
              </Link>
            </div>

            {/* User Info */}
            {user && (
              <div className="p-4 mx-4 mt-4 glass-panel rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center text-sm font-bold">
                    {user.username[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.username}</p>
                    <p className="text-xs text-cyber-cyan/50 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Items */}
            <div className="p-4 space-y-2 mt-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <motion.div
                      className={cn(
                        "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                        isActive
                          ? "bg-cyber-cyan/10 text-cyber-cyan"
                          : "text-gray-400 hover:text-white"
                      )}
                      whileHover={{ x: 8 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Active Indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyber-cyan rounded-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}

                      <Icon size={20} className={isActive ? "text-cyber-cyan" : ""} />
                      <span className="font-medium">{item.label}</span>

                      {/* Hover Glow */}
                      <AnimatePresence>
                        {hoveredItem === item.href && !isActive && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="ml-auto"
                          >
                            <ChevronRight size={16} className="text-cyber-cyan" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* Storage Indicator */}
            <div className="absolute bottom-20 left-4 right-4">
              <div className="glass-panel rounded-xl p-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-400">Storage</span>
                  <span className="text-cyber-cyan">75%</span>
                </div>
                <div className="h-2 bg-cyber-dark rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-magenta"
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">750 GB / 1 TB</p>
              </div>
            </div>

            {/* Logout */}
            <div className="absolute bottom-4 left-4 right-4">
              <motion.button
                onClick={logout}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={20} />
                <span className="font-medium">Disconnect</span>
              </motion.button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Content Spacer */}
      <div className={cn("hidden lg:block", isOpen ? "w-72" : "w-0")} />
    </>
  );
}
