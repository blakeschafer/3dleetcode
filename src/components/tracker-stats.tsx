"use client";

interface TrackerStatsProps {
  totalSolved: number;
  currentStreak: number;
  bestStreak: number;
  todaySolved: number;
  dailyGoal: number;
}

export function TrackerStats({
  totalSolved,
  currentStreak,
  bestStreak,
  todaySolved,
  dailyGoal,
}: TrackerStatsProps) {
  const stats = [
    { label: "Total Solved", value: totalSolved, color: "#00D4FF" },
    { label: "Current Streak", value: `${currentStreak}d`, color: "#FFB800" },
    { label: "Best Streak", value: `${bestStreak}d`, color: "#00B8A3" },
    {
      label: "Today",
      value: `${todaySolved} / ${dailyGoal}`,
      color: todaySolved >= dailyGoal ? "#00B8A3" : "#8899AA",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-[#131A2B] border border-[#1E2A3F] rounded-lg p-4"
        >
          <p className="text-xs text-[#8899AA] mb-1">{stat.label}</p>
          <p className="text-2xl font-bold" style={{ color: stat.color }}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
