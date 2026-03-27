"use client";

import { useState, useEffect } from "react";
import { TopBar } from "@/components/top-bar";
import { CategoryTabs } from "@/components/category-tabs";
import { AlgorithmCard } from "@/components/algorithm-card";
import { Algorithm, Category } from "@/algorithms/types";
import { getAllSlugs, getAlgorithm } from "@/algorithms/registry";

export default function Home() {
  const [algorithms, setAlgorithms] = useState<Algorithm[]>([]);
  const [category, setCategory] = useState<"All" | Category>("All");

  useEffect(() => {
    Promise.all(getAllSlugs().map((slug) => getAlgorithm(slug))).then((results) => {
      setAlgorithms(results.filter(Boolean) as Algorithm[]);
    });
  }, []);

  const filtered =
    category === "All"
      ? algorithms
      : algorithms.filter((a) => a.category === category);

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
        <CategoryTabs selected={category} onSelect={setCategory} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filtered.map((algo) => (
            <AlgorithmCard key={algo.slug} algorithm={algo} />
          ))}
        </div>
      </main>
    </div>
  );
}
