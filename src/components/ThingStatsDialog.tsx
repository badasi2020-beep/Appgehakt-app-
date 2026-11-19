import { useState } from "react";
import { X } from "lucide-react";
import { entriesForThing, startOfRange, type Range } from "../lib/stats";
import { dateTime, formatDuration } from "../lib/utils";
import type { Entry, Thing } from "../types";

const ranges: [Range, string][] = [
  ["woche", "Diese Woche"],
  ["monat", "Dieser Monat"],
  ["jahr", "Dieses Jahr"],
  ["gesamt", "Insgesamt"]
];

export function ThingStatsDialog({ thing, entries, onClose, onSelectEntry }: { thing: Thing; entries: Entry[]; onClose: () => void; onSelectEntry: (entry: Entry) => void }) {
  const [range, setRange] = useState<Range>("woche");
  const since = startOfRange(range);
  const matches = entriesForThing(entries, thing.id, since);
  const totalMinutes = matches.reduce((sum, e) => sum + (e.durationMinutes || 0), 0);

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-head">
          <div>
            <div className="eyebrow">Auswertung</div>
            <h2 style={{ marginTop: 6 }}>{thing.name}</h2>
          </div>
          <button type="button" className="btn btn-ghost btn-icon" onClick={onClose} data-testid="button-close-stats">
            <X size={18} />
          </button>
        </div>
        <div className="toolbar">
          {ranges.map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={`filter-pill ${range === value ? "active" : ""}`}
              onClick={() => setRange(value)}
              data-testid={`button-stats-range-${value}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="grid grid-two" style={{ marginBottom: 10 }}>
          <div className="card stat-tile">
            <div className="section-label">Erledigt</div>
            <div className="stat-value">{matches.length}</div>
          </div>
          <div className="card stat-tile">
            <div className="section-label">Zeit investiert</div>
            <div className="stat-value">{totalMinutes ? formatDuration(totalMinutes) : "–"}</div>
          </div>
        </div>
        <div className="timeline">
          {matches.length ? (
            matches.map((entry) => (
              <button type="button" className="timeline-item entry-item" key={entry.id} onClick={() => onSelectEntry(entry)} data-testid={`stats-entry-${entry.id}`}>
                <div className="timeline-title">{dateTime(entry.at)}</div>
                <div className="timeline-meta">
                  {entry.durationMinutes ? formatDuration(entry.durationMinutes) : "keine Dauer erfasst"}
                  {entry.note ? ` · ${entry.note}` : ""}
                </div>
              </button>
            ))
          ) : (
            <div className="empty">Noch nichts in diesem Zeitraum.</div>
          )}
        </div>
      </div>
    </div>
  );
}
