import { useState } from "react";
import { Trash2, X } from "lucide-react";
import { WEEKDAY_LABELS } from "../lib/schedule";
import { dayKey } from "../lib/utils";
import type { Category, Schedule, Thing, Weekday } from "../types";

type ScheduleKind = "none" | "once" | "daily" | "weekly";

export function ThingModal({
  thing,
  categories,
  defaultCategoryId,
  defaultSchedule,
  onClose,
  onSave,
  onDelete
}: {
  thing?: Thing;
  categories: Category[];
  defaultCategoryId?: string;
  defaultSchedule?: Schedule;
  onClose: () => void;
  onSave: (data: { name: string; categoryId: string; schedule: Schedule | null }) => void;
  onDelete?: () => void;
}) {
  const initialSchedule = thing?.schedule ?? defaultSchedule ?? null;
  const [name, setName] = useState(thing?.name ?? "");
  const [categoryId, setCategoryId] = useState(thing?.categoryId ?? defaultCategoryId ?? categories[0]?.id ?? "");
  const [scheduleKind, setScheduleKind] = useState<ScheduleKind>(initialSchedule?.kind ?? "none");
  const [onceDate, setOnceDate] = useState(initialSchedule?.kind === "once" ? initialSchedule.date : dayKey(new Date().toISOString()));
  const [weekdays, setWeekdays] = useState<Weekday[]>(initialSchedule?.kind === "weekly" ? initialSchedule.weekdays : []);

  const toggleWeekday = (day: Weekday) => {
    setWeekdays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()));
  };

  const submit = () => {
    if (!name.trim() || !categoryId) return;
    let schedule: Schedule | null = null;
    if (scheduleKind === "once") schedule = { kind: "once", date: onceDate };
    else if (scheduleKind === "daily") schedule = { kind: "daily" };
    else if (scheduleKind === "weekly") {
      if (weekdays.length === 0) return;
      schedule = { kind: "weekly", weekdays };
    }
    onSave({ name: name.trim(), categoryId, schedule });
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-head">
          <div>
            <div className="eyebrow">Ding</div>
            <h2 style={{ marginTop: 6 }}>{thing ? "Bearbeiten" : "Neues Ding"}</h2>
          </div>
          <button type="button" className="btn btn-ghost btn-icon" onClick={onClose} data-testid="button-close-thing">
            <X size={18} />
          </button>
        </div>
        <div className="form-grid">
          <div className="field full">
            <label htmlFor="thing-name">Name</label>
            <input
              id="thing-name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Zum Beispiel: Spülmaschine ausräumen"
              data-testid="input-thing-name"
            />
          </div>
          <div className="field full">
            <label htmlFor="thing-category">Kategorie</label>
            <select id="thing-category" className="select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} data-testid="select-thing-category">
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field full">
            <label>Zeitplan (für die "Heute"-Seite)</label>
            <div className="toolbar" style={{ marginBottom: scheduleKind === "none" ? 0 : 10 }}>
              {(
                [
                  ["none", "Kein fester Zeitplan"],
                  ["once", "Einmalig"],
                  ["daily", "Täglich"],
                  ["weekly", "Wöchentlich"]
                ] as [ScheduleKind, string][]
              ).map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  className={`filter-pill ${scheduleKind === value ? "active" : ""}`}
                  onClick={() => setScheduleKind(value)}
                  data-testid={`button-schedule-${value}`}
                >
                  {label}
                </button>
              ))}
            </div>
            {scheduleKind === "once" && (
              <input type="date" className="input" value={onceDate} onChange={(e) => setOnceDate(e.target.value)} data-testid="input-schedule-date" />
            )}
            {scheduleKind === "weekly" && (
              <div className="weekday-choice">
                {WEEKDAY_LABELS.map((label, index) => (
                  <button
                    type="button"
                    key={label}
                    className={`weekday-btn ${weekdays.includes(index as Weekday) ? "active" : ""}`}
                    onClick={() => toggleWeekday(index as Weekday)}
                    data-testid={`button-weekday-${index}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="form-actions" style={{ justifyContent: onDelete ? "space-between" : "flex-end" }}>
          {onDelete && (
            <button type="button" className="btn btn-danger" onClick={onDelete} data-testid="button-delete-thing">
              <Trash2 size={15} />
              Löschen
            </button>
          )}
          <div style={{ display: "flex", gap: 9 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose} data-testid="button-cancel-thing">
              Abbrechen
            </button>
            <button type="button" className="btn btn-primary" onClick={submit} data-testid="button-save-thing">
              Speichern
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
