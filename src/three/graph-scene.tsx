"use client";

import { Step } from "@/algorithms/types";
import { SphereNode } from "./sphere-node";
import { EdgeLine } from "./edge-line";

interface GraphSceneProps {
  nodes: string[];
  edges: [string, string][];
  step: Step | null;
}

function layoutGraphNodes(nodeNames: string[]): Record<string, [number, number, number]> {
  const positions: Record<string, [number, number, number]> = {};
  const count = nodeNames.length;
  const radius = Math.max(2, count * 0.8);

  nodeNames.forEach((name, i) => {
    const angle = (i / count) * Math.PI * 2;
    positions[name] = [
      Math.cos(angle) * radius,
      Math.sin(angle) * radius * 0.5,
      Math.sin(angle) * radius * 0.3,
    ];
  });

  return positions;
}

export function GraphScene({ nodes, edges, step }: GraphSceneProps) {
  const positions = layoutGraphNodes(nodes);

  return (
    <group>
      {edges.map(([a, b], i) => {
        const active =
          step?.highlights.includes(`node-${a}`) &&
          step?.highlights.includes(`node-${b}`);

        return (
          <EdgeLine
            key={`edge-${i}`}
            start={positions[a]}
            end={positions[b]}
            active={active}
          />
        );
      })}
      {nodes.map((name) => {
        const id = `node-${name}`;
        const isActive = step?.highlights.includes(id) ?? false;
        const isVisited = step?.visited.includes(id) ?? false;
        const state = isActive ? "active" : isVisited ? "visited" : "default";

        return (
          <SphereNode
            key={name}
            position={positions[name]}
            value={name}
            state={state}
          />
        );
      })}
    </group>
  );
}
