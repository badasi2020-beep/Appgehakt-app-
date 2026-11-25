import { useState } from "react";
import { Check, Clock3, MessageSquarePlus, Timer } from "lucide-react";
import type { Category, Thing } from "../types";

export function DueThingRow({
  thing,
  category,
  running,
  overdue,
  scheduleText,
  onLogNow,
  onLogWithNote,
  onToggleTimer,
  onDismiss
}: {
  thing: Thing;
  category?: Category;
  running?: number | null;
  overdue: boolean;
  scheduleText: string;
  onLogNow: (thing: Thing) => void;
  onLogWithNote: (thing: Thing) => void;
  onToggleTimer: (thing: Thing) => void;
  onDismiss: (thing: Thing, scope: "day" | "week") => void;
}) {
  const [dismissOpen, setDismissOpen] = useState(false);

  return (
    <div className="task-row" data-testid={`row-due-${thing.id}`}>
      <button type="button" className="task-check" onClick={() => onLogNow(thing)} data-testid={`button-log-${thing.id}`} title="Als erledigt abhaken">
        <Check size={15} />
      </button>
      <div className="task-main">
        <div className="task-name">{thing.name}</div>
        <div className="task-detail">
          <span className="category-dot" style={{ background: category?.color }} />
          {category?.name} · {scheduleText}
          {overdue && <span className="tag tag-overdue">überfällig</span>}
        </div>
      </div>
      <button type="button" className="btn btn-ghost btn-icon" onClick={() => onLogWithNote(thing)} data-testid={`button-note-${thing.id}`} title="Mit Notiz eintragen">
        <MessageSquarePlus size={17} />
      </button>
      <button
        type="button"
        className="btn btn-ghost btn-icon"
        onClick={() => onToggleTimer(thing)}
        data-testid={`button-timer-${thing.id}`}
        title={running != null ? "Timer stoppen" : "Mit Timer starten"}
      >
        {running != null ? <span style={{ fontSize: 11 }}>{Math.floor((Date.now() - running) / 1000)}s</span> : <Timer size={17} />}
      </button>
      <div style={{ position: "relative" }}>
        <button
          type="button"
          className="btn btn-ghost btn-icon"
          onClick={() => setDismissOpen((v) => !v)}
          data-testid={`button-dismiss-${thing.id}`}
          title="Weglegen"
        >
          <Clock3 size={17} />
        </button>
        {dismissOpen && (
          <div className="dismiss-popover">
            <button
              type="button"
              className="btn btn-soft"
              onClick={() => {
                onDismiss(thing, "day");
                setDismissOpen(false);
              }}
              data-testid={`button-dismiss-day-${thing.id}`}
            >
              Für heute
            </button>
            <button
              type="button"
              className="btn btn-soft"
              onClick={() => {
                onDismiss(thing, "week");
                setDismissOpen(false);
              }}
              data-testid={`button-dismiss-week-${thing.id}`}
            >
              Für diese Woche
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
