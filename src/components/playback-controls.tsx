"use client";

import { SPEEDS } from "@/lib/constants";

interface PlaybackControlsProps {
  isPlaying: boolean;
  speed: number;
  currentStep: number;
  totalSteps: number;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

export function PlaybackControls({
  isPlaying,
  speed,
  currentStep,
  totalSteps,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset,
  onSpeedChange,
}: PlaybackControlsProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onReset}
        className="px-3 py-1.5 rounded bg-[#131A2B] border border-[#1E2A3F] hover:border-[#00D4FF] text-sm transition-colors"
      >
        Reset
      </button>
      <button
        onClick={onStepBackward}
        disabled={currentStep <= 0}
        className="px-3 py-1.5 rounded bg-[#131A2B] border border-[#1E2A3F] hover:border-[#00D4FF] text-sm transition-colors disabled:opacity-30"
      >
        ⏮
      </button>
      <button
        onClick={isPlaying ? onPause : onPlay}
        className="px-4 py-1.5 rounded bg-[#00D4FF] text-[#0B0F1A] font-semibold text-sm hover:bg-[#00B8E0] transition-colors"
      >
        {isPlaying ? "⏸ Pause" : "▶ Play"}
      </button>
      <button
        onClick={onStepForward}
        disabled={currentStep >= totalSteps - 1}
        className="px-3 py-1.5 rounded bg-[#131A2B] border border-[#1E2A3F] hover:border-[#00D4FF] text-sm transition-colors disabled:opacity-30"
      >
        ⏭
      </button>
      <span className="text-xs text-[#8899AA] ml-2">
        {currentStep + 1} / {totalSteps}
      </span>
      <div className="flex items-center gap-2 ml-4">
        <span className="text-xs text-[#8899AA]">Speed:</span>
        <select
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="bg-[#131A2B] border border-[#1E2A3F] rounded px-2 py-1 text-xs text-white"
        >
          {SPEEDS.map((s) => (
            <option key={s} value={s}>
              {s}x
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
