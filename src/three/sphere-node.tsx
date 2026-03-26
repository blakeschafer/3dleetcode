"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { COLORS } from "@/lib/constants";

interface SphereNodeProps {
  position: [number, number, number];
  value: number | string;
  state: "default" | "active" | "visited";
}

export function SphereNode({ position, value, state }: SphereNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetPos = useRef(new THREE.Vector3(...position));

  targetPos.current.set(...position);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.lerp(targetPos.current, 0.1);
    }
  });

  const color =
    state === "active"
      ? COLORS.active
      : state === "visited"
        ? COLORS.visited
        : COLORS.primary;

  const emissiveIntensity = state === "active" ? 0.5 : state === "visited" ? 0.1 : 0.2;

  return (
    <group>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={0.9}
        />
      </mesh>
      <Text
        position={[position[0], position[1], position[2] + 0.6]}
        fontSize={0.35}
        color={COLORS.textPrimary}
        anchorX="center"
        anchorY="middle"
      >
        {String(value)}
      </Text>
    </group>
  );
}
