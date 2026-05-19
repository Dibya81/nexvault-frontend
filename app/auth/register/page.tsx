"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, User, Zap, ChevronRight, Check } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAuthStore } from "@/store/auth";
import { NeonText } from "@/components/effects/NeonText";
import { HologramCard } from "@/components/effects/HologramCard";
import { getApiError } from "@/lib/api";

// Password strength ───────────────────────────────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ chars",  ok: password.length >= 8 },
    { label: "Uppercase", ok: /[A-Z]/.test(password) },
    { label: "Number",    ok: /[0-9]/.test(password) },
    { label: "Symbol",    ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const colors = ["#ff0040", "#ff6600", "#ffea00", "#00ff88"];
  const labels = ["Weak", "Fair", "Good", "Strong"];
  if (!password) return null;
  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="flex-1 h-1 rounded-full overflow-hidden bg-cyber-dark">
            <motion.div className="h-full rounded-full"
              animate={{ width: score >= n ? "100%" : "0%" }}
              transition={{ duration: 0.3 }}
              style={{ background: colors[score - 1] || "#ff0040", boxShadow: `0 0 6px ${colors[score - 1] || "#ff0040"}` }} />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {checks.map((c) => (
            <span key={c.label} className="flex items-center gap-1 text-[10px]" style={{ color: c.ok ? "#00ff88" : "#4a6580" }}>
              <Check size={8} style={{ opacity: c.ok ? 1 : 0.3 }} />{c.label}
            </span>
          ))}
        </div>
        <span className="text-[10px]" style={{ color: colors[score - 1] || "#ff0040" }}>
          {labels[score - 1] || "Very Weak"}
        </span>
      </div>
    </motion.div>
  );
}

// Animated orb scene ──────────────────────────────────────────────────────────
function RegisterScene() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.004;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
  });
  return (
    <group ref={groupRef}>
      {[1.8, 2.8, 3.8].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / (2 + i), 0, i * Math.PI / 3]}>
          <torusGeometry args={[r, 0.025, 16, 100]} />
          <meshBasicMaterial
            color={i === 0 ? "#00f0ff" : i === 1 ? "#7000ff" : "#ff00a0"}
            transparent opacity={0.6}
          />
        </mesh>
      ))}
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1.5} transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

// Cyber input ─────────────────────────────────────────────────────────────────
function CyberInput({
  type, placeholder, icon: Icon, value, onChange, showToggle, onToggle, autoComplete,
}: {
  type: string; placeholder: string; icon: any;
  value: string; onChange: (v: string) => void;
  showToggle?: boolean; onToggle?: () => void; autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <motion.div className="relative"
      animate={{ scale: focused ? 1.02 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      <div className={`relative flex items-center gap-3 px-4 py-3 rounded-xl
        bg-cyber-panel/50 border transition-all duration-300
        ${focused ? "border-cyber-cyan/50 shadow-[0_0_20px_rgba(0,240,255,0.15)]" : "border-cyber-border/30"}`}>
        <Icon size={18} className={focused ? "text-cyber-cyan" : "text-gray-500"} />
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder={placeholder} autoComplete={autoComplete}
          className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 text-sm" />
        {showToggle && (
          <button type="button" onClick={onToggle} className="text-gray-500 hover:text-cyber-cyan transition-colors">
            {type === "password" ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      <motion.div className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-magenta"
        initial={{ scaleX: 0 }} animate={{ scaleX: focused ? 1 : 0 }} transition={{ duration: 0.3 }} />
    </motion.div>
  );
}

// Main register page ──────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [username,        setUsername]        = useState("");
  const [email,           setEmail]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw,          setShowPw]          = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [isLoading,       setIsLoading]       = useState(false);
  const [error,           setError]           = useState("");

  const router   = useRouter();
  const { register, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username || !email || !password) { setError("Please fill in all fields."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (!/[A-Z]/.test(password)) { setError("Password must contain at least one uppercase letter."); return; }
    if (!/[0-9]/.test(password)) { setError("Password must contain at least one number."); return; }
    setIsLoading(true);
    try {
      await register(username, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(getApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(112,0,255,0.05)_0%,_transparent_70%)]" />

      <div className="relative z-10 flex w-full max-w-6xl mx-auto px-4 gap-12 items-center">
        {/* Left — 3D */}
        <motion.div className="hidden lg:flex flex-1 flex-col items-center justify-center"
          initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
          <div className="w-[360px] h-[360px]">
            <Canvas camera={{ position: [0, 0, 7], fov: 50 }} gl={{ antialias: true, alpha: true }}>
              <ambientLight intensity={0.3} />
              <pointLight position={[5, 5, 5]} color="#7000ff" intensity={2} />
              <pointLight position={[-5, -5, 5]} color="#00f0ff" intensity={1} />
              <RegisterScene />
            </Canvas>
          </div>
          <motion.div className="mt-6 text-center"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <NeonText size="xl" color="purple" flicker>INITIALIZE IDENTITY</NeonText>
            <p className="mt-3 text-gray-400 text-sm tracking-widest">JOIN THE SECURE NETWORK</p>
          </motion.div>
        </motion.div>

        {/* Right — form */}
        <motion.div className="flex-1 max-w-md"
          initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
          <HologramCard className="p-8">
            <div className="glass-panel-strong rounded-2xl p-8 relative overflow-hidden">
              {["absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-cyber-purple/50",
                "absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-cyber-purple/50",
                "absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-cyber-purple/50",
                "absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-cyber-purple/50",
              ].map((cls, i) => <div key={i} className={cls} />)}

              <div className="text-center mb-6">
                <NeonText size="xl" color="purple">CREATE ACCOUNT</NeonText>
                <p className="text-gray-400 text-sm mt-2">Initialize your node identity</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <CyberInput type="text" placeholder="Username (letters, numbers, _)"
                  icon={User} value={username} onChange={setUsername} autoComplete="username" />
                <CyberInput type="email" placeholder="user@example.com"
                  icon={Mail} value={email} onChange={setEmail} autoComplete="email" />
                <div>
                  <CyberInput type={showPw ? "text" : "password"} placeholder="Access key (min 8 chars)"
                    icon={Lock} value={password} onChange={setPassword}
                    showToggle onToggle={() => setShowPw(!showPw)} autoComplete="new-password" />
                  <PasswordStrength password={password} />
                </div>
                <CyberInput type={showConfirm ? "text" : "password"} placeholder="Confirm access key"
                  icon={Lock} value={confirmPassword} onChange={setConfirmPassword}
                  showToggle onToggle={() => setShowConfirm(!showConfirm)} autoComplete="new-password" />

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                    >{error}</motion.div>
                  )}
                </AnimatePresence>

                <motion.button type="submit" disabled={isLoading}
                  className="w-full relative group mt-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyber-purple via-cyber-cyan to-cyber-magenta rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative flex items-center justify-center gap-2 px-6 py-3 bg-cyber-panel rounded-xl border border-cyber-purple/30 text-white font-medium">
                    {isLoading ? (
                      <motion.div className="w-5 h-5 border-2 border-cyber-purple border-t-transparent rounded-full"
                        animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                    ) : (
                      <><Zap size={18} className="text-cyber-purple" /><span>Create Account</span><ChevronRight size={18} className="text-cyber-purple" /></>
                    )}
                  </div>
                </motion.button>
              </form>

              <div className="mt-5 pt-4 border-t border-cyber-border/30 text-center">
                <p className="text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-cyber-cyan hover:text-cyber-magenta transition-colors font-medium">
                    Sign in →
                  </Link>
                </p>
              </div>
            </div>
          </HologramCard>
        </motion.div>
      </div>
    </div>
  );
}
