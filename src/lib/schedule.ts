import { dayKey, weekKey } from "./utils";
import type { Dismissal, Entry, Schedule, Thing, Weekday } from "../types";

const WEEKDAY_LABELS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

export function isDismissed(dismissals: Dismissal[], thingId: string, now: Date = new Date()): boolean {
  const todayKey = dayKey(now.toISOString());
  const thisWeekKey = weekKey(now.toISOString());
  return dismissals.some(
    (d) => d.thingId === thingId && ((d.scope === "day" && d.key === todayKey) || (d.scope === "week" && d.key === thisWeekKey))
  );
}

// Ob für dieses konkrete, heutige Vorkommen schon ein Eintrag existiert. Bei "once" zählt
// jeder jemals erfasste Eintrag (einmalige Aufgabe ist dauerhaft erledigt), bei "daily"/"weekly"
// nur ein Eintrag von heute (jeder Tag ist ein eigenes Vorkommen).
export function isDoneForOccurrence(thing: Thing, entries: Entry[], now: Date = new Date()): boolean {
  if (!thing.schedule) return false;
  if (thing.schedule.kind === "once") {
    return entries.some((e) => e.thingId === thing.id);
  }
  const todayKey = dayKey(now.toISOString());
  return entries.some((e) => e.thingId === thing.id && dayKey(e.at) === todayKey);
}

export function isDueToday(thing: Thing, now: Date = new Date()): boolean {
  if (!thing.schedule) return false;
  const todayKey = dayKey(now.toISOString());
  if (thing.schedule.kind === "once") return thing.schedule.date <= todayKey;
  if (thing.schedule.kind === "daily") return true;
  if (thing.schedule.kind === "weekly") {
    const weekday = ((now.getDay() + 6) % 7) as Weekday;
    return thing.schedule.weekdays.includes(weekday);
  }
  return false;
}

export function isOverdue(thing: Thing, now: Date = new Date()): boolean {
  return thing.schedule?.kind === "once" && thing.schedule.date < dayKey(now.toISOString());
}

export function scheduleLabel(schedule: Schedule | null): string {
  if (!schedule) return "Kein fester Zeitplan";
  if (schedule.kind === "once") {
    return `Einmalig am ${new Date(schedule.date).toLocaleDateString("de-DE", { day: "2-digit", month: "short" })}`;
  }
  if (schedule.kind === "daily") return "Täglich";
  if (schedule.weekdays.length === 7) return "Täglich";
  return `Jeden ${schedule.weekdays
    .slice()
    .sort((a, b) => a - b)
    .map((w) => WEEKDAY_LABELS[w])
    .join(", ")}`;
}

export { WEEKDAY_LABELS };
