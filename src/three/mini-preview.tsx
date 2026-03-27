"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Algorithm, ArrayPresetData, TreePresetData, LinkedListPresetData, GraphPresetData } from "@/algorithms/types";
import { ArrayScene } from "./array-scene";
import { TreeScene } from "./tree-scene";
import { LinkedListScene } from "./linked-list-scene";
import { GraphScene } from "./graph-scene";

interface MiniPreviewProps {
  algorithm: Algorithm;
}

function PreviewScene({ algorithm }: { algorithm: Algorithm }) {
  const data = algorithm.presets[0].data;

  switch (algorithm.category) {
    case "Arrays": {
      const { array } = data as ArrayPresetData;
      return <ArrayScene data={array} step={null} />;
    }
    case "Trees": {
      const { root } = data as TreePresetData;
      return <TreeScene root={root} step={null} />;
    }
    case "Linked Lists": {
      const { values } = data as LinkedListPresetData;
      return <LinkedListScene values={values} step={null} />;
    }
    case "Graphs": {
      const { nodes, edges } = data as GraphPresetData;
      return <GraphScene nodes={nodes} edges={edges} step={null} />;
    }
  }
}

export function MiniPreview({ algorithm }: MiniPreviewProps) {
  return (
    <Canvas camera={{ position: [0, 3, 8], fov: 45 }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.6} />
      <pointLight position={[-10, 5, -10]} intensity={0.2} color="#00D4FF" />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
      <PreviewScene algorithm={algorithm} />
    </Canvas>
  );
}
