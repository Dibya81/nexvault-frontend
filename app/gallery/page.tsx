"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";
import * as THREE from "three";
import { X, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { NeonText } from "@/components/effects/NeonText";

// 3D Image Card in Gallery
function GalleryImage({ 
  url, 
  position, 
  rotation, 
  scale, 
  isActive, 
  onClick 
}: {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load(url);
  }, [url]);

  useFrame((state) => {
    if (!meshRef.current) return;

    if (isActive) {
      meshRef.current.position.lerp(new THREE.Vector3(0, 0, 3), 0.1);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, 0.1);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.1);
      meshRef.current.scale.lerp(new THREE.Vector3(2.5, 2.5, 1), 0.1);
    } else {
      meshRef.current.position.lerp(new THREE.Vector3(...position), 0.1);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, rotation[0], 0.1);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, rotation[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1, 0.1);
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, 1), 0.1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={[scale, scale, 1]}
      onClick={onClick}
    >
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        ref={materialRef}
        map={texture}
        transparent
        opacity={0.9}
        side={THREE.DoubleSide}
      />
      {/* Glow border */}
      <mesh position={[0, 0, -0.01]} scale={[1.05, 1.05, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color={isActive ? "#00f0ff" : "#7000ff"}
          transparent
          opacity={0.2}
        />
      </mesh>
    </mesh>
  );
}

// Gallery Scene
function GalleryScene({ 
  images, 
  activeIndex, 
  onSelect 
}: {
  images: string[];
  activeIndex: number | null;
  onSelect: (index: number | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Arrange images in a spiral
  const imagePositions = useMemo(() => {
    return images.map((_, i) => {
      const angle = (i / images.length) * Math.PI * 4;
      const radius = 3 + (i / images.length) * 2;
      const y = (i - images.length / 2) * 0.8;
      return {
        position: [
          Math.cos(angle) * radius,
          y,
          Math.sin(angle) * radius - 5,
        ] as [number, number, number],
        rotation: [0, -angle + Math.PI / 2, 0] as [number, number, number],
        scale: 0.8 + Math.random() * 0.4,
      };
    });
  }, [images]);

  useFrame((state) => {
    if (groupRef.current && activeIndex === null) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      {images.map((url, i) => (
        <GalleryImage
          key={i}
          url={url}
          position={imagePositions[i].position}
          rotation={imagePositions[i].rotation}
          scale={imagePositions[i].scale}
          isActive={activeIndex === i}
          onClick={() => onSelect(activeIndex === i ? null : i)}
        />
      ))}

      {/* Ambient particles */}
      <Particles count={100} />
    </group>
  );
}

function Particles({ count = 100 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      posArray[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.002;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y += 0.001;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#00f0ff"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Lightbox Overlay
function Lightbox({ 
  image, 
  onClose, 
  onNext, 
  onPrev 
}: {
  image: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl"
      onClick={onClose}
    >
      {/* Close button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        className="absolute top-6 right-6 p-3 rounded-full glass-panel text-white hover:bg-cyber-red/20 hover:text-cyber-red transition-colors z-10"
        onClick={onClose}
      >
        <X size={24} />
      </motion.button>

      {/* Navigation */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full glass-panel text-white hover:bg-cyber-cyan/20 hover:text-cyber-cyan transition-colors z-10"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
      >
        <ChevronLeft size={24} />
      </motion.button>

      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full glass-panel text-white hover:bg-cyber-cyan/20 hover:text-cyber-cyan transition-colors z-10"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
      >
        <ChevronRight size={24} />
      </motion.button>

      {/* Image */}
      <motion.img
        key={image}
        initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        src={image}
        alt="Gallery"
        className="max-w-[80vw] max-h-[80vh] object-contain rounded-2xl"
        style={{
          boxShadow: "0 0 60px rgba(0, 240, 255, 0.2), 0 0 120px rgba(112, 0, 255, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      />

      {/* Decorative frame */}
      <div className="absolute inset-8 border border-cyber-cyan/10 rounded-3xl pointer-events-none" />
      <div className="absolute inset-12 border border-cyber-purple/10 rounded-2xl pointer-events-none" />
    </motion.div>
  );
}

// Main Gallery Page
export default function GalleryPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"3d" | "grid">("3d");

  // Demo images - replace with actual API data
  const images = [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
    "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800",
    "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800",
    "https://images.unsplash.com/photo-1614851099511-773084f6911d?w=800",
    "https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=800",
    "https://images.unsplash.com/photo-1614853316476-de00d14cb1fc?w=800",
    "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800",
    "https://images.unsplash.com/photo-1614854262318-831574f15f1a?w=800",
  ];

  const handleNext = () => {
    if (activeIndex !== null) {
      setActiveIndex((activeIndex + 1) % images.length);
    }
  };

  const handlePrev = () => {
    if (activeIndex !== null) {
      setActiveIndex((activeIndex - 1 + images.length) % images.length);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeIndex === null) return;
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") setActiveIndex(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 lg:p-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <NeonText size="xl" color="magenta">
              VISUAL ARCHIVE
            </NeonText>
            <p className="text-gray-400 mt-1">3D immersive gallery experience</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("3d")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === "3d" 
                  ? "bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30" 
                  : "text-gray-500 hover:text-white"
              }`}
            >
              3D View
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === "grid" 
                  ? "bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30" 
                  : "text-gray-500 hover:text-white"
              }`}
            >
              Grid
            </button>
          </div>
        </div>
      </motion.div>

      {/* Gallery Content */}
      <AnimatePresence mode="wait">
        {viewMode === "3d" ? (
          <motion.div
            key="3d"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-[calc(100vh-200px)] relative"
          >
            <Canvas
              camera={{ position: [0, 0, 8], fov: 60 }}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} color="#00f0ff" intensity={1} />
              <pointLight position={[-10, -10, 10]} color="#ff00a0" intensity={0.5} />
              <GalleryScene 
                images={images} 
                activeIndex={activeIndex} 
                onSelect={setActiveIndex} 
              />
            </Canvas>

            {/* Instructions */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
              <p className="text-sm text-gray-500">Click on an image to view</p>
              <p className="text-xs text-gray-600 mt-1">Drag to rotate · Scroll to zoom</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-6 lg:px-8 pb-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => setActiveIndex(i)}
                >
                  <img 
                    src={image} 
                    alt={`Gallery ${i}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-white">Image {i + 1}</span>
                    <ImageIcon size={14} className="text-cyber-cyan" />
                  </div>

                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-cyber-cyan/0 group-hover:border-cyber-cyan/50 transition-colors" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-cyber-cyan/0 group-hover:border-cyber-cyan/50 transition-colors" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-cyber-cyan/0 group-hover:border-cyber-cyan/50 transition-colors" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-cyber-cyan/0 group-hover:border-cyber-cyan/50 transition-colors" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {activeIndex !== null && (
          <Lightbox
            image={images[activeIndex]}
            onClose={() => setActiveIndex(null)}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
