import { useEffect, useState } from "react";
import type { Store } from "./types";

const STORAGE_KEY = "abgehakt-v1";

const FALLBACK_COLORS = ["#2F7A6F", "#C76B3C", "#7A5FB0", "#B0486B", "#4A7FB5", "#8A9A3C"];

// Füllt Felder auf, die in älteren gespeicherten Daten (vor diesem Feature) noch fehlen,
// damit bereits erfasste Kategorien/Dinge nicht verloren gehen.
function normalize(value: Store): Store {
  return {
    ...value,
    categories: value.categories.map((cat, index) => ({ ...cat, color: cat.color ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length] })),
    things: value.things.map((thing) => ({ ...thing, schedule: thing.schedule ?? null })),
    dismissals: value.dismissals ?? []
  };
}

// Ein paar Beispiele zum Start - lassen sich jederzeit umbenennen oder löschen.
const seed: Store = {
  categories: [
    { id: "c1", name: "Haushalt", icon: "Home", color: "#2F7A6F" },
    { id: "c2", name: "Gesundheit", icon: "HeartPulse", color: "#C76B3C" },
    { id: "c3", name: "Sonstiges", icon: "Tag", color: "#7A5FB0" }
  ],
  things: [
    { id: "t1", name: "Spülmaschine ausräumen", categoryId: "c1", schedule: null, createdAt: "2026-01-01", updatedAt: "2026-01-01" },
    { id: "t2", name: "Spaziergang", categoryId: "c2", schedule: null, createdAt: "2026-01-01", updatedAt: "2026-01-01" }
  ],
  entries: [],
  dismissals: []
};

export function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function loadLocalStore(): Store {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value ? normalize({ ...seed, ...JSON.parse(value) }) : seed;
  } catch {
    return seed;
  }
}

function saveLocalStore(store: Store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // z.B. privater Modus / Speicher voll - Anzeige funktioniert trotzdem weiter.
  }
}

// Bewusst nur lokal gespeichert (schnell, kein Setup nötig). Die Form von Store/update()
// entspricht dem Muster aus Hausblick, damit sich bei Bedarf später eine geräteübergreifende
// Cloud-Synchronisierung ergänzen lässt, ohne Seiten/Komponenten umbauen zu müssen.
export function useStore() {
  const [store, setStore] = useState<Store>(loadLocalStore);

  useEffect(() => {
    saveLocalStore(store);
  }, [store]);

  const update = (patch: Partial<Store>) => setStore((old) => ({ ...old, ...patch }));
  return { store, update };
}
