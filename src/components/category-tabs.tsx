"use client";

import { Category } from "@/algorithms/types";

const CATEGORIES: ("All" | Category)[] = [
  "All",
  "Arrays",
  "Trees",
  "Linked Lists",
  "Graphs",
];

interface CategoryTabsProps {
  selected: "All" | Category;
  onSelect: (category: "All" | Category) => void;
}

export function CategoryTabs({ selected, onSelect }: CategoryTabsProps) {
  return (
    <div className="flex gap-2">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selected === cat
              ? "bg-[#00D4FF] text-[#0B0F1A]"
              : "bg-[#131A2B] text-[#8899AA] border border-[#1E2A3F] hover:border-[#00D4FF]"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
