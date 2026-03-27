"use client";

import { PATTERNS, PROBLEM_LISTS, DIFFICULTY_COLORS } from "@/lib/constants";

type Difficulty = "Easy" | "Medium" | "Hard";

interface ProblemFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  difficulties: Set<Difficulty>;
  onToggleDifficulty: (d: Difficulty) => void;
  pattern: string;
  onPatternChange: (value: string) => void;
  list: string;
  onListChange: (value: string) => void;
  resultCount: number;
  totalCount: number;
}

const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];

export function ProblemFilters({
  search,
  onSearchChange,
  difficulties,
  onToggleDifficulty,
  pattern,
  onPatternChange,
  list,
  onListChange,
  resultCount,
  totalCount,
}: ProblemFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search by title or number..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-[#131A2B] border border-[#1E2A3F] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#3A4A5C] focus:outline-none focus:border-[#00D4FF] transition-colors"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#3A4A5C]">
          {resultCount} / {totalCount}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => onToggleDifficulty(d)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                difficulties.has(d)
                  ? "border-transparent text-[#0B0F1A]"
                  : "border-[#1E2A3F] text-[#3A4A5C]"
              }`}
              style={{
                backgroundColor: difficulties.has(d)
                  ? DIFFICULTY_COLORS[d]
                  : "transparent",
              }}
            >
              {d}
            </button>
          ))}
        </div>

        <select
          value={pattern}
          onChange={(e) => onPatternChange(e.target.value)}
          className="bg-[#131A2B] border border-[#1E2A3F] rounded-lg px-3 py-1.5 text-xs text-white"
        >
          <option value="All">All Patterns</option>
          {PATTERNS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          value={list}
          onChange={(e) => onListChange(e.target.value)}
          className="bg-[#131A2B] border border-[#1E2A3F] rounded-lg px-3 py-1.5 text-xs text-white"
        >
          <option value="All">All Lists</option>
          {PROBLEM_LISTS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
