export interface Category {
  id: string;
  name: string;
  icon: string;
}

// Ein "Ding" ist eine wiederkehrende Tätigkeit, die als Schnellwahl angelegt wird
// (z.B. "Spülmaschine ausräumen"). Einträge verweisen per thingId darauf.
export interface Thing {
  id: string;
  name: string;
  categoryId: string;
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

export interface Store {
  categories: Category[];
  things: Thing[];
  entries: Entry[];
}
