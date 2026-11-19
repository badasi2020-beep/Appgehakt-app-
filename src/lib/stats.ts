import type { Entry } from "../types";

export type Range = "woche" | "monat" | "jahr" | "gesamt";

export function startOfRange(range: Range, from: Date = new Date()): Date {
  const d = new Date(from);
  d.setHours(0, 0, 0, 0);
  if (range === "gesamt") return new Date(0);
  if (range === "jahr") {
    d.setMonth(0, 1);
    return d;
  }
  if (range === "monat") {
    d.setDate(1);
    return d;
  }
  // Woche beginnt Montags.
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  return d;
}

export function entriesForThing(entries: Entry[], thingId: string, since: Date): Entry[] {
  return entries.filter((entry) => entry.thingId === thingId && new Date(entry.at) >= since).sort((a, b) => b.at.localeCompare(a.at));
}
