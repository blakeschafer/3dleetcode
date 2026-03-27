"use client";

import { useState, useMemo } from "react";
import { Problem } from "@/data/types";
import { problems } from "@/data/problems";

type Difficulty = "Easy" | "Medium" | "Hard";
type SortField = "id" | "title" | "difficulty";
type SortDirection = "asc" | "desc";

const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  Easy: 0,
  Medium: 1,
  Hard: 2,
};

export function useProblems() {
  const [search, setSearch] = useState("");
  const [difficulties, setDifficulties] = useState<Set<Difficulty>>(
    new Set(["Easy", "Medium", "Hard"])
  );
  const [pattern, setPattern] = useState<string>("All");
  const [list, setList] = useState<string>("All");
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const toggleDifficulty = (d: Difficulty) => {
    setDifficulties((prev) => {
      const next = new Set(prev);
      if (next.has(d)) {
        if (next.size > 1) next.delete(d);
      } else {
        next.add(d);
      }
      return next;
    });
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filtered = useMemo(() => {
    let result = problems;

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.id.toString().includes(q)
      );
    }

    result = result.filter((p) => difficulties.has(p.difficulty));

    if (pattern !== "All") {
      result = result.filter((p) => p.pattern === pattern);
    }

    if (list !== "All") {
      result = result.filter((p) => p.listMembership.includes(list));
    }

    result = [...result].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "id":
          cmp = a.id - b.id;
          break;
        case "title":
          cmp = a.title.localeCompare(b.title);
          break;
        case "difficulty":
          cmp = DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty];
          break;
      }
      return sortDirection === "asc" ? cmp : -cmp;
    });

    return result;
  }, [search, difficulties, pattern, list, sortField, sortDirection]);

  return {
    problems: filtered,
    totalCount: problems.length,
    search,
    setSearch,
    difficulties,
    toggleDifficulty,
    pattern,
    setPattern,
    list,
    setList,
    sortField,
    sortDirection,
    toggleSort,
  };
}
