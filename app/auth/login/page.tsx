"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, Zap, ChevronRight, Fingerprint } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAuthStore } from "@/store/auth";
import { NeonText } from "@/components/effects/NeonText";
import { HologramCard } from "@/components/effects/HologramCard";
import { getApiError } from "@/lib/api";

// 3D Floating Crystal ─────────────────────────────────────────────────────────
function FloatingCrystal() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color("#00f0ff") },
    uColor2: { value: new THREE.Color("#7000ff") },
    uColor3: { value: new THREE.Color("#ff00a0") },
  }), []);

  const vertexShader = `
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec3 pos = position;
      pos += normal * sin(pos.y * 3.0 + uTime * 2.0) * 0.1;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;
  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor1; uniform vec3 uColor2; uniform vec3 uColor3;
    varying vec2 vUv; varying vec3 vNormal;
    void main() {
      float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
      vec3 color = mix(uColor1, uColor2, vUv.y + sin(uTime) * 0.5);
      color = mix(color, uColor3, vUv.x + cos(uTime * 0.7) * 0.5);
      color += vec3(fresnel) * 0.5;
      gl_FragColor = vec4(color, fresnel * 0.8 + 0.2);
    }
  `;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
    if (materialRef.current)
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// Particle ring canvas ────────────────────────────────────────────────────────
function ParticleRing() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 400; canvas.height = 400;
    const particles = Array.from({ length: 60 }, (_, i) => ({
      angle: (i / 60) * Math.PI * 2,
      radius: 150 + Math.random() * 30,
      speed: 0.002 + Math.random() * 0.003,
      size: 1 + Math.random() * 2,
    }));
    let id: number;
    const draw = () => {
      ctx.clearRect(0, 0, 400, 400);
      const cx = 200; const cy = 200;
      particles.forEach((p) => {
        p.angle += p.speed;
        const x = cx + Math.cos(p.angle) * p.radius;
        const y = cy + Math.sin(p.angle) * p.radius;
        const g = ctx.createRadialGradient(x, y, 0, x, y, p.size * 3);
        g.addColorStop(0, "rgba(0,240,255,0.8)");
        g.addColorStop(1, "rgba(0,240,255,0)");
        ctx.beginPath(); ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
      });
      ctx.strokeStyle = "rgba(0,240,255,0.05)"; ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++)
        for (let j = i + 1; j < particles.length; j++) {
          const ax = cx + Math.cos(particles[i].angle) * particles[i].radius;
          const ay = cy + Math.sin(particles[i].angle) * particles[i].radius;
          const bx = cx + Math.cos(particles[j].angle) * particles[j].radius;
          const by = cy + Math.sin(particles[j].angle) * particles[j].radius;
          if (Math.hypot(bx - ax, by - ay) < 80) {
            ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
          }
        }
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
    />
  );
}

// Cyber input ─────────────────────────────────────────────────────────────────
function CyberInput({
  type, placeholder, icon: Icon, value, onChange, showToggle, onToggle,
}: {
  type: string; placeholder: string; icon: any;
  value: string; onChange: (v: string) => void;
  showToggle?: boolean; onToggle?: () => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <motion.div
      className="relative"
      animate={{ scale: focused ? 1.02 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className={`relative flex items-center gap-3 px-4 py-3 rounded-xl
        bg-cyber-panel/50 border transition-all duration-300
        ${focused ? "border-cyber-cyan/50 shadow-[0_0_20px_rgba(0,240,255,0.15)]" : "border-cyber-border/30"}`}>
        <Icon size={18} className={focused ? "text-cyber-cyan" : "text-gray-500"} />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoComplete={type === "password" ? "current-password" : "email"}
          className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 text-sm"
        />
        {showToggle && (
          <button type="button" onClick={onToggle} className="text-gray-500 hover:text-cyber-cyan transition-colors">
            {type === "password" ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      <motion.div
        className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-magenta"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

// Main login page ─────────────────────────────────────────────────────────────
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setIsLoading(true);
    setError("");
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(getApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,240,255,0.05)_0%,_transparent_70%)]" />
        <ParticleRing />
      </div>

      <div className="relative z-10 flex w-full max-w-6xl mx-auto px-4 gap-12 items-center">
        {/* Left — 3D visual */}
        <motion.div
          className="hidden lg:flex flex-1 flex-col items-center justify-center"
          initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="w-[400px] h-[400px]">
            <Canvas camera={{ position: [0, 0, 6], fov: 50 }} gl={{ antialias: true, alpha: true }}>
              <ambientLight intensity={0.2} />
              <pointLight position={[5, 5, 5]} color="#00f0ff" intensity={1} />
              <pointLight position={[-5, -5, 5]} color="#ff00a0" intensity={1} />
              <FloatingCrystal />
            </Canvas>
          </div>
          <motion.div className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <NeonText size="2xl" glitch flicker>CYBER CLOUD</NeonText>
            <p className="mt-4 text-gray-400 text-sm tracking-widest">NEXT-GENERATION SECURE STORAGE</p>
            <div className="mt-6 flex gap-4 justify-center">
              {["ENCRYPTED", "SELF-HOSTED", "QUANTUM-READY"].map((tag, i) => (
                <motion.span key={tag}
                  className="px-3 py-1 text-xs border border-cyber-cyan/30 rounded-full text-cyber-cyan/70"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}>
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Right — form */}
        <motion.div className="flex-1 max-w-md"
          initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}>
          <HologramCard className="p-8">
            <div className="glass-panel-strong rounded-2xl p-8 relative overflow-hidden">
              {["absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-cyber-cyan/50",
                "absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-cyber-cyan/50",
                "absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-cyber-cyan/50",
                "absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-cyber-cyan/50",
              ].map((cls, i) => <div key={i} className={cls} />)}

              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20 border border-cyber-cyan/30 mb-4"
                >
                  <Fingerprint className="w-8 h-8 text-cyber-cyan" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-2">Access Terminal</h2>
                <p className="text-gray-400 text-sm">Enter credentials to proceed</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <CyberInput type="email" placeholder="user@cybercloud.io"
                  icon={Mail} value={email} onChange={setEmail} />
                <CyberInput
                  type={showPassword ? "text" : "password"}
                  placeholder="Access Key" icon={Lock}
                  value={password} onChange={setPassword}
                  showToggle onToggle={() => setShowPassword(!showPassword)}
                />

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button type="submit" disabled={isLoading}
                  className="w-full relative group" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-magenta rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative flex items-center justify-center gap-2 px-6 py-3 bg-cyber-panel rounded-xl border border-cyber-cyan/30 text-white font-medium overflow-hidden">
                    {isLoading ? (
                      <motion.div className="w-5 h-5 border-2 border-cyber-cyan border-t-transparent rounded-full"
                        animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                    ) : (
                      <><Zap size={18} className="text-cyber-cyan" /><span>Authenticate</span><ChevronRight size={18} className="text-cyber-cyan" /></>
                    )}
                  </div>
                </motion.button>
              </form>

              <div className="mt-6 pt-4 border-t border-cyber-border/30 text-center">
                <p className="text-sm text-gray-500">
                  No account?{" "}
                  <Link href="/auth/register" className="text-cyber-cyan hover:text-cyber-magenta transition-colors font-medium">
                    Create identity →
                  </Link>
                </p>
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">Secured with AES-256 Encryption</p>
                <div className="mt-2 flex justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
                  <span className="text-xs text-cyber-green">System Online</span>
                </div>
              </div>
            </div>
          </HologramCard>
        </motion.div>
      </div>
    </div>
  );
}
