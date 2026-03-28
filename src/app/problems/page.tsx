"use client";

import { TopBar } from "@/components/top-bar";
import { ProblemFilters } from "@/components/problem-filters";
import { ProblemTable } from "@/components/problem-table";
import { useProblems } from "@/hooks/use-problems";

export default function ProblemsPage() {
  const {
    problems,
    totalCount,
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
  } = useProblems();

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Problems</h1>
          <p className="text-[#8899AA] text-sm">
            Browse {totalCount} curated LeetCode problems with approach summaries and pattern hints.
          </p>
        </div>
        <ProblemFilters
          search={search}
          onSearchChange={setSearch}
          difficulties={difficulties}
          onToggleDifficulty={toggleDifficulty}
          pattern={pattern}
          onPatternChange={setPattern}
          list={list}
          onListChange={setList}
          resultCount={problems.length}
          totalCount={totalCount}
        />
        <div className="mt-6">
          <ProblemTable
            problems={problems}
            sortField={sortField}
            sortDirection={sortDirection}
            onToggleSort={toggleSort}
          />
        </div>
      </main>
    </div>
  );
}
