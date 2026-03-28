"use client";

import { useState, useEffect, useMemo } from "react";
import { TopBar } from "@/components/top-bar";
import { CategoryTabs } from "@/components/category-tabs";
import { AlgorithmCard } from "@/components/algorithm-card";
import { Algorithm, Category } from "@/algorithms/types";
import { getAllSlugs, getAlgorithm } from "@/algorithms/registry";

export default function Home() {
  const [algorithms, setAlgorithms] = useState<Algorithm[]>([]);
  const [category, setCategory] = useState<"All" | Category>("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all(getAllSlugs().map((slug) => getAlgorithm(slug))).then((results) => {
      setAlgorithms(results.filter(Boolean) as Algorithm[]);
    });
  }, []);

  const filtered = useMemo(() => {
    let result = algorithms;

    if (category !== "All") {
      result = result.filter((a) => a.category === category);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      );
    }

    return result;
  }, [algorithms, category, search]);

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1
            className="text-4xl font-bold mb-2"
            style={{ textShadow: "0 0 30px rgba(0, 212, 255, 0.2)" }}
          >
            Visualize Algorithms in 3D
          </h1>
          <p className="text-[#8899AA]">
            Don&apos;t just solve LeetCode — <em>see</em> it happen.
          </p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search algorithms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-md bg-[#131A2B] border border-[#1E2A3F] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#3A4A5C] focus:outline-none focus:border-[#00D4FF] transition-colors"
            />
            {search && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#3A4A5C]">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        <CategoryTabs selected={category} onSelect={setCategory} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filtered.map((algo) => (
            <AlgorithmCard key={algo.slug} algorithm={algo} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#3A4A5C]">
            No algorithms match your search
          </div>
        )}
      </main>
    </div>
  );
}
