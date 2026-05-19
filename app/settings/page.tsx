"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Key, Bell, Palette, Globe, Shield, 
  ChevronRight, Save, Check, AlertTriangle 
} from "lucide-react";
import { NeonText } from "@/components/effects/NeonText";
import { HologramCard } from "@/components/effects/HologramCard";
import { useUIStore } from "@/store/ui";

interface SettingSection {
  id: string;
  title: string;
  icon: any;
  color: string;
}

const sections: SettingSection[] = [
  { id: "profile", title: "Identity Profile", icon: User, color: "#00f0ff" },
  { id: "security", title: "Security Protocol", icon: Shield, color: "#00ff88" },
  { id: "appearance", title: "Visual Interface", icon: Palette, color: "#ff00a0" },
  { id: "notifications", title: "Alert System", icon: Bell, color: "#ffea00" },
  { id: "network", title: "Network Config", icon: Globe, color: "#7000ff" },
];

function SettingPanel({ section }: { section: SettingSection }) {
  const { hologramIntensity, setHologramIntensity, particleDensity, setParticleDensity } = useUIStore();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${section.color}15`, border: `1px solid ${section.color}30` }}
          >
            <section.icon size={20} style={{ color: section.color }} />
          </div>
          <h2 className="text-xl font-bold text-white">{section.title}</h2>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 hover:bg-cyber-cyan/20 transition-colors"
        >
          {saved ? <Check size={16} /> : <Save size={16} />}
          <span className="text-sm">{saved ? "Saved" : "Save"}</span>
        </motion.button>
      </div>

      <div className="space-y-4">
        {section.id === "appearance" && (
          <>
            <div className="glass-panel rounded-xl p-6">
              <label className="text-sm text-gray-300 mb-3 block">Hologram Intensity</label>
              <input
                type="range"
                min="0"
                max="100"
                value={hologramIntensity * 100}
                onChange={(e) => setHologramIntensity(Number(e.target.value) / 100)}
                className="w-full h-2 bg-cyber-dark rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #00f0ff 0%, #7000ff 50%, #ff00a0 100%)`,
                }}
              />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Minimal</span>
                <span className="text-cyber-cyan">{Math.round(hologramIntensity * 100)}%</span>
                <span>Maximum</span>
              </div>
            </div>

            <div className="glass-panel rounded-xl p-6">
              <label className="text-sm text-gray-300 mb-3 block">Particle Density</label>
              <input
                type="range"
                min="0"
                max="100"
                value={particleDensity * 100}
                onChange={(e) => setParticleDensity(Number(e.target.value) / 100)}
                className="w-full h-2 bg-cyber-dark rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #00f0ff 0%, #7000ff 50%, #ff00a0 100%)`,
                }}
              />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Low</span>
                <span className="text-cyber-cyan">{Math.round(particleDensity * 100)}%</span>
                <span>High</span>
              </div>
            </div>
          </>
        )}

        {section.id === "security" && (
          <>
            <div className="glass-panel rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-500 mt-1">Require secondary verification for access</p>
                </div>
                <div className="w-12 h-6 bg-cyber-green/20 rounded-full relative cursor-pointer border border-cyber-green/30">
                  <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-cyber-green rounded-full" />
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-medium">Session Timeout</h3>
                  <p className="text-sm text-gray-500 mt-1">Auto-logout after inactivity</p>
                </div>
                <span className="text-cyber-cyan text-sm">30 minutes</span>
              </div>
            </div>

            <div className="glass-panel rounded-xl p-6 border border-cyber-red/20">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-cyber-red mt-0.5" />
                <div>
                  <h3 className="text-white font-medium">Danger Zone</h3>
                  <p className="text-sm text-gray-500 mt-1 mb-4">
                    These actions are irreversible. Proceed with caution.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-lg bg-cyber-red/10 text-cyber-red border border-cyber-red/30 hover:bg-cyber-red/20 transition-colors text-sm"
                  >
                    Delete All Data
                  </motion.button>
                </div>
              </div>
            </div>
          </>
        )}

        {section.id === "profile" && (
          <>
            <div className="glass-panel rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center text-2xl font-bold text-white">
                  A
                </div>
                <div>
                  <h3 className="text-white font-medium text-lg">Admin User</h3>
                  <p className="text-sm text-gray-500">admin@cybercloud.local</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30">
                    Administrator
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const active = sections.find((s) => s.id === activeSection) || sections[0];

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <NeonText size="xl" color="green">
          SYSTEM CONFIG
        </NeonText>
        <p className="text-gray-400 mt-1">Configure your interface parameters</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass-panel rounded-xl p-4 space-y-2">
            {sections.map((section) => (
              <motion.button
                key={section.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeSection === section.id
                    ? "bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <section.icon size={18} style={{ color: activeSection === section.id ? section.color : undefined }} />
                <span className="text-sm font-medium">{section.title}</span>
                {activeSection === section.id && (
                  <ChevronRight size={16} className="ml-auto" />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <SettingPanel key={activeSection} section={active} />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
