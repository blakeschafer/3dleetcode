"use client";

import Link from "next/link";
import { StudyGuide } from "@/data/types";
import { problems } from "@/data/problems";
import { DIFFICULTY_COLORS } from "@/lib/constants";

interface GuideContentProps {
  guide: StudyGuide;
}

export function GuideContent({ guide }: GuideContentProps) {
  const relatedProblemData = guide.relatedProblems
    .map((id) => problems.find((p) => p.id === id))
    .filter(Boolean) as (typeof problems)[number][];

  return (
    <div className="flex-1 min-w-0 space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{guide.icon}</span>
          <h1 className="text-3xl font-bold">{guide.title}</h1>
        </div>
        <p className="text-[#8899AA] leading-relaxed">{guide.overview}</p>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-[#00D4FF] mb-3">When to Use</h2>
        <ul className="space-y-2">
          {guide.whenToUse.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm text-[#8899AA]">
              <span className="text-[#00D4FF] shrink-0">→</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#00D4FF] mb-3">Approach</h2>
        <div className="text-sm text-[#8899AA] leading-relaxed space-y-3">
          {guide.approach.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#00D4FF] mb-3">Code Template</h2>
        <pre className="bg-[#0D1117] border border-[#1E2A3F] rounded-lg p-4 overflow-x-auto">
          <code className="text-sm text-[#8899AA] font-mono whitespace-pre">
            {guide.codeTemplate}
          </code>
        </pre>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#00D4FF] mb-3">Related Problems</h2>
        <div className="border border-[#1E2A3F] rounded-lg overflow-hidden">
          {relatedProblemData.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between px-4 py-2.5 border-b border-[#1E2A3F] last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#3A4A5C] w-8">#{p.id}</span>
                <Link
                  href="/problems"
                  className="text-sm text-white hover:text-[#00D4FF] transition-colors"
                >
                  {p.title}
                </Link>
              </div>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  color: DIFFICULTY_COLORS[p.difficulty],
                  backgroundColor: `${DIFFICULTY_COLORS[p.difficulty]}20`,
                }}
              >
                {p.difficulty}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#00D4FF] mb-3">External Resources</h2>
        <div className="grid gap-2">
          {guide.externalLinks.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3 bg-[#131A2B] border border-[#1E2A3F] rounded-lg hover:border-[#00D4FF] transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">
                  {link.type === "video" ? "🎬" : link.type === "course" ? "📚" : "📄"}
                </span>
                <span className="text-sm text-[#8899AA] group-hover:text-white transition-colors">
                  {link.title}
                </span>
              </div>
              <span className="text-xs text-[#3A4A5C]">{link.type} ↗</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
