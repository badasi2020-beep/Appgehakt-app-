import { useEffect, useState, type FormEvent } from "react";
import { Plus, X } from "lucide-react";
import { ThingRow } from "../components/ThingRow";
import { EntryEditDialog } from "../components/EntryEditDialog";
import { QuickNoteDialog } from "../components/QuickNoteDialog";
import { dayKey, formatDuration, timeOnly } from "../lib/utils";
import { makeId } from "../store";
import type { Entry, Store, Thing } from "../types";

export function PoolPage({ store, update }: { store: Store; update: (patch: Partial<Store>) => void }) {
  const [running, setRunning] = useState<{ thingId: string; startedAt: number } | null>(null);
  const [, setTick] = useState(0);
  const [freeOpen, setFreeOpen] = useState(false);
  const [free, setFree] = useState({ name: "", categoryId: store.categories[0]?.id ?? "", duration: "" });
  const [editing, setEditing] = useState<Entry | null>(null);
  const [noteFor, setNoteFor] = useState<Thing | null>(null);

  useEffect(() => {
    if (!running) return undefined;
    const interval = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(interval);
  }, [running]);

  const today = dayKey(new Date().toISOString());
  const todaysEntries = store.entries.filter((entry) => dayKey(entry.at) === today).sort((a, b) => b.at.localeCompare(a.at));

  const logEntry = (thing: Thing, durationMinutes: number | null, note?: string) => {
    const category = store.categories.find((cat) => cat.id === thing.categoryId);
    const entry: Entry = {
      id: makeId("entry"),
      thingId: thing.id,
      nameSnapshot: thing.name,
      categoryId: thing.categoryId,
      categoryNameSnapshot: category?.name ?? "",
      at: new Date().toISOString(),
      durationMinutes,
      note: note || undefined
    };
    update({ entries: [entry, ...store.entries] });
  };

  const toggleTimer = (thing: Thing) => {
    if (running?.thingId === thing.id) {
      const minutes = Math.max(1, Math.round((Date.now() - running.startedAt) / 60000));
      logEntry(thing, minutes);
      setRunning(null);
    } else {
      setRunning({ thingId: thing.id, startedAt: Date.now() });
    }
  };

  const submitFree = (event: FormEvent) => {
    event.preventDefault();
    if (!free.name.trim() || !free.categoryId) return;
    const category = store.categories.find((cat) => cat.id === free.categoryId);
    const entry: Entry = {
      id: makeId("entry"),
      thingId: null,
      nameSnapshot: free.name.trim(),
      categoryId: free.categoryId,
      categoryNameSnapshot: category?.name ?? "",
      at: new Date().toISOString(),
      durationMinutes: free.duration.trim() ? Math.max(0, Number(free.duration)) : null
    };
    update({ entries: [entry, ...store.entries] });
    setFree({ name: "", categoryId: store.categories[0]?.id ?? "", duration: "" });
    setFreeOpen(false);
  };

  const saveEntry = (patch: Partial<Entry>) => {
    if (!editing) return;
    update({ entries: store.entries.map((item) => (item.id === editing.id ? { ...item, ...patch } : item)) });
  };

  const deleteEntry = () => {
    if (!editing) return;
    update({ entries: store.entries.filter((item) => item.id !== editing.id) });
    setEditing(null);
  };

  return (
    <div className="content home-content">
      <img src="./watermark-check.png" alt="" aria-hidden="true" className="home-watermark" />
      <div className="page-heading">
        <div>
          <div className="eyebrow">{new Date().toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" })}</div>
          <h1>Pool</h1>
          <p className="subtitle">Alle deine Dinge zum jederzeit Eintragen, unabhängig von der Planung.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setFreeOpen(true)} data-testid="button-free-entry">
          <Plus size={16} />
          Frei eintragen
        </button>
      </div>

      <section className="card card-pad">
        <div className="section-head">
          <h2>Schnellwahl</h2>
        </div>
        <div className="task-list">
          {store.things.map((thing) => (
            <ThingRow
              key={thing.id}
              thing={thing}
              category={store.categories.find((cat) => cat.id === thing.categoryId)}
              running={running?.thingId === thing.id ? running.startedAt : null}
              onLogNow={(t) => logEntry(t, null)}
              onLogWithNote={(t) => setNoteFor(t)}
              onToggleTimer={toggleTimer}
            />
          ))}
          {store.things.length === 0 && (
            <div className="empty">
              <strong>Noch keine Dinge angelegt.</strong>
              <p style={{ marginTop: 6 }}>Lege welche auf der Seite „Dinge" an.</p>
            </div>
          )}
        </div>
      </section>

      <section className="card card-pad" style={{ marginTop: 18 }}>
        <div className="section-head">
          <h2>Heute erledigt</h2>
          <span className="tag">{todaysEntries.length} Einträge</span>
        </div>
        <div className="timeline">
          {todaysEntries.map((entry) => (
            <button
              type="button"
              className="timeline-item entry-item"
              key={entry.id}
              style={{ borderLeftColor: store.categories.find((c) => c.id === entry.categoryId)?.color }}
              onClick={() => setEditing(entry)}
              data-testid={`entry-${entry.id}`}
            >
              <div className="timeline-title">{entry.nameSnapshot}</div>
              <div className="timeline-meta">
                {timeOnly(entry.at)} · {entry.categoryNameSnapshot}
                {entry.durationMinutes ? ` · ${formatDuration(entry.durationMinutes)}` : ""}
                {entry.note ? ` · ${entry.note}` : ""}
              </div>
            </button>
          ))}
          {todaysEntries.length === 0 && (
            <div className="empty">
              <strong>Noch nichts eingetragen heute.</strong>
            </div>
          )}
        </div>
      </section>

      {freeOpen && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={submitFree}>
            <div className="modal-head">
              <div>
                <div className="eyebrow">Schnell notiert</div>
                <h2 style={{ marginTop: 6 }}>Frei eintragen</h2>
              </div>
              <button type="button" className="btn btn-ghost btn-icon" onClick={() => setFreeOpen(false)} data-testid="button-close-free">
                <X size={18} />
              </button>
            </div>
            <div className="form-grid">
              <div className="field full">
                <label htmlFor="free-name">Was hast du gemacht?</label>
                <input
                  id="free-name"
                  className="input"
                  value={free.name}
                  onChange={(e) => setFree({ ...free, name: e.target.value })}
                  placeholder="Zum Beispiel: Paket zur Post gebracht"
                  data-testid="input-free-name"
                />
              </div>
              <div className="field">
                <label htmlFor="free-category">Kategorie</label>
                <select
                  id="free-category"
                  className="select"
                  value={free.categoryId}
                  onChange={(e) => setFree({ ...free, categoryId: e.target.value })}
                  data-testid="select-free-category"
                >
                  {store.categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="free-duration">Dauer in Minuten (optional)</label>
                <input
                  id="free-duration"
                  type="number"
                  min="0"
                  className="input"
                  value={free.duration}
                  onChange={(e) => setFree({ ...free, duration: e.target.value })}
                  data-testid="input-free-duration"
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setFreeOpen(false)} data-testid="button-cancel-free">
                Abbrechen
              </button>
              <button className="btn btn-primary" data-testid="button-save-free">
                Speichern
              </button>
            </div>
          </form>
        </div>
      )}

      {editing && <EntryEditDialog entry={editing} onClose={() => setEditing(null)} onSave={saveEntry} onDelete={deleteEntry} />}
      {noteFor && <QuickNoteDialog title={noteFor.name} onClose={() => setNoteFor(null)} onSave={(note) => logEntry(noteFor, null, note)} />}
    </div>
  );
}
