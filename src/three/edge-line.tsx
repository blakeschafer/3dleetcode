"use client";

import { Line } from "@react-three/drei";
import { COLORS } from "@/lib/constants";

interface EdgeLineProps {
  start: [number, number, number];
  end: [number, number, number];
  active?: boolean;
}

export function EdgeLine({ start, end, active = false }: EdgeLineProps) {
  return (
    <Line
      points={[start, end]}
      color={active ? COLORS.active : COLORS.surfaceBorder}
      lineWidth={active ? 2 : 1}
      opacity={active ? 1 : 0.5}
      transparent
    />
  );
}
