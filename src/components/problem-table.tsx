"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Problem, SolvedEntry } from "@/data/types";
import { DIFFICULTY_COLORS } from "@/lib/constants";
import { MarkSolvedButton } from "./mark-solved-button";
import { useTracker } from "@/hooks/use-tracker";

interface ProblemTableProps {
  problems: Problem[];
  sortField: string;
  sortDirection: string;
  onToggleSort: (field: "id" | "title" | "difficulty") => void;
}

export function ProblemTable({
  problems,
  sortField,
  sortDirection,
  onToggleSort,
}: ProblemTableProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const tracker = useTracker();

  const sortIndicator = (field: string) => {
    if (sortField !== field) return "";
    return sortDirection === "asc" ? " ↑" : " ↓";
  };

  return (
    <div className="border border-[#1E2A3F] rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#131A2B] border-b border-[#1E2A3F]">
            <th
              onClick={() => onToggleSort("id")}
              className="px-4 py-3 text-left text-xs font-medium text-[#8899AA] cursor-pointer hover:text-white w-16"
            >
              #{sortIndicator("id")}
            </th>
            <th
              onClick={() => onToggleSort("title")}
              className="px-4 py-3 text-left text-xs font-medium text-[#8899AA] cursor-pointer hover:text-white"
            >
              Title{sortIndicator("title")}
            </th>
            <th
              onClick={() => onToggleSort("difficulty")}
              className="px-4 py-3 text-left text-xs font-medium text-[#8899AA] cursor-pointer hover:text-white w-24"
            >
              Difficulty{sortIndicator("difficulty")}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#8899AA] w-40">
              Pattern
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-[#8899AA] w-56">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem) => (
            <ProblemRow
              key={problem.id}
              problem={problem}
              isExpanded={expandedId === problem.id}
              onToggle={() =>
                setExpandedId(expandedId === problem.id ? null : problem.id)
              }
              isSolved={tracker.isSolved(problem.id)}
              solvedEntry={tracker.getSolvedEntry(problem.id)}
              onMark={tracker.markSolved}
              onUnmark={tracker.unmarkSolved}
            />
          ))}
        </tbody>
      </table>
      {problems.length === 0 && (
        <div className="px-4 py-12 text-center text-[#3A4A5C] text-sm">
          No problems match your filters
        </div>
      )}
    </div>
  );
}

function ProblemRow({
  problem,
  isExpanded,
  onToggle,
  isSolved,
  solvedEntry,
  onMark,
  onUnmark,
}: {
  problem: Problem;
  isExpanded: boolean;
  onToggle: () => void;
  isSolved: boolean;
  solvedEntry: SolvedEntry | null;
  onMark: (id: number, entry: SolvedEntry) => void;
  onUnmark: (id: number) => void;
}) {
  return (
    <>
      <tr
        onClick={onToggle}
        className={`border-b border-[#1E2A3F] cursor-pointer transition-colors ${
          isExpanded ? "bg-[#131A2B]" : "hover:bg-[#131A2B]/50"
        }`}
      >
        <td className="px-4 py-3 text-[#3A4A5C]">{problem.id}</td>
        <td className="px-4 py-3 text-white font-medium">
          {isSolved && <span className="text-green-400 mr-2">✓</span>}
          {problem.title}
        </td>
        <td className="px-4 py-3">
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{
              color: DIFFICULTY_COLORS[problem.difficulty],
              backgroundColor: `${DIFFICULTY_COLORS[problem.difficulty]}20`,
            }}
          >
            {problem.difficulty}
          </span>
        </td>
        <td className="px-4 py-3 text-xs text-[#8899AA]">{problem.pattern}</td>
        <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-end gap-2">
            {problem.visualizerSlug && (
              <Link
                href={`/visualizer/${problem.visualizerSlug}`}
                className="px-2 py-1 rounded text-xs bg-[#00D4FF]/10 text-[#00D4FF] hover:bg-[#00D4FF]/20 transition-colors"
              >
                Visualize
              </Link>
            )}
            <a
              href={problem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 rounded text-xs border border-[#1E2A3F] text-[#8899AA] hover:border-[#00D4FF] hover:text-[#00D4FF] transition-colors"
            >
              LeetCode ↗
            </a>
          </div>
        </td>
      </tr>
      <AnimatePresence>
        {isExpanded && (
          <tr>
            <td colSpan={5} className="bg-[#0D1117]">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-6 py-4 space-y-3">
                  <p className="text-sm text-[#8899AA]">{problem.summary}</p>
                  <div>
                    <p className="text-xs font-medium text-[#00D4FF] mb-2">Hints</p>
                    <ul className="space-y-1">
                      {problem.hints.map((hint, i) => (
                        <li key={i} className="text-xs text-[#8899AA] pl-4 relative">
                          <span className="absolute left-0 text-[#1E2A3F]">→</span>
                          {hint}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {problem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-[#131A2B] border border-[#1E2A3F] text-[#3A4A5C]"
                      >
                        {tag}
                      </span>
                    ))}
                    {problem.listMembership.map((l) => (
                      <span
                        key={l}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-[#1A3A5C]/30 text-[#00D4FF]"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                  <MarkSolvedButton
                    problemId={problem.id}
                    difficulty={problem.difficulty}
                    isSolved={isSolved}
                    solvedEntry={solvedEntry}
                    onMark={onMark}
                    onUnmark={onUnmark}
                  />
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
}
