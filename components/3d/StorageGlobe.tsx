"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Globe({ percentage }: { percentage: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPercentage: { value: percentage / 100 },
    uColorEmpty: { value: new THREE.Color("#1a1a2e") },
    uColorFill: { value: new THREE.Color("#00f0ff") },
    uColorFull: { value: new THREE.Color("#ff00a0") },
  }), [percentage]);

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform float uPercentage;
    uniform vec3 uColorEmpty;
    uniform vec3 uColorFill;
    uniform vec3 uColorFull;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      float gridX = smoothstep(0.98, 1.0, abs(sin(vUv.x * 30.0)));
      float gridY = smoothstep(0.98, 1.0, abs(sin(vUv.y * 30.0)));
      float grid = max(gridX, gridY);

      float fillLevel = smoothstep(-1.0 + uPercentage * 2.0, -1.0 + uPercentage * 2.0 + 0.1, vPosition.y);

      vec3 color = mix(uColorEmpty, uColorFill, fillLevel);

      float fillLine = abs(vPosition.y - (-1.0 + uPercentage * 2.0));
      float glow = smoothstep(0.3, 0.0, fillLine) * 0.5;
      color += uColorFull * glow;

      float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
      color += uColorFill * fresnel * 0.3;

      color = mix(color, uColorFill * 0.5, grid * 0.3);

      float pulse = sin(uTime * 2.0) * 0.5 + 0.5;
      color += uColorFill * pulse * 0.05;

      float alpha = 0.8 + fresnel * 0.2;

      gl_FragColor = vec4(color, alpha);
    }
  `;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
    }
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function OrbitingParticles({ count = 50 }: { count?: number }) {
  const particlesRef = useRef<THREE.Points>(null);

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 2 + Math.random() * 0.5;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      speeds[i] = 0.5 + Math.random() * 0.5;
    }

    return { positions, speeds };
  }, [count]);

  useFrame((state) => {
    if (!particlesRef.current) return;
    const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + state.clock.elapsedTime * speeds[i] * 0.2;
      const radius = 2 + Math.sin(state.clock.elapsedTime * speeds[i] + i) * 0.2;
      posArray[i * 3] = Math.cos(angle) * radius;
      posArray[i * 3 + 2] = Math.sin(angle) * radius;
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#00f0ff"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function StorageGlobe({ percentage }: { percentage: number }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} color="#00f0ff" intensity={1} />
      <pointLight position={[-5, -5, 5]} color="#ff00a0" intensity={0.5} />
      <Globe percentage={percentage} />
      <OrbitingParticles />
    </Canvas>
  );
}
