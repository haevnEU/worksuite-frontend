export const isWeekend = (dateStr: string): boolean => {
  if (!dateStr) return false;
  const [year, month, day] = dateStr.split("T")[0].split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const dayOfWeek = date.getUTCDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
};

export const formatDayLabel = (
  dateStr: string,
  index: number,
  totalDays: number,
): string => {
  if (!dateStr) return "";

  const [year, month, day] = dateStr.split("T")[0].split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const dayName = date.toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: "UTC",
  });

  if (index === totalDays - 1 && dayName === "Tuesday" && totalDays > 1) {
    return "Tuesday (Next Week)";
  }

  return dayName;
};
