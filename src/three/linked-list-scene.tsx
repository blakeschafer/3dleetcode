"use client";

import { Step } from "@/algorithms/types";
import { SphereNode } from "./sphere-node";
import { EdgeLine } from "./edge-line";
import { SPACING } from "@/lib/constants";

interface LinkedListSceneProps {
  values: number[];
  step: Step | null;
}

export function LinkedListScene({ values, step }: LinkedListSceneProps) {
  const offset = ((values.length - 1) * SPACING) / 2;

  return (
    <group>
      {values.map((_, i) => {
        if (i < values.length - 1) {
          const start: [number, number, number] = [i * SPACING - offset, 0, 0];
          const end: [number, number, number] = [(i + 1) * SPACING - offset, 0, 0];
          const isActive =
            step?.highlights.includes(`node-${i}`) &&
            step?.highlights.includes(`node-${i + 1}`);

          return (
            <EdgeLine
              key={`edge-${i}`}
              start={start}
              end={end}
              active={isActive}
            />
          );
        }
        return null;
      })}
      {values.map((value, i) => {
        const id = `node-${i}`;
        const isActive = step?.highlights.includes(id) ?? false;
        const isVisited = step?.visited.includes(id) ?? false;
        const state = isActive ? "active" : isVisited ? "visited" : "default";

        return (
          <SphereNode
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
