"use client";

import { Preset } from "@/algorithms/types";

interface PresetSelectorProps {
  presets: Preset[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function PresetSelector({ presets, selectedIndex, onSelect }: PresetSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-[#8899AA]">Input:</span>
      <select
        value={selectedIndex}
        onChange={(e) => onSelect(Number(e.target.value))}
        className="bg-[#131A2B] border border-[#1E2A3F] rounded px-2 py-1 text-xs text-white"
      >
        {presets.map((p, i) => (
          <option key={i} value={i}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  );
}
