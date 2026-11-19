import { useState } from "react";
import { Trash2, X } from "lucide-react";
import { fromDateTimeInputs, toDateInput, toTimeInput } from "../lib/utils";
import type { Entry } from "../types";

export function EntryEditDialog({
  entry,
  onClose,
  onSave,
  onDelete
}: {
  entry: Entry;
  onClose: () => void;
  onSave: (patch: Partial<Entry>) => void;
  onDelete: () => void;
}) {
  const [date, setDate] = useState(toDateInput(entry.at));
  const [time, setTime] = useState(toTimeInput(entry.at));
  const [duration, setDuration] = useState(entry.durationMinutes != null ? String(entry.durationMinutes) : "");
  const [note, setNote] = useState(entry.note ?? "");

  const submit = () => {
    onSave({
      at: fromDateTimeInputs(date, time),
      durationMinutes: duration.trim() ? Math.max(0, Number(duration)) : null,
      note: note.trim() || undefined
    });
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-head">
          <div>
            <div className="eyebrow">Eintrag bearbeiten</div>
            <h2 style={{ marginTop: 6 }}>{entry.nameSnapshot}</h2>
          </div>
          <button type="button" className="btn btn-ghost btn-icon" onClick={onClose} data-testid="button-close-entry-edit">
            <X size={18} />
          </button>
        </div>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="entry-date">Datum</label>
            <input id="entry-date" type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} data-testid="input-entry-date" />
          </div>
          <div className="field">
            <label htmlFor="entry-time">Uhrzeit</label>
            <input id="entry-time" type="time" className="input" value={time} onChange={(e) => setTime(e.target.value)} data-testid="input-entry-time" />
          </div>
          <div className="field">
            <label htmlFor="entry-duration">Dauer (Minuten, optional)</label>
            <input
              id="entry-duration"
              type="number"
              min="0"
              className="input"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="z.B. 15"
              data-testid="input-entry-duration"
            />
          </div>
          <div className="field full">
            <label htmlFor="entry-note">Notiz (optional)</label>
            <input id="entry-note" className="input" value={note} onChange={(e) => setNote(e.target.value)} data-testid="input-entry-note" />
          </div>
        </div>
        <div className="form-actions" style={{ justifyContent: "space-between" }}>
          <button type="button" className="btn btn-danger" onClick={onDelete} data-testid="button-delete-entry">
            <Trash2 size={15} />
            Löschen
          </button>
          <div style={{ display: "flex", gap: 9 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose} data-testid="button-cancel-entry-edit">
              Abbrechen
            </button>
            <button type="button" className="btn btn-primary" onClick={submit} data-testid="button-save-entry">
              Speichern
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
