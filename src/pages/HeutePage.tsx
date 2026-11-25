import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { DueThingRow } from "../components/DueThingRow";
import { QuickNoteDialog } from "../components/QuickNoteDialog";
import { ThingModal } from "../components/ThingModal";
import { isDismissed, isDoneForOccurrence, isDueToday, isOverdue, scheduleLabel } from "../lib/schedule";
import { dayKey, weekKey } from "../lib/utils";
import { makeId } from "../store";
import type { Entry, Store, Thing } from "../types";

export function HeutePage({ store, update }: { store: Store; update: (patch: Partial<Store>) => void }) {
  const [running, setRunning] = useState<{ thingId: string; startedAt: number } | null>(null);
  const [, setTick] = useState(0);
  const [noteFor, setNoteFor] = useState<Thing | null>(null);
  const [newThingOpen, setNewThingOpen] = useState(false);

  useEffect(() => {
    if (!running) return undefined;
    const interval = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(interval);
  }, [running]);

  const now = new Date();
  const due = store.things
    .filter((thing) => isDueToday(thing, now) && !isDoneForOccurrence(thing, store.entries, now) && !isDismissed(store.dismissals, thing.id, now))
    .sort((a, b) => (isOverdue(b, now) ? 1 : 0) - (isOverdue(a, now) ? 1 : 0));

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

  const dismiss = (thing: Thing, scope: "day" | "week") => {
    const key = scope === "day" ? dayKey(now.toISOString()) : weekKey(now.toISOString());
    update({ dismissals: [...store.dismissals, { id: makeId("dismiss"), thingId: thing.id, scope, key }] });
  };

  const saveNewThing = (data: { name: string; categoryId: string; schedule: Thing["schedule"] }) => {
    const nowIso = new Date().toISOString();
    update({ things: [...store.things, { id: makeId("thing"), ...data, createdAt: nowIso, updatedAt: nowIso }] });
  };

  return (
    <div className="content">
      <div className="page-heading">
        <div>
          <div className="eyebrow">{now.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" })}</div>
          <h1>Heute</h1>
          <p className="subtitle">{due.length ? `${due.length} noch offen` : "Alles erledigt für heute."}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setNewThingOpen(true)} data-testid="button-new-due-thing">
          <Plus size={16} />
          Für heute planen
        </button>
      </div>

      <section className="card card-pad">
        <div className="task-list">
          {due.map((thing) => (
            <DueThingRow
              key={thing.id}
              thing={thing}
              category={store.categories.find((cat) => cat.id === thing.categoryId)}
              running={running?.thingId === thing.id ? running.startedAt : null}
              overdue={isOverdue(thing, now)}
              scheduleText={scheduleLabel(thing.schedule)}
              onLogNow={(t) => logEntry(t, null)}
              onLogWithNote={(t) => setNoteFor(t)}
              onToggleTimer={toggleTimer}
              onDismiss={dismiss}
            />
          ))}
          {due.length === 0 && (
            <div className="empty">
              <strong>Nichts Fälliges für heute.</strong>
              <p style={{ marginTop: 6 }}>Du kannst trotzdem jederzeit etwas im „Pool" eintragen.</p>
            </div>
          )}
        </div>
      </section>

      {noteFor && (
        <QuickNoteDialog
          title={noteFor.name}
          onClose={() => setNoteFor(null)}
          onSave={(note) => logEntry(noteFor, null, note)}
        />
      )}
      {newThingOpen && (
        <ThingModal
          categories={store.categories}
          defaultSchedule={{ kind: "once", date: dayKey(now.toISOString()) }}
          onClose={() => setNewThingOpen(false)}
          onSave={saveNewThing}
        />
      )}
    </div>
  );
}
