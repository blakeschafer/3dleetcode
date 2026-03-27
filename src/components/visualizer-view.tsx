"use client";

import { Algorithm, Step, ArrayPresetData, TreePresetData, LinkedListPresetData, GraphPresetData } from "@/algorithms/types";
import { SceneWrapper } from "./scene-wrapper";
import { CodePanel } from "./code-panel";
import { ArrayScene } from "@/three/array-scene";
import { TreeScene } from "@/three/tree-scene";
import { LinkedListScene } from "@/three/linked-list-scene";
import { GraphScene } from "@/three/graph-scene";

interface VisualizerViewProps {
  algorithm: Algorithm;
  presetData: unknown;
  currentStep: Step | null;
}

function SceneForAlgorithm({
  algorithm,
  presetData,
  currentStep,
}: {
  algorithm: Algorithm;
  presetData: unknown;
  currentStep: Step | null;
}) {
  switch (algorithm.category) {
    case "Arrays": {
      const { array } = presetData as ArrayPresetData;
      return <ArrayScene data={array} step={currentStep} />;
    }
    case "Trees": {
      const { root } = presetData as TreePresetData;
      return <TreeScene root={root} step={currentStep} />;
    }
    case "Linked Lists": {
      const { values } = presetData as LinkedListPresetData;
      return <LinkedListScene values={values} step={currentStep} />;
    }
    case "Graphs": {
      const { nodes, edges } = presetData as GraphPresetData;
      return <GraphScene nodes={nodes} edges={edges} step={currentStep} />;
    }
  }
}

export function VisualizerView({ algorithm, presetData, currentStep }: VisualizerViewProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
      <div className="flex-1 min-h-[400px] rounded-xl border border-[#1E2A3F] overflow-hidden bg-[#0B0F1A]">
        <SceneWrapper>
          <SceneForAlgorithm
            algorithm={algorithm}
            presetData={presetData}
            currentStep={currentStep}
          />
        </SceneWrapper>
      </div>
      <div className="w-full lg:w-[350px] min-h-[300px]">
        <CodePanel
          code={algorithm.code}
          activeCodeLine={currentStep?.activeCodeLine ?? -1}
          stepLabel={currentStep?.label ?? "Ready"}
          complexity={algorithm.complexity}
          leetcodeProblems={algorithm.leetcodeProblems}
        />
      </div>
    </div>
  );
}
