"use client";

interface CodePanelProps {
  code: string[];
  activeCodeLine: number;
  stepLabel: string;
  complexity: { time: string; space: string };
  leetcodeProblems: string[];
}

export function CodePanel({
  code,
  activeCodeLine,
  stepLabel,
  complexity,
  leetcodeProblems,
}: CodePanelProps) {
  return (
    <div className="flex flex-col h-full bg-[#0D1117] rounded-lg border border-[#1E2A3F] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#1E2A3F]">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs px-2 py-0.5 rounded bg-[#131A2B] border border-[#1E2A3F] text-[#00D4FF]">
            {complexity.time}
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-[#131A2B] border border-[#1E2A3F] text-[#00D4FF]">
            {complexity.space}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {leetcodeProblems.map((p) => (
            <span
              key={p}
              className="text-[10px] px-1.5 py-0.5 rounded bg-[#1A3A5C] text-[#8899AA]"
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 font-mono text-sm">
        {code.map((line, i) => (
          <div
            key={i}
            className={`px-2 py-0.5 rounded transition-colors ${
              i === activeCodeLine
                ? "bg-[#FFB800]/20 text-[#FFB800]"
                : "text-[#8899AA]"
            }`}
          >
            <span className="inline-block w-6 text-right mr-3 text-[#3A4A5C]">
              {i + 1}
            </span>
            {line}
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-[#1E2A3F] bg-[#131A2B]">
        <p className="text-sm text-[#00D4FF]">{stepLabel}</p>
      </div>
    </div>
  );
}
