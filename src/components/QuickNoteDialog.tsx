import { useState } from "react";
import { X } from "lucide-react";

export function QuickNoteDialog({ title, onClose, onSave }: { title: string; onClose: () => void; onSave: (note: string) => void }) {
  const [note, setNote] = useState("");

  const submit = () => {
    onSave(note.trim());
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal" style={{ maxWidth: 420 }}>
        <div className="modal-head">
          <div>
            <div className="eyebrow">Mit Notiz eintragen</div>
            <h2 style={{ marginTop: 6 }}>{title}</h2>
          </div>
          <button type="button" className="btn btn-ghost btn-icon" onClick={onClose} data-testid="button-close-quicknote">
            <X size={18} />
          </button>
        </div>
        <div className="field full">
          <label htmlFor="quick-note">Zusatzinfo</label>
          <input
            id="quick-note"
            className="input"
            autoFocus
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Zum Beispiel: von beiden"
            onKeyDown={(e) => e.key === "Enter" && submit()}
            data-testid="input-quicknote"
          />
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose} data-testid="button-cancel-quicknote">
            Abbrechen
          </button>
          <button type="button" className="btn btn-primary" onClick={submit} data-testid="button-save-quicknote">
            Eintragen
          </button>
        </div>
      </div>
    </div>
  );
}
