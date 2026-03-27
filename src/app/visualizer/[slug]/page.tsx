"use client";

import { use } from "react";
import Link from "next/link";
import { useAlgorithm } from "@/hooks/use-algorithm";
import { usePlayback } from "@/hooks/use-playback";
import { TopBar } from "@/components/top-bar";
import { PlaybackControls } from "@/components/playback-controls";
import { PresetSelector } from "@/components/preset-selector";
import { VisualizerView } from "@/components/visualizer-view";

export default function VisualizerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { algorithm, steps, presetIndex, selectPreset, loading } = useAlgorithm(slug);
  const playback = usePlayback(steps);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-[#00D4FF] text-lg">Loading...</span>
      </div>
    );
  }

  if (!algorithm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#8899AA] mb-4">Algorithm not found</p>
          <Link href="/" className="text-[#00D4FF] hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar>
        <PlaybackControls
          isPlaying={playback.isPlaying}
          speed={playback.speed}
          currentStep={playback.currentStep}
          totalSteps={playback.totalSteps}
          onPlay={playback.play}
          onPause={playback.pause}
          onStepForward={playback.stepForward}
          onStepBackward={playback.stepBackward}
          onReset={playback.reset}
          onSpeedChange={playback.setSpeed}
        />
      </TopBar>
      <main className="flex-1 flex flex-col p-6 gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-[#8899AA] hover:text-[#00D4FF] transition-colors"
            >
              ← Back
            </Link>
            <h1 className="text-2xl font-bold">{algorithm.name}</h1>
          </div>
          <PresetSelector
            presets={algorithm.presets}
            selectedIndex={presetIndex}
            onSelect={(i) => {
              selectPreset(i);
              playback.reset();
            }}
          />
        </div>
        <VisualizerView
          algorithm={algorithm}
          presetData={algorithm.presets[presetIndex].data}
          currentStep={playback.currentStepData}
        />
      </main>
    </div>
  );
}
