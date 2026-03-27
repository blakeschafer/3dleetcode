"use client";

import { useState, useEffect, useCallback } from "react";
import { TrackerData, SolvedEntry } from "@/data/types";
import { storage } from "@/lib/storage";

const TRACKER_KEY = "algovision-tracker";

const DEFAULT_TRACKER: TrackerData = {
  solvedProblems: {},
  dailyGoal: 3,
};

function loadTracker(): TrackerData {
  return storage.get<TrackerData>(TRACKER_KEY) ?? DEFAULT_TRACKER;
}

export function useTracker() {
  const [data, setData] = useState<TrackerData>(DEFAULT_TRACKER);

  useEffect(() => {
    setData(loadTracker());
    const unsub = storage.subscribe(TRACKER_KEY, () => {
      setData(loadTracker());
    });
    return unsub;
  }, []);

  const markSolved = useCallback(
    (problemId: number, entry: SolvedEntry) => {
      const updated = {
        ...data,
        solvedProblems: { ...data.solvedProblems, [problemId]: entry },
      };
      storage.set(TRACKER_KEY, updated);
      setData(updated);
    },
    [data]
  );

  const unmarkSolved = useCallback(
    (problemId: number) => {
      const { [problemId]: _, ...rest } = data.solvedProblems;
      const updated = { ...data, solvedProblems: rest };
      storage.set(TRACKER_KEY, updated);
      setData(updated);
    },
    [data]
  );

  const setDailyGoal = useCallback(
    (goal: number) => {
      const updated = { ...data, dailyGoal: goal };
      storage.set(TRACKER_KEY, updated);
      setData(updated);
    },
    [data]
  );

  const isSolved = useCallback(
    (problemId: number) => problemId in data.solvedProblems,
    [data]
  );

  const getSolvedEntry = useCallback(
    (problemId: number) => data.solvedProblems[problemId] ?? null,
    [data]
  );

  const todaySolved = Object.values(data.solvedProblems).filter(
    (e) => e.solvedAt.slice(0, 10) === new Date().toISOString().slice(0, 10)
  ).length;

  const totalSolved = Object.keys(data.solvedProblems).length;

  const solvedByDifficulty = {
    Easy: Object.values(data.solvedProblems).filter((e) => e.difficulty === "Easy").length,
    Medium: Object.values(data.solvedProblems).filter((e) => e.difficulty === "Medium").length,
    Hard: Object.values(data.solvedProblems).filter((e) => e.difficulty === "Hard").length,
  };

  const getStreak = useCallback(() => {
    const dates = new Set(
      Object.values(data.solvedProblems).map((e) => e.solvedAt.slice(0, 10))
    );
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      if (dates.has(key)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  }, [data]);

  const getBestStreak = useCallback(() => {
    const dates = [
      ...new Set(
        Object.values(data.solvedProblems).map((e) => e.solvedAt.slice(0, 10))
      ),
    ].sort();
    let best = 0;
    let current = 1;
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]);
      const curr = new Date(dates[i]);
      const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        current++;
      } else {
        best = Math.max(best, current);
        current = 1;
      }
    }
    return Math.max(best, current, dates.length > 0 ? 1 : 0);
  }, [data]);

  const getReviewProblems = useCallback(() => {
    const today = new Date();
    const intervals = [1, 3, 7, 14, 30];
    const due: number[] = [];
    for (const [idStr, entry] of Object.entries(data.solvedProblems)) {
      const solvedDate = new Date(entry.solvedAt);
      const daysSince = Math.floor(
        (today.getTime() - solvedDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (intervals.includes(daysSince)) {
        due.push(Number(idStr));
      }
    }
    return due;
  }, [data]);

  const getActivityMap = useCallback(() => {
    const map: Record<string, number> = {};
    for (const entry of Object.values(data.solvedProblems)) {
      const date = entry.solvedAt.slice(0, 10);
      map[date] = (map[date] ?? 0) + 1;
    }
    return map;
  }, [data]);

  return {
    data,
    markSolved,
    unmarkSolved,
    setDailyGoal,
    isSolved,
    getSolvedEntry,
    todaySolved,
    totalSolved,
    solvedByDifficulty,
    currentStreak: getStreak(),
    bestStreak: getBestStreak(),
    reviewProblems: getReviewProblems(),
    activityMap: getActivityMap(),
  };
}
