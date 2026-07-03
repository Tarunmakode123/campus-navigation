import { useSyncExternalStore } from "react";

export const CATEGORIES = [
  "Entry",
  "Living",
  "Bedroom",
  "Kitchen",
  "Utility",
  "Prayer",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Location {
  id: string;
  name: string;
  description: string;
  category: Category;
  purpose?: string;
  person?: string;
  department?: string;
  routeHint?: string;
  steps?: string[];
  mapX?: number;
  mapY?: number;
  floor?: string;
  contact?: string;
  hours?: string;
  latitude?: number;
  longitude?: number;
  image?: string;
}

const STORAGE_KEY = "smart-navigator:home-locations:v1";

const SEED: Location[] = [
  {
    id: "main-gate",
    name: "Main Gate",
    description: "Only QR entry point for the pilot home navigation layout.",
    category: "Entry",
    purpose: "Scan QR and start navigation",
    person: "Visitor starting point",
    department: "Home Entry",
    routeHint: "Scan the Main Gate QR, enter the hall, then choose the room you want to reach.",
    steps: ["Scan the QR at Main Gate", "Move forward into the Hall", "Choose a destination room"],
    mapX: 34,
    mapY: 93,
    floor: "Ground",
    hours: "Open 24/7",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop",
  },
  {
    id: "hall",
    name: "Hall",
    description: "Central room connected to Main Gate, bedrooms, dining, kitchen and bathroom.",
    category: "Living",
    purpose: "Sitting area, central passage, family meeting",
    person: "Family area",
    department: "Home Core",
    routeHint: "From Main Gate, walk straight 7 metres to enter the Hall.",
    steps: ["Start at Main Gate", "Walk straight 7 m", "Enter the Hall"],
    mapX: 38,
    mapY: 61,
    floor: "Ground",
    hours: "Open 24/7",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop",
  },
  {
    id: "first-bedroom",
    name: "1st Bedroom",
    description: "Bedroom on the lower-right side of the house, directly connected to the Hall.",
    category: "Bedroom",
    purpose: "Rest, sleeping room, private room",
    person: "Bedroom",
    department: "Private Room",
    routeHint: "Reach the Hall from Main Gate, then move 0.5 metres to the 1st Bedroom door.",
    steps: ["Move from Main Gate to Hall", "Turn right from Hall", "Enter 1st Bedroom"],
    mapX: 73,
    mapY: 86,
    floor: "Ground",
    hours: "Private room",
    image:
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&auto=format&fit=crop",
  },
  {
    id: "dining-room",
    name: "Dining Room",
    description: "Dining space on the right side, connected to both Hall and Kitchen.",
    category: "Living",
    purpose: "Dining, meals, route to kitchen",
    person: "Dining area",
    department: "Food Area",
    routeHint: "From Hall, move 0.5 metres to the Dining Room.",
    steps: ["Move from Main Gate to Hall", "Turn right into Dining Room"],
    mapX: 77,
    mapY: 58,
    floor: "Ground",
    hours: "Open 24/7",
    image:
      "https://images.unsplash.com/photo-1617104551722-3b2d51366400?w=800&auto=format&fit=crop",
  },
  {
    id: "kitchen",
    name: "Kitchen",
    description: "Kitchen can be entered directly from the Hall or through the Dining Room.",
    category: "Kitchen",
    purpose: "Cooking, food, water, kitchen access",
    person: "Kitchen",
    department: "Food Preparation",
    routeHint:
      "The shortest route from Main Gate is Main Gate to Hall, Hall to Dining Room, then Dining Room to Kitchen.",
    steps: ["Move from Main Gate to Hall", "Enter Dining Room", "Continue to Kitchen"],
    mapX: 72,
    mapY: 34,
    floor: "Ground",
    hours: "Open 24/7",
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&auto=format&fit=crop",
  },
  {
    id: "porch",
    name: "Porch",
    description: "Porch area above the Kitchen in the home layout.",
    category: "Other",
    purpose: "Porch, outside sitting, upper-right area",
    person: "Porch",
    department: "Open Area",
    routeHint: "Reach Kitchen, then move 0.5 metres to the Porch.",
    steps: ["Move to Hall", "Go through Dining Room to Kitchen", "Enter Porch from Kitchen"],
    mapX: 72,
    mapY: 15,
    floor: "Ground",
    hours: "Open 24/7",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop",
  },
  {
    id: "bathroom",
    name: "Bathroom",
    description: "Bathroom on the left side above the Hall.",
    category: "Utility",
    purpose: "Bathroom, washroom, freshen up",
    person: "Bathroom",
    department: "Utility",
    routeHint: "From Hall, move 2 metres toward the upper-left bathroom area.",
    steps: ["Move from Main Gate to Hall", "Turn left toward Bathroom", "Enter Bathroom"],
    mapX: 27,
    mapY: 38,
    floor: "Ground",
    hours: "Open 24/7",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop",
  },
  {
    id: "second-bedroom",
    name: "2nd Bedroom",
    description: "Bedroom on the upper-left side, connected to the Hall and Bhagwan Room.",
    category: "Bedroom",
    purpose: "Bedroom, rest, private room",
    person: "Bedroom",
    department: "Private Room",
    routeHint: "From Hall, move 3 metres toward the 2nd Bedroom.",
    steps: ["Move from Main Gate to Hall", "Continue 3 m to 2nd Bedroom"],
    mapX: 36,
    mapY: 27,
    floor: "Ground",
    hours: "Private room",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop",
  },
  {
    id: "bhagwan-room",
    name: "Bhagwan Room",
    description: "Prayer room at the top-left side of the house layout.",
    category: "Prayer",
    purpose: "Prayer, pooja, Bhagwan Room",
    person: "Prayer room",
    department: "Prayer Area",
    routeHint: "From Hall, enter the 2nd Bedroom route and continue 3 metres to Bhagwan Room.",
    steps: ["Move from Main Gate to Hall", "Go to 2nd Bedroom", "Continue to Bhagwan Room"],
    mapX: 31,
    mapY: 15,
    floor: "Ground",
    hours: "Open 24/7",
    image:
      "https://images.unsplash.com/photo-1599930113854-d6d7fd521f10?w=800&auto=format&fit=crop",
  },
];

let cachedRaw: string | null | undefined;
let cachedLocations: Location[] = SEED;

function mergeSeedLocations(list: Location[]) {
  const byId = new Map(SEED.map((loc) => [loc.id, loc]));
  let changed = false;
  const merged = list.map((loc) => {
    const seed = byId.get(loc.id);
    if (!seed) return loc;
    byId.delete(loc.id);
    const next = { ...seed, ...loc };
    if (
      !loc.purpose ||
      !loc.person ||
      !loc.department ||
      loc.mapX == null ||
      loc.mapY == null
    ) {
      changed = true;
      return next;
    }
    return loc;
  });
  if (byId.size > 0) {
    changed = true;
    merged.push(...byId.values());
  }
  return { changed, locations: merged };
}

function read(): Location[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seedRaw = JSON.stringify(SEED);
      window.localStorage.setItem(STORAGE_KEY, seedRaw);
      cachedRaw = seedRaw;
      cachedLocations = SEED;
      return SEED;
    }
    if (raw === cachedRaw) return cachedLocations;
    const parsed = JSON.parse(raw) as Location[];
    const migrated = mergeSeedLocations(parsed);
    if (migrated.changed) {
      const migratedRaw = JSON.stringify(migrated.locations);
      window.localStorage.setItem(STORAGE_KEY, migratedRaw);
      cachedRaw = migratedRaw;
      cachedLocations = migrated.locations;
      return cachedLocations;
    }
    cachedRaw = raw;
    cachedLocations = parsed;
    return cachedLocations;
  } catch {
    return SEED;
  }
}

function write(list: Location[]) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(list);
  cachedRaw = raw;
  cachedLocations = list;
  window.localStorage.setItem(STORAGE_KEY, raw);
  window.dispatchEvent(new Event("smart-navigator:change"));
}

const subscribe = (cb: () => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("smart-navigator:change", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("smart-navigator:change", cb);
    window.removeEventListener("storage", cb);
  };
};

export function useLocations(): Location[] {
  return useSyncExternalStore(subscribe, read, () => SEED);
}

export function getLocation(id: string): Location | undefined {
  return read().find((l) => l.id === id);
}

export function saveLocation(loc: Location) {
  const all = read();
  const idx = all.findIndex((l) => l.id === loc.id);
  if (idx >= 0) all[idx] = loc;
  else all.push(loc);
  write(all);
}

export function deleteLocation(id: string) {
  write(read().filter((l) => l.id !== id));
}

export function resetLocations() {
  write(SEED);
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
