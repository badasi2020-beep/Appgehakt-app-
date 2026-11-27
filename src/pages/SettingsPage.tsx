import { useRef, useState } from "react";
import { Download, Pencil, Plus, Upload } from "lucide-react";
import { CategoryIcon } from "../components/CategoryIcon";
import { CategoryModal } from "../components/CategoryModal";
import { makeId, normalize, seed } from "../store";
import type { Category, Store } from "../types";

export function SettingsPage({ store, update, notify }: { store: Store; update: (patch: Partial<Store>) => void; notify: (text: string) => void }) {
  const [categoryModal, setCategoryModal] = useState<Category | "new" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveCategory = (data: { name: string; icon: string; color: string }) => {
    if (categoryModal && categoryModal !== "new") {
      update({ categories: store.categories.map((cat) => (cat.id === categoryModal.id ? { ...cat, ...data } : cat)) });
      notify("Kategorie aktualisiert.");
    } else {
      update({ categories: [...store.categories, { id: makeId("cat"), ...data }] });
      notify("Kategorie angelegt.");
    }
  };

  const deleteCategory = (category: Category) => {
    const inUse = store.things.some((thing) => thing.categoryId === category.id);
    if (inUse) {
      notify("Erst alle Dinge aus dieser Kategorie verschieben oder löschen.");
      return;
    }
    update({ categories: store.categories.filter((cat) => cat.id !== category.id) });
    setCategoryModal(null);
    notify("Kategorie gelöscht.");
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(store, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `abgehakt-sicherung-${stamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify("Sicherung gespeichert.");
  };

  const importData = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text());
      if (!Array.isArray(parsed?.categories) || !Array.isArray(parsed?.things) || !Array.isArray(parsed?.entries)) {
        notify("Das sieht nicht nach einer Abgehakt-Sicherung aus.");
        return;
      }
      const ok = window.confirm("Die aktuell auf diesem Gerät gespeicherten Daten werden dabei durch die Sicherung ersetzt. Fortfahren?");
      if (!ok) return;
      update(normalize({ ...seed, ...parsed }));
      notify("Daten wiederhergestellt.");
    } catch {
      notify("Datei konnte nicht gelesen werden.");
    }
  };

  return (
    <div className="content">
      <div className="page-heading">
        <div>
          <div className="eyebrow">Einstellungen</div>
          <h1>Kategorien</h1>
          <p className="subtitle">Symbol und Farbe jeder Kategorie - die Farbe macht sie überall in der App auf einen Blick erkennbar.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setCategoryModal("new")} data-testid="button-new-category">
          <Plus size={16} />
          Neue Kategorie
        </button>
      </div>
      <section className="card card-pad">
        <div className="task-list">
          {store.categories.map((category) => {
            const count = store.things.filter((thing) => thing.categoryId === category.id).length;
            return (
              <div className="task-row" style={{ borderLeft: `4px solid ${category.color}` }} key={category.id}>
                <span className="icon-btn" style={{ background: category.color, borderColor: category.color, color: "white" }}>
                  <CategoryIcon name={category.icon} />
                </span>
                <div className="task-main">
                  <div className="task-name">{category.name}</div>
                  <div className="task-detail">
                    {count} {count === 1 ? "Ding" : "Dinge"}
                  </div>
                </div>
                <button type="button" className="btn btn-ghost btn-icon" onClick={() => setCategoryModal(category)} data-testid={`button-edit-category-${category.id}`}>
                  <Pencil size={16} />
                </button>
              </div>
            );
          })}
          {store.categories.length === 0 && (
            <div className="empty">
              <strong>Noch keine Kategorien.</strong>
              <p style={{ marginTop: 6 }}>Leg oben eine neue an.</p>
            </div>
          )}
        </div>
      </section>

      <section className="card card-pad" style={{ marginTop: 18 }}>
        <div className="section-head">
          <div>
            <div className="section-label">Deine Daten</div>
            <h2 style={{ marginTop: 5 }}>Sichern &amp; Wiederherstellen</h2>
          </div>
        </div>
        <p className="subtitle" style={{ marginTop: 0, marginBottom: 16 }}>
          Alles liegt nur auf diesem Gerät/in diesem Browser. Lade regelmäßig eine Sicherung herunter - z.B. um sie auf ein anderes
          Gerät oder einen anderen Browser zu übertragen.
        </p>
        <div className="toolbar" style={{ marginBottom: 0 }}>
          <button type="button" className="btn btn-soft" onClick={exportData} data-testid="button-export-data">
            <Download size={16} />
            Sichern
          </button>
          <button type="button" className="btn btn-soft" onClick={() => fileInputRef.current?.click()} data-testid="button-import-data">
            <Upload size={16} />
            Wiederherstellen
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) importData(file);
              e.target.value = "";
            }}
            data-testid="input-import-file"
          />
        </div>
      </section>

      {categoryModal && (
        <CategoryModal
          category={categoryModal === "new" ? undefined : categoryModal}
          onClose={() => setCategoryModal(null)}
          onSave={saveCategory}
          onDelete={categoryModal !== "new" ? () => deleteCategory(categoryModal) : undefined}
        />
      )}
    </div>
  );
}
