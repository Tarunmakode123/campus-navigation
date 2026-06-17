import { useSyncExternalStore } from "react";

export const CATEGORIES = [
  "Academic",
  "Administrative",
  "Hostel",
  "Library",
  "Laboratory",
  "Cafeteria",
  "Residential",
  "Parking",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Location {
  id: string;
  name: string;
  description: string;
  category: Category;
  floor?: string;
  contact?: string;
  hours?: string;
  latitude?: number;
  longitude?: number;
  image?: string;
}

const STORAGE_KEY = "smart-navigator:locations";

const SEED: Location[] = [
  {
    id: "main-gate",
    name: "Main Gate",
    description: "Primary campus entrance with security checkpoint and visitor reception.",
    category: "Other",
    floor: "Ground",
    contact: "Security: +1 555-0100",
    hours: "Open 24/7",
    latitude: 28.6139,
    longitude: 77.209,
    image:
      "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop",
  },
  {
    id: "library",
    name: "Central Library",
    description: "Three-floor library with study rooms, digital archives and 50,000+ titles.",
    category: "Library",
    floor: "1-3",
    contact: "librarian@campus.edu",
    hours: "Mon-Sat · 8:00 AM – 10:00 PM",
    latitude: 28.6142,
    longitude: 77.2095,
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop",
  },
  {
    id: "admin-office",
    name: "Admin Office",
    description: "Administration block for admissions, fees and student records.",
    category: "Administrative",
    floor: "1",
    contact: "admin@campus.edu",
    hours: "Mon-Fri · 9:00 AM – 5:00 PM",
    latitude: 28.6145,
    longitude: 77.2088,
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop",
  },
  {
    id: "classroom-a101",
    name: "Classroom A101",
    description: "Lecture hall in Block A with capacity for 80 students.",
    category: "Academic",
    floor: "1",
    hours: "As per timetable",
    latitude: 28.6148,
    longitude: 77.2092,
    image:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop",
  },
  {
    id: "computer-lab",
    name: "Computer Lab",
    description: "60 workstations with high-speed internet and development tools.",
    category: "Laboratory",
    floor: "2",
    contact: "lab.cs@campus.edu",
    hours: "Mon-Sat · 9:00 AM – 8:00 PM",
    latitude: 28.6151,
    longitude: 77.2097,
    image:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop",
  },
  {
    id: "parking-area",
    name: "Parking Area",
    description: "Multi-level parking with 200 four-wheeler and 400 two-wheeler slots.",
    category: "Parking",
    floor: "Basement",
    hours: "Open 24/7",
    latitude: 28.6135,
    longitude: 77.2085,
    image:
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&auto=format&fit=crop",
  },
];

function read(): Location[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
      return SEED;
    }
    return JSON.parse(raw) as Location[];
  } catch {
    return SEED;
  }
}

function write(list: Location[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
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
