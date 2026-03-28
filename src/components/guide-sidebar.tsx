"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { studyGuides } from "@/data/study-guides";

export function GuideSidebar() {
  const pathname = usePathname();

  const categories = [...new Set(studyGuides.map((g) => g.category))];

  return (
    <nav className="w-64 shrink-0 space-y-4">
      {categories.map((cat) => (
        <div key={cat}>
          <h3 className="text-xs font-medium text-[#3A4A5C] uppercase tracking-wider mb-2 px-3">
            {cat}
          </h3>
          <ul className="space-y-0.5">
            {studyGuides
              .filter((g) => g.category === cat)
              .map((guide) => {
                const isActive = pathname === `/resources/${guide.slug}`;
                return (
                  <li key={guide.slug}>
                    <Link
                      href={`/resources/${guide.slug}`}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                        isActive
                          ? "bg-[#00D4FF]/10 text-[#00D4FF]"
                          : "text-[#8899AA] hover:text-white hover:bg-[#131A2B]"
                      }`}
                    >
                      <span>{guide.icon}</span>
                      <span>{guide.title}</span>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
