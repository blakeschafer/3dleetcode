"use client";

import { Step } from "@/algorithms/types";
import { CubeNode } from "./cube-node";
import { SPACING } from "@/lib/constants";

interface ArraySceneProps {
  data: number[];
  step: Step | null;
}

export function ArrayScene({ data, step }: ArraySceneProps) {
  const offset = ((data.length - 1) * SPACING) / 2;

  return (
    <group>
      {data.map((value, i) => {
        const id = `node-${i}`;
        const isActive = step?.highlights.includes(id) ?? false;
        const isVisited = step?.visited.includes(id) ?? false;
        const state = isActive ? "active" : isVisited ? "visited" : "default";

        return (
          <CubeNode
            key={i}
            position={[i * SPACING - offset, 0, 0]}
            value={value}
            state={state}
          />
        );
      })}
    </group>
  );
}
