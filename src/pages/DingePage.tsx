import { useState } from "react";
import { ArrowLeft, BarChart3, ChevronRight, Pencil, Plus, Settings } from "lucide-react";
import { Link } from "wouter";
import { CategoryIcon } from "../components/CategoryIcon";
import { ThingModal } from "../components/ThingModal";
import { ThingStatsDialog } from "../components/ThingStatsDialog";
import { EntryEditDialog } from "../components/EntryEditDialog";
import { scheduleLabel } from "../lib/schedule";
import { makeId } from "../store";
import type { Entry, Store, Thing } from "../types";

export function DingePage({ store, update, notify }: { store: Store; update: (patch: Partial<Store>) => void; notify: (text: string) => void }) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [thingModal, setThingModal] = useState<Thing | "new" | null>(null);
  const [statsThing, setStatsThing] = useState<Thing | null>(null);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);

  const selectedCategory = store.categories.find((cat) => cat.id === selectedCategoryId) || null;

  const saveThing = (data: { name: string; categoryId: string; schedule: Thing["schedule"] }) => {
    const now = new Date().toISOString();
    if (thingModal && thingModal !== "new") {
      update({ things: store.things.map((thing) => (thing.id === thingModal.id ? { ...thing, ...data, updatedAt: now } : thing)) });
      notify("Ding aktualisiert.");
    } else {
      update({ things: [...store.things, { id: makeId("thing"), ...data, createdAt: now, updatedAt: now }] });
      notify("Ding angelegt.");
    }
  };

  const deleteThing = (thing: Thing) => {
    update({ things: store.things.filter((item) => item.id !== thing.id) });
    setThingModal(null);
    notify("Ding gelöscht. Bisherige Einträge bleiben in der Historie erhalten.");
  };

  const saveEntry = (patch: Partial<Entry>) => {
    if (!editingEntry) return;
    update({ entries: store.entries.map((item) => (item.id === editingEntry.id ? { ...item, ...patch } : item)) });
  };

  const deleteEntry = () => {
    if (!editingEntry) return;
    update({ entries: store.entries.filter((item) => item.id !== editingEntry.id) });
    setEditingEntry(null);
  };

  if (!selectedCategory) {
    return (
      <div className="content">
        <div className="page-heading">
          <div>
            <div className="eyebrow">Kategorien & Dinge</div>
            <h1>Dinge</h1>
            <p className="subtitle">Deine wiederkehrenden Tätigkeiten, sortiert nach Bereich.</p>
          </div>
          <Link href="/einstellungen" className="btn btn-soft" data-testid="link-manage-categories">
            <Settings size={16} />
            Kategorien verwalten
          </Link>
        </div>
        <section className="card card-pad">
          <div className="task-list">
            {store.categories.map((category) => {
              const count = store.things.filter((thing) => thing.categoryId === category.id).length;
              return (
                <button
                  type="button"
                  className="task-row category-row"
                  style={{ borderLeft: `4px solid ${category.color}` }}
                  key={category.id}
                  onClick={() => setSelectedCategoryId(category.id)}
                  data-testid={`button-category-${category.id}`}
                >
                  <span className="icon-btn" style={{ background: category.color, borderColor: category.color, color: "white" }}>
                    <CategoryIcon name={category.icon} />
                  </span>
                  <div className="task-main">
                    <div className="task-name">{category.name}</div>
                    <div className="task-detail">
                      {count} {count === 1 ? "Ding" : "Dinge"}
                    </div>
                  </div>
                  <ChevronRight size={18} color="hsl(var(--muted-foreground))" />
                </button>
              );
            })}
            {store.categories.length === 0 && (
              <div className="empty">
                <strong>Noch keine Kategorien.</strong>
                <p style={{ marginTop: 6 }}>Lege welche in den Einstellungen an.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    );
  }

  const thingsInCategory = store.things.filter((thing) => thing.categoryId === selectedCategory.id);

  return (
    <div className="content">
      <div className="page-heading">
        <div>
          <button className="btn btn-ghost" onClick={() => setSelectedCategoryId(null)} data-testid="button-back-to-categories" style={{ paddingLeft: 0, marginBottom: 8 }}>
            <ArrowLeft size={15} />
            Alle Kategorien
          </button>
          <div className="eyebrow">Kategorie</div>
          <h1>{selectedCategory.name}</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setThingModal("new")} data-testid="button-new-thing">
          <Plus size={16} />
          Neues Ding
        </button>
      </div>
      <section className="card card-pad">
        <div className="task-list">
          {thingsInCategory.map((thing) => (
            <div className="task-row" style={{ borderLeft: `4px solid ${selectedCategory.color}` }} key={thing.id}>
              <div className="task-main">
                <div className="task-name">{thing.name}</div>
                <div className="task-detail">{scheduleLabel(thing.schedule)}</div>
              </div>
              <button type="button" className="btn btn-ghost btn-icon" onClick={() => setStatsThing(thing)} data-testid={`button-stats-${thing.id}`} title="Auswertung">
                <BarChart3 size={16} />
              </button>
              <button type="button" className="btn btn-ghost btn-icon" onClick={() => setThingModal(thing)} data-testid={`button-edit-thing-${thing.id}`} title="Bearbeiten">
                <Pencil size={16} />
              </button>
            </div>
          ))}
          {thingsInCategory.length === 0 && (
            <div className="empty">
              <strong>Noch keine Dinge in dieser Kategorie.</strong>
            </div>
          )}
        </div>
      </section>

      {thingModal && (
        <ThingModal
          thing={thingModal === "new" ? undefined : thingModal}
          categories={store.categories}
          defaultCategoryId={selectedCategory.id}
          onClose={() => setThingModal(null)}
          onSave={saveThing}
          onDelete={thingModal !== "new" ? () => deleteThing(thingModal) : undefined}
        />
      )}
      {statsThing && (
        <ThingStatsDialog
          thing={statsThing}
          entries={store.entries}
          onClose={() => setStatsThing(null)}
          onSelectEntry={(entry) => {
            setStatsThing(null);
            setEditingEntry(entry);
          }}
        />
      )}
      {editingEntry && <EntryEditDialog entry={editingEntry} onClose={() => setEditingEntry(null)} onSave={saveEntry} onDelete={deleteEntry} />}
    </div>
  );
}
