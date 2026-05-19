"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ArrowRight, Shield, Zap, Globe, Lock, Cpu, ChevronDown } from "lucide-react";
import { NeonText } from "@/components/effects/NeonText";

// Hero 3D Scene
function HeroScene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central core */}
      <mesh>
        <octahedronGeometry args={[1, 2]} />
        <meshStandardMaterial
          color="#00f0ff"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={2}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Orbiting rings */}
      {[1.5, 2.5, 3.5].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, i * Math.PI / 3]}>
          <torusGeometry args={[radius, 0.02, 16, 100]} />
          <meshStandardMaterial
            color={i === 0 ? "#00f0ff" : i === 1 ? "#7000ff" : "#ff00a0"}
            emissive={i === 0 ? "#00f0ff" : i === 1 ? "#7000ff" : "#ff00a0"}
            emissiveIntensity={1}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}

      {/* Floating particles */}
      {Array.from({ length: 50 }).map((_, i) => (
        <mesh
          key={`p-${i}`}
          position={[
            Math.cos(i * 0.5) * (2 + Math.random() * 2),
            Math.sin(i * 0.7) * (1 + Math.random()),
            Math.sin(i * 0.3) * (2 + Math.random() * 2),
          ]}
        >
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial
            color="#00f0ff"
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

// Feature Card
function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  color, 
  delay 
}: {
  icon: any;
  title: string;
  description: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="relative group"
    >
      <div className="glass-panel rounded-2xl p-8 relative overflow-hidden h-full">
        {/* Glow effect */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${color}15, transparent 70%)`,
          }}
        />

        <div 
          className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
          style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
        >
          <Icon size={28} style={{ color }} />
        </div>

        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>

        {/* Bottom accent */}
        <div 
          className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500"
          style={{ backgroundColor: color }}
        />
      </div>
    </motion.div>
  );
}

// Stats Counter
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className="text-4xl md:text-5xl font-bold text-cyber-cyan text-glow">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  return (
    <div ref={containerRef} className="min-h-screen overflow-y-auto">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <Canvas
            camera={{ position: [0, 0, 6], fov: 60 }}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={0.2} />
            <pointLight position={[5, 5, 5]} color="#00f0ff" intensity={2} />
            <pointLight position={[-5, -5, 5]} color="#ff00a0" intensity={1} />
            <HeroScene />
          </Canvas>
        </motion.div>

        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <NeonText size="2xl" color="cyan" glitch flicker>
              CYBER CLOUD
            </NeonText>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-gray-300 mt-6 max-w-2xl mx-auto"
          >
            Next-generation secure storage with
            <span className="text-cyber-cyan"> quantum-grade encryption</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-10 flex gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/auth/login")}
              className="relative group px-8 py-4 rounded-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-magenta opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-2 text-white font-bold">
                <span>Initialize System</span>
                <ArrowRight size={20} />
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/dashboard")}
              className="px-8 py-4 rounded-xl glass-panel text-white font-bold hover:bg-white/5 transition-colors border border-cyber-cyan/30"
            >
              Access Terminal
            </motion.button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-gray-500"
            >
              <span className="text-xs tracking-widest">SCROLL</span>
              <ChevronDown size={20} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 10000, suffix: "+", label: "Files Stored", color: "#00f0ff" },
              { value: 99.9, suffix: "%", label: "Uptime", color: "#00ff88" },
              { value: 256, suffix: "-bit", label: "Encryption", color: "#7000ff" },
              { value: 50, suffix: "TB", label: "Total Storage", color: "#ff00a0" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <span 
                  className="text-4xl md:text-5xl font-bold text-glow block"
                  style={{ color: stat.color }}
                >
                  {stat.value.toLocaleString()}{stat.suffix}
                </span>
                <p className="text-gray-400 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <NeonText size="xl" color="purple">
              CORE CAPABILITIES
            </NeonText>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Advanced features designed for the modern digital frontier
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Shield}
              title="Quantum Encryption"
              description="Military-grade AES-256 encryption with quantum-resistant algorithms protecting your data at rest and in transit."
              color="#00f0ff"
              delay={0}
            />
            <FeatureCard
              icon={Zap}
              title="Lightning Uploads"
              description="Optimized transfer protocols with parallel chunking and intelligent compression for maximum speed."
              color="#ffea00"
              delay={0.1}
            />
            <FeatureCard
              icon={Globe}
              title="Global Distribution"
              description="Decentralized storage nodes across multiple regions ensuring 99.99% availability and low latency."
              color="#00ff88"
              delay={0.2}
            />
            <FeatureCard
              icon={Lock}
              title="Zero-Knowledge"
              description="Your encryption keys never leave your device. We cannot access your data, even if compelled."
              color="#7000ff"
              delay={0.3}
            />
            <FeatureCard
              icon={Cpu}
              title="AI Organization"
              description="Machine learning algorithms automatically categorize, tag, and organize your files intelligently."
              color="#ff00a0"
              delay={0.4}
            />
            <FeatureCard
              icon={Shield}
              title="Self-Hosted"
              description="Complete control over your infrastructure. Deploy on your own hardware with full customization."
              color="#00f0ff"
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-cyan/5 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <NeonText size="xl" color="cyan">
            READY TO DEPLOY?
          </NeonText>
          <p className="text-gray-400 mt-4 mb-8 max-w-xl mx-auto">
            Join the next generation of secure cloud storage. Your data deserves better.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/auth/login")}
            className="px-10 py-5 rounded-xl bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-magenta text-white font-bold text-lg shadow-[0_0_40px_rgba(0,240,255,0.3)]"
          >
            Initialize Your Node
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-cyber-border/30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-cyber-cyan font-bold">CYBER</span>
            <span className="text-cyber-magenta font-bold">CLOUD</span>
          </div>
          <p className="text-sm text-gray-500">
            © 2024 CyberCloud. All systems operational.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
            <span className="text-xs text-cyber-green">ONLINE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
