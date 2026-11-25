import { useMemo, useState } from "react";
import { BookOpen, Search } from "lucide-react";
import { EntryEditDialog } from "../components/EntryEditDialog";
import { dayKey, dayLabel, formatDuration, timeOnly } from "../lib/utils";
import type { Entry, Store } from "../types";

export function HistoryPage({ store, update }: { store: Store; update: (patch: Partial<Store>) => void }) {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Entry | null>(null);

  const filtered = store.entries.filter(
    (entry) => entry.nameSnapshot.toLowerCase().includes(search.toLowerCase()) && (!categoryId || entry.categoryId === categoryId)
  );

  const groups = useMemo(() => {
    const byDay = new Map<string, Entry[]>();
    for (const entry of [...filtered].sort((a, b) => b.at.localeCompare(a.at))) {
      const key = dayKey(entry.at);
      if (!byDay.has(key)) byDay.set(key, []);
      byDay.get(key)!.push(entry);
    }
    return [...byDay.entries()];
  }, [filtered]);

  const saveEntry = (patch: Partial<Entry>) => {
    if (!editing) return;
    update({ entries: store.entries.map((item) => (item.id === editing.id ? { ...item, ...patch } : item)) });
  };

  const deleteEntry = () => {
    if (!editing) return;
    update({ entries: store.entries.filter((item) => item.id !== editing.id) });
    setEditing(null);
  };

  const colorFor = (catId: string) => store.categories.find((c) => c.id === catId)?.color;

  return (
    <div className="content">
      <div className="page-heading">
        <div>
          <div className="eyebrow">Was schon erledigt ist</div>
          <h1>Verlauf</h1>
          <p className="subtitle">Dein vollständiges Protokoll, Tag für Tag.</p>
        </div>
      </div>
      <div className="toolbar">
        <Search size={16} color="hsl(var(--muted-foreground))" />
        <input
          className="input search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Durchsuchen"
          data-testid="input-search-history"
        />
      </div>
      <div className="toolbar">
        <button type="button" className={`filter-pill ${categoryId === null ? "active" : ""}`} onClick={() => setCategoryId(null)} data-testid="button-filter-cat-alle">
          Alle Kategorien
        </button>
        {store.categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`filter-pill ${categoryId === cat.id ? "active" : ""}`}
            onClick={() => setCategoryId(cat.id)}
            style={categoryId === cat.id ? { background: cat.color, borderColor: cat.color, color: "white" } : undefined}
            data-testid={`button-filter-cat-${cat.id}`}
          >
            {cat.name}
          </button>
        ))}
      </div>
      {groups.length ? (
        groups.map(([key, entries]) => (
          <section className="card card-pad" key={key} style={{ marginBottom: 14 }}>
            <div className="section-head">
              <h2>{dayLabel(entries[0].at)}</h2>
              <span className="tag">{entries.length} Einträge</span>
            </div>
            <div className="timeline">
              {entries.map((entry) => (
                <button type="button" className="timeline-item entry-item" key={entry.id} onClick={() => setEditing(entry)} data-testid={`history-entry-${entry.id}`}>
                  <div className="timeline-title">
                    <span className="category-dot" style={{ background: colorFor(entry.categoryId), marginRight: 7 }} />
                    {entry.nameSnapshot}
                  </div>
                  <div className="timeline-meta">
                    {timeOnly(entry.at)} · {entry.categoryNameSnapshot}
                    {entry.durationMinutes ? ` · ${formatDuration(entry.durationMinutes)}` : ""}
                    {entry.note ? ` · ${entry.note}` : ""}
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))
      ) : (
        <section className="card card-pad">
          <div className="empty">
            <div className="empty-icon">
              <BookOpen size={21} />
            </div>
            <strong>Noch nichts eingetragen.</strong>
            <p style={{ marginTop: 6 }}>Erledigtes bleibt hier dauerhaft sichtbar.</p>
          </div>
        </section>
      )}
      {editing && <EntryEditDialog entry={editing} onClose={() => setEditing(null)} onSave={saveEntry} onDelete={deleteEntry} />}
    </div>
  );
}
