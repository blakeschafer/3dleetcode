"use client";

import { DIFFICULTY_COLORS } from "@/lib/constants";
import { problems } from "@/data/problems";

interface DifficultyBreakdownProps {
  solvedByDifficulty: { Easy: number; Medium: number; Hard: number };
}

export function DifficultyBreakdown({
  solvedByDifficulty,
}: DifficultyBreakdownProps) {
  const totals = {
    Easy: problems.filter((p) => p.difficulty === "Easy").length,
    Medium: problems.filter((p) => p.difficulty === "Medium").length,
    Hard: problems.filter((p) => p.difficulty === "Hard").length,
  };

  const difficulties = ["Easy", "Medium", "Hard"] as const;

  return (
    <div className="bg-[#131A2B] border border-[#1E2A3F] rounded-lg p-4">
      <h3 className="text-sm font-medium text-[#8899AA] mb-4">Difficulty Breakdown</h3>
      <div className="space-y-3">
        {difficulties.map((d) => {
          const solved = solvedByDifficulty[d];
          const total = totals[d];
          const pct = total > 0 ? (solved / total) * 100 : 0;

          return (
            <div key={d}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium" style={{ color: DIFFICULTY_COLORS[d] }}>
                  {d}
                </span>
                <span className="text-xs text-[#3A4A5C]">
                  {solved} / {total}
                </span>
              </div>
              <div className="h-2 bg-[#0B0F1A] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: DIFFICULTY_COLORS[d],
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
