import { useState } from "react";
import { Trash2, X } from "lucide-react";
import type { Category, Thing } from "../types";

export function ThingModal({
  thing,
  categories,
  defaultCategoryId,
  onClose,
  onSave,
  onDelete
}: {
  thing?: Thing;
  categories: Category[];
  defaultCategoryId?: string;
  onClose: () => void;
  onSave: (data: { name: string; categoryId: string }) => void;
  onDelete?: () => void;
}) {
  const [name, setName] = useState(thing?.name ?? "");
  const [categoryId, setCategoryId] = useState(thing?.categoryId ?? defaultCategoryId ?? categories[0]?.id ?? "");

  const submit = () => {
    if (!name.trim() || !categoryId) return;
    onSave({ name: name.trim(), categoryId });
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
