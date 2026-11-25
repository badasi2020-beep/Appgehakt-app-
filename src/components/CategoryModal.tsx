import { useState } from "react";
import { Trash2, X } from "lucide-react";
import { CATEGORY_ICONS, CategoryIcon } from "./CategoryIcon";
import { CATEGORY_COLORS } from "../lib/colors";
import type { Category } from "../types";

export function CategoryModal({
  category,
  onClose,
  onSave,
  onDelete
}: {
  category?: Category;
  onClose: () => void;
  onSave: (data: { name: string; icon: string; color: string }) => void;
  onDelete?: () => void;
}) {
  const [name, setName] = useState(category?.name ?? "");
  const [icon, setIcon] = useState(category?.icon ?? CATEGORY_ICONS[0]);
  const [color, setColor] = useState(category?.color ?? CATEGORY_COLORS[0]);

  const submit = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), icon, color });
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-head">
          <div>
            <div className="eyebrow">Kategorie</div>
            <h2 style={{ marginTop: 6 }}>{category ? "Bearbeiten" : "Neue Kategorie"}</h2>
          </div>
          <button type="button" className="btn btn-ghost btn-icon" onClick={onClose} data-testid="button-close-category">
            <X size={18} />
          </button>
        </div>
        <div className="form-grid">
          <div className="field full">
            <label htmlFor="category-name">Name</label>
            <input id="category-name" className="input" value={name} onChange={(e) => setName(e.target.value)} data-testid="input-category-name" />
          </div>
          <div className="field full">
            <label>Symbol</label>
            <div className="icon-choice">
              {CATEGORY_ICONS.map((value) => (
                <button
                  type="button"
                  key={value}
                  className={`icon-btn ${icon === value ? "active" : ""}`}
                  onClick={() => setIcon(value)}
                  data-testid={`button-icon-${value}`}
                  style={icon === value ? { background: color, borderColor: color, color: "white" } : undefined}
                >
                  <CategoryIcon name={value} />
                </button>
              ))}
            </div>
          </div>
          <div className="field full">
            <label>Farbe</label>
            <div className="color-choice">
              {CATEGORY_COLORS.map((value) => (
                <button
                  type="button"
                  key={value}
                  className={`color-swatch ${color === value ? "active" : ""}`}
                  style={{ background: value }}
                  onClick={() => setColor(value)}
                  data-testid={`button-color-${value}`}
                  title={value}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="form-actions" style={{ justifyContent: onDelete ? "space-between" : "flex-end" }}>
          {onDelete && (
            <button type="button" className="btn btn-danger" onClick={onDelete} data-testid="button-delete-category">
              <Trash2 size={15} />
              Löschen
            </button>
          )}
          <div style={{ display: "flex", gap: 9 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose} data-testid="button-cancel-category">
              Abbrechen
            </button>
            <button type="button" className="btn btn-primary" onClick={submit} data-testid="button-save-category">
              Speichern
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
