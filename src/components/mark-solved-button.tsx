"use client";

import { useState } from "react";
import { SolvedEntry } from "@/data/types";

interface MarkSolvedButtonProps {
  problemId: number;
  difficulty: "Easy" | "Medium" | "Hard";
  isSolved: boolean;
  solvedEntry: SolvedEntry | null;
  onMark: (problemId: number, entry: SolvedEntry) => void;
  onUnmark: (problemId: number) => void;
}

export function MarkSolvedButton({
  problemId,
  difficulty,
  isSolved,
  solvedEntry,
  onMark,
  onUnmark,
}: MarkSolvedButtonProps) {
  const [showForm, setShowForm] = useState(false);
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  if (isSolved && !showForm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-green-400 text-sm">✓ Solved</span>
        <span className="text-[10px] text-[#3A4A5C]">
          {solvedEntry?.solvedAt.slice(0, 10)}
        </span>
        <button
          onClick={() => onUnmark(problemId)}
          className="text-[10px] text-[#3A4A5C] hover:text-[#FF375F] transition-colors"
        >
          undo
        </button>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder="min"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-14 bg-[#0B0F1A] border border-[#1E2A3F] rounded px-2 py-1 text-xs text-white"
        />
        <input
          type="text"
          placeholder="notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-32 bg-[#0B0F1A] border border-[#1E2A3F] rounded px-2 py-1 text-xs text-white"
        />
        <button
          onClick={() => {
            onMark(problemId, {
              solvedAt: new Date().toISOString(),
              difficulty,
              timeMinutes: time ? Number(time) : undefined,
              notes: notes || undefined,
            });
            setShowForm(false);
            setTime("");
            setNotes("");
          }}
          className="px-2 py-1 rounded bg-[#00B8A3] text-[#0B0F1A] text-xs font-medium"
        >
          Save
        </button>
        <button
          onClick={() => setShowForm(false)}
          className="text-xs text-[#3A4A5C] hover:text-white"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowForm(true)}
      className="px-3 py-1 rounded border border-[#1E2A3F] text-xs text-[#8899AA] hover:border-[#00B8A3] hover:text-[#00B8A3] transition-colors"
    >
      Mark Solved
    </button>
  );
}
