"use client";

import { Step, TreeNode } from "@/algorithms/types";
import { SphereNode } from "./sphere-node";
import { EdgeLine } from "./edge-line";

interface TreeSceneProps {
  root: TreeNode;
  step: Step | null;
}

interface FlatNode {
  id: string;
  value: number;
  position: [number, number, number];
  parentPosition?: [number, number, number];
}

function flattenTree(
  node: TreeNode | undefined,
  prefix: string,
  depth: number,
  xOffset: number,
  spread: number,
  result: FlatNode[],
  parentPos?: [number, number, number]
): void {
  if (!node) return;
  const pos: [number, number, number] = [xOffset, -depth * 2, 0];
  result.push({ id: prefix, value: node.value, position: pos, parentPosition: parentPos });
  flattenTree(node.left, `${prefix}-L`, depth + 1, xOffset - spread, spread / 2, result, pos);
  flattenTree(node.right, `${prefix}-R`, depth + 1, xOffset + spread, spread / 2, result, pos);
}

export function TreeScene({ root, step }: TreeSceneProps) {
  const nodes: FlatNode[] = [];
  flattenTree(root, "root", 0, 0, 3, nodes);

  return (
    <group>
      {nodes.map((node) => {
        if (node.parentPosition) {
          return (
            <EdgeLine
              key={`edge-${node.id}`}
              start={node.parentPosition}
              end={node.position}
              active={step?.highlights.includes(node.id)}
            />
          );
        }
        return null;
      })}
      {nodes.map((node) => {
        const isActive = step?.highlights.includes(node.id) ?? false;
        const isVisited = step?.visited.includes(node.id) ?? false;
        const state = isActive ? "active" : isVisited ? "visited" : "default";

        return (
          <SphereNode
            key={node.id}
            position={node.position}
            value={node.value}
            state={state}
          />
        );
      })}
    </group>
  );
}
