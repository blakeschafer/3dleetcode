"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { COLORS, NODE_SIZE } from "@/lib/constants";

interface CubeNodeProps {
  position: [number, number, number];
  value: number | string;
  state: "default" | "active" | "visited";
}

export function CubeNode({ position, value, state }: CubeNodeProps) {
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
        <boxGeometry args={[NODE_SIZE, NODE_SIZE, NODE_SIZE]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={0.9}
        />
      </mesh>
      <Text
        position={[position[0], position[1] + NODE_SIZE * 0.8, position[2]]}
        fontSize={0.4}
        color={COLORS.textPrimary}
        anchorX="center"
        anchorY="middle"
      >
        {String(value)}
      </Text>
    </group>
  );
}
