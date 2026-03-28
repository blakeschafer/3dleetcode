"use client";

interface CalendarHeatmapProps {
  activityMap: Record<string, number>;
}

export function CalendarHeatmap({ activityMap }: CalendarHeatmapProps) {
  const today = new Date();
  const days: { date: string; count: number; dayOfWeek: number }[] = [];

  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({
      date: key,
      count: activityMap[key] ?? 0,
      dayOfWeek: d.getDay(),
    });
  }

  const weeks: typeof days[] = [];
  let currentWeek: typeof days = [];
  for (const day of days) {
    if (day.dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const getColor = (count: number) => {
    if (count === 0) return "#131A2B";
    if (count === 1) return "#00D4FF30";
    if (count === 2) return "#00D4FF60";
    return "#00D4FF";
  };

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  return (
    <div className="bg-[#131A2B] border border-[#1E2A3F] rounded-lg p-4">
      <h3 className="text-sm font-medium text-[#8899AA] mb-3">Activity</h3>
      <div className="overflow-x-auto">
        <div className="flex gap-[3px] min-w-fit">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day) => (
                <div
                  key={day.date}
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: getColor(day.count) }}
                  title={`${day.date}: ${day.count} problem${day.count !== 1 ? "s" : ""}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between mt-2">
        {months.map((m) => (
          <span key={m} className="text-[10px] text-[#3A4A5C]">{m}</span>
        ))}
      </div>
    </div>
  );
}
