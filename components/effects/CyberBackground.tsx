"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function GridFloor() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color("#00f0ff") },
      uColor2: { value: new THREE.Color("#7000ff") },
      uColor3: { value: new THREE.Color("#ff00a0") },
    }),
    []
  );

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    varying vec2 vUv;
    varying vec3 vPosition;

    float grid(vec2 uv, float lines) {
      vec2 grid = abs(fract(uv * lines - 0.5) - 0.5) / fwidth(uv * lines);
      float line = min(grid.x, grid.y);
      return 1.0 - min(line, 1.0);
    }

    void main() {
      vec2 uv = vUv * 20.0;

      // Moving grid
      float time = uTime * 0.3;
      vec2 movingUv = uv + vec2(0.0, time);

      float gridPattern = grid(movingUv, 1.0);

      // Color mixing based on position
      float colorMix = sin(vPosition.x * 0.5 + uTime * 0.5) * 0.5 + 0.5;
      vec3 color = mix(uColor1, uColor2, colorMix);
      color = mix(color, uColor3, sin(vPosition.z * 0.3 + uTime * 0.3) * 0.5 + 0.5);

      // Fade with distance
      float fade = 1.0 - smoothstep(0.0, 1.0, length(vPosition.xz) * 0.15);

      // Grid glow
      float glow = gridPattern * 0.3 * fade;

      // Horizon fade
      float horizonFade = smoothstep(0.0, 0.3, vUv.y);

      gl_FragColor = vec4(color * glow * horizonFade, glow * 0.5 * horizonFade);
    }
  `;

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[50, 50, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function FloatingOrbs() {
  const groupRef = useRef<THREE.Group>(null);
  const orbs = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 30,
        Math.random() * 10 - 2,
        (Math.random() - 0.5) * 20,
      ] as [number, number, number],
      scale: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.5 + 0.2,
      offset: Math.random() * Math.PI * 2,
      color: ["#00f0ff", "#7000ff", "#ff00a0", "#00ff88"][Math.floor(Math.random() * 4)],
    }));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const orb = orbs[i];
        child.position.y = orb.position[1] + Math.sin(state.clock.elapsedTime * orb.speed + orb.offset) * 1.5;
        child.rotation.x += 0.01;
        child.rotation.y += 0.01;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {orbs.map((orb, i) => (
        <mesh key={i} position={orb.position} scale={orb.scale}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial
            color={orb.color}
            transparent
            opacity={0.3}
          />
          <pointLight color={orb.color} intensity={0.5} distance={5} />
        </mesh>
      ))}
    </group>
  );
}

function MovingLight() {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 10;
      lightRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.5) * 10;
      lightRef.current.position.y = 5 + Math.sin(state.clock.elapsedTime * 0.3) * 2;
    }
  });

  return (
    <pointLight
      ref={lightRef}
      color="#00f0ff"
      intensity={2}
      distance={30}
      decay={2}
    />
  );
}

export function CyberBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 5, 15], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <fog attach="fog" args={["#0a0a0f", 10, 40]} />
        <ambientLight intensity={0.1} />
        <MovingLight />
        <GridFloor />
        <FloatingOrbs />
      </Canvas>
    </div>
  );
}
