import { Check, Timer } from "lucide-react";
import type { Category, Thing } from "../types";

export function ThingRow({
  thing,
  category,
  running,
  onLogNow,
  onToggleTimer
}: {
  thing: Thing;
  category?: Category;
  running?: number | null;
  onLogNow: (thing: Thing) => void;
  onToggleTimer: (thing: Thing) => void;
}) {
  return (
    <div className="task-row" data-testid={`row-thing-${thing.id}`}>
      <button type="button" className="task-check" onClick={() => onLogNow(thing)} data-testid={`button-log-${thing.id}`} title="Jetzt eintragen">
        <Check size={15} />
      </button>
      <div className="task-main">
        <div className="task-name">{thing.name}</div>
        <div className="task-detail">
          <span className="category-dot" />
          {category?.name}
        </div>
      </div>
      <button
        type="button"
        className="btn btn-ghost btn-icon"
        onClick={() => onToggleTimer(thing)}
        data-testid={`button-timer-${thing.id}`}
        title={running != null ? "Timer stoppen" : "Mit Timer starten"}
      >
        {running != null ? <span style={{ fontSize: 11 }}>{Math.floor((Date.now() - running) / 1000)}s</span> : <Timer size={17} />}
      </button>
    </div>
  );
}
