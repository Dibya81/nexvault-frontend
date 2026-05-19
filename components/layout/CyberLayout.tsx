"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CyberBackground } from "@/components/effects/CyberBackground";
import { ScanLines } from "@/components/effects/ScanLines";
import { ParticleField } from "@/components/effects/ParticleField";
import { Navigation } from "@/components/layout/Navigation";
import { useAuthStore } from "@/store/auth";

export function CyberLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="relative min-h-screen bg-cyber-black overflow-hidden">
      {/* Background Effects Layer */}
      <div className="fixed inset-0 z-0">
        <CyberBackground />
        <ParticleField />
        <ScanLines />
      </div>

      {/* Navigation */}
      {!isAuthPage && <Navigation />}

      {/* Main Content */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
