"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Algorithm, SceneType, ArrayPresetData, TreePresetData, LinkedListPresetData, GraphPresetData } from "@/algorithms/types";
import { ArrayScene } from "./array-scene";
import { TreeScene } from "./tree-scene";
import { LinkedListScene } from "./linked-list-scene";
import { GraphScene } from "./graph-scene";

interface MiniPreviewProps {
  algorithm: Algorithm;
}

function getSceneType(algorithm: Algorithm): SceneType {
  if (algorithm.sceneType) return algorithm.sceneType;
  switch (algorithm.category) {
    case "Arrays": return "array";
    case "Trees": return "tree";
    case "Linked Lists": return "linked-list";
    case "Graphs": return "graph";
  }
}

function PreviewScene({ algorithm }: { algorithm: Algorithm }) {
  const data = algorithm.presets[0].data;
  const scene = getSceneType(algorithm);

  try {
    switch (scene) {
      case "array": {
        const { array } = data as ArrayPresetData;
        if (!array || !Array.isArray(array)) return null;
        return <ArrayScene data={array} step={null} />;
      }
      case "tree": {
        const { root } = data as TreePresetData;
        if (!root) return null;
        return <TreeScene root={root} step={null} />;
      }
      case "linked-list": {
        const { values } = data as LinkedListPresetData;
        if (!values || !Array.isArray(values)) return null;
        return <LinkedListScene values={values} step={null} />;
      }
      case "graph": {
        const { nodes, edges } = data as GraphPresetData;
        if (!nodes || !edges) return null;
        return <GraphScene nodes={nodes} edges={edges} step={null} />;
      }
    }
  } catch {
    return null;
  }
}

export function MiniPreview({ algorithm }: MiniPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full">
      {isVisible ? (
        <Canvas camera={{ position: [0, 3, 8], fov: 45 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={0.6} />
          <pointLight position={[-10, 5, -10]} intensity={0.2} color="#00D4FF" />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
          <PreviewScene algorithm={algorithm} />
        </Canvas>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#1E2A3F] border-t-[#00D4FF] rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
