"use client";

import Link from "next/link";
import { problems } from "@/data/problems";
import { DIFFICULTY_COLORS } from "@/lib/constants";

interface DailyPlanProps {
  reviewProblemIds: number[];
  solvedProblemIds: Set<number>;
}

export function DailyPlan({ reviewProblemIds, solvedProblemIds }: DailyPlanProps) {
  const reviewProblems = reviewProblemIds
    .map((id) => problems.find((p) => p.id === id))
    .filter(Boolean) as (typeof problems)[number][];

  const unsolved = problems.filter((p) => !solvedProblemIds.has(p.id));
  const suggestions = unsolved.slice(0, 3);

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="bg-[#131A2B] border border-[#1E2A3F] rounded-lg p-4">
        <h3 className="text-sm font-medium text-[#FFB800] mb-3">
          Review ({reviewProblems.length})
        </h3>
        {reviewProblems.length === 0 ? (
          <p className="text-xs text-[#3A4A5C]">No problems due for review today</p>
        ) : (
          <ul className="space-y-2">
            {reviewProblems.map((p) => (
              <li key={p.id} className="flex items-center justify-between">
                <Link
                  href="/problems"
                  className="text-sm text-[#8899AA] hover:text-white transition-colors"
                >
                  #{p.id} {p.title}
                </Link>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{
                    color: DIFFICULTY_COLORS[p.difficulty],
                    backgroundColor: `${DIFFICULTY_COLORS[p.difficulty]}20`,
                  }}
                >
                  {p.difficulty}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-[#131A2B] border border-[#1E2A3F] rounded-lg p-4">
        <h3 className="text-sm font-medium text-[#00D4FF] mb-3">Try Next</h3>
        {suggestions.length === 0 ? (
          <p className="text-xs text-[#3A4A5C]">You&apos;ve solved everything!</p>
        ) : (
          <ul className="space-y-2">
            {suggestions.map((p) => (
              <li key={p.id} className="flex items-center justify-between">
                <Link
                  href="/problems"
                  className="text-sm text-[#8899AA] hover:text-white transition-colors"
                >
                  #{p.id} {p.title}
                </Link>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{
                    color: DIFFICULTY_COLORS[p.difficulty],
                    backgroundColor: `${DIFFICULTY_COLORS[p.difficulty]}20`,
                  }}
                >
                  {p.difficulty}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
