"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";

export function SceneWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Canvas camera={{ position: [0, 5, 12], fov: 50 }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, 5, -10]} intensity={0.3} color="#00D4FF" />
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={3}
        maxDistance={30}
      />
      <Grid
        infiniteGrid
        fadeDistance={30}
        fadeStrength={2}
        cellSize={1}
        sectionSize={5}
        cellColor="#1E2A3F"
        sectionColor="#1E2A3F"
      />
      {children}
    </Canvas>
  );
}
