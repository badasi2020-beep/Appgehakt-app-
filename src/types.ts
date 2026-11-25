export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

// Mo=0 ... So=6, konsistent mit lib/utils dayKey/weekKey und lib/stats startOfRange.
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Schedule =
  | { kind: "once"; date: string } // YYYY-MM-DD, bleibt "überfällig" sichtbar bis erledigt
  | { kind: "daily" }
  | { kind: "weekly"; weekdays: Weekday[] };

// Ein "Ding" ist eine wiederkehrende Tätigkeit, die als Schnellwahl angelegt wird
// (z.B. "Spülmaschine ausräumen"). Einträge verweisen per thingId darauf. Optional trägt
// es einen Zeitplan (schedule), über den es auf der "Heute"-Seite als fällig auftaucht.
export interface Thing {
  id: string;
  name: string;
  categoryId: string;
  schedule: Schedule | null;
  createdAt: string;
  updatedAt: string;
}

// Ein Protokoll-Eintrag: entweder zu einem angelegten "Ding" (thingId gesetzt) oder frei
// eingetippt (thingId = null). nameSnapshot/categoryNameSnapshot bleiben unverändert, auch
// wenn das zugehörige Ding später umbenannt oder gelöscht wird - die Historie bleibt stabil.
export interface Entry {
  id: string;
  thingId: string | null;
  nameSnapshot: string;
  categoryId: string;
  categoryNameSnapshot: string;
  // Zeitpunkt, zu dem die Tätigkeit erledigt/abgehakt wurde - nachträglich änderbar.
  at: string;
  durationMinutes: number | null;
  note?: string;
}

// Bewusstes "Weglegen" einer fälligen Aufgabe, ohne sie als erledigt zu zählen - blendet sie
// für den gewählten Zeitraum auf der "Heute"-Seite aus. Läuft von selbst wieder ab (key-Vergleich).
export interface Dismissal {
  id: string;
  thingId: string;
  scope: "day" | "week";
  key: string; // dayKey bzw. weekKey, für den/die weggelegt wurde
}

export interface Store {
  categories: Category[];
  things: Thing[];
  entries: Entry[];
  dismissals: Dismissal[];
}
