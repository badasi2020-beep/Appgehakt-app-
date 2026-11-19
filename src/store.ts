import { useEffect, useState } from "react";
import type { Store } from "./types";

const STORAGE_KEY = "abgehakt-v1";

// Ein paar Beispiele zum Start - lassen sich jederzeit umbenennen oder löschen.
const seed: Store = {
  categories: [
    { id: "c1", name: "Haushalt", icon: "Home" },
    { id: "c2", name: "Gesundheit", icon: "HeartPulse" },
    { id: "c3", name: "Sonstiges", icon: "Tag" }
  ],
  things: [
    { id: "t1", name: "Spülmaschine ausräumen", categoryId: "c1", createdAt: "2026-01-01", updatedAt: "2026-01-01" },
    { id: "t2", name: "Spaziergang", categoryId: "c2", createdAt: "2026-01-01", updatedAt: "2026-01-01" }
  ],
  entries: []
};

export function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function loadLocalStore(): Store {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value ? { ...seed, ...JSON.parse(value) } : seed;
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
