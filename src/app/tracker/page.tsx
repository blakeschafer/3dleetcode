"use client";

import { TopBar } from "@/components/top-bar";
import { TrackerStats } from "@/components/tracker-stats";
import { CalendarHeatmap } from "@/components/calendar-heatmap";
import { DailyPlan } from "@/components/daily-plan";
import { DifficultyBreakdown } from "@/components/difficulty-breakdown";
import { useTracker } from "@/hooks/use-tracker";

export default function TrackerPage() {
  const tracker = useTracker();
  const solvedIds = new Set(
    Object.keys(tracker.data.solvedProblems).map(Number)
  );

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Daily Tracker</h1>
            <p className="text-[#8899AA] text-sm">
              Track your progress and stay consistent.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8899AA]">Daily goal:</span>
            <input
              type="number"
              min={1}
              max={20}
              value={tracker.data.dailyGoal}
              onChange={(e) => tracker.setDailyGoal(Number(e.target.value) || 1)}
              className="w-14 bg-[#131A2B] border border-[#1E2A3F] rounded px-2 py-1 text-sm text-white text-center"
            />
          </div>
        </div>

        <TrackerStats
          totalSolved={tracker.totalSolved}
          currentStreak={tracker.currentStreak}
          bestStreak={tracker.bestStreak}
          todaySolved={tracker.todaySolved}
          dailyGoal={tracker.data.dailyGoal}
        />

        <CalendarHeatmap activityMap={tracker.activityMap} />

        <DailyPlan
          reviewProblemIds={tracker.reviewProblems}
          solvedProblemIds={solvedIds}
        />

        <DifficultyBreakdown
          solvedByDifficulty={tracker.solvedByDifficulty}
        />
      </main>
    </div>
  );
}
