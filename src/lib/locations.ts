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

const STORAGE_KEY = "smart-navigator:locations";

const SEED: Location[] = [
  {
    id: "main-gate",
    name: "Main Gate",
    description: "Primary campus entry point. Scan the QR here to start guided navigation.",
    category: "Other",
    purpose: "Start navigation",
    person: "Security desk",
    department: "Campus Entry",
    routeHint: "Use this as your starting point after scanning the entry QR.",
    steps: ["Enter through security", "Open the Smart Navigator QR link", "Choose your work or destination"],
    mapX: 10,
    mapY: 84,
    floor: "Ground",
    contact: "Security: +91 731 000 0100",
    hours: "Open 24/7",
    latitude: 28.6139,
    longitude: 77.209,
    image:
      "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop",
  },
  {
    id: "library",
    name: "Central Library",
    description: "Library help desk, reading rooms, digital books and student reference support.",
    category: "Library",
    purpose: "Library card, books, reading room",
    person: "Librarian",
    department: "Library",
    routeHint: "Walk straight from the main gate, turn right after Block A, then enter the library lobby.",
    steps: ["Go straight from Main Gate", "Turn right at Block A", "Continue 80 m", "Enter Central Library"],
    mapX: 62,
    mapY: 36,
    floor: "1-3",
    contact: "librarian@campus.edu",
    hours: "Mon-Sat, 8:00 AM - 10:00 PM",
    latitude: 28.6142,
    longitude: 77.2095,
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop",
  },
  {
    id: "admin-office",
    name: "Admin Office",
    description: "Admissions, fees, certificates, student records and general campus help.",
    category: "Administrative",
    purpose: "Admission, fees, documents",
    person: "Admin officer",
    department: "Administration",
    routeHint: "Move past reception, take the left corridor, then enter the first-floor admin counter.",
    steps: ["Start at Main Gate", "Walk to Reception", "Take the left corridor", "Go to Floor 1 Admin Office"],
    mapX: 39,
    mapY: 52,
    floor: "1",
    contact: "admin@campus.edu",
    hours: "Mon-Fri, 9:00 AM - 5:00 PM",
    latitude: 28.6145,
    longitude: 77.2088,
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop",
  },
  {
    id: "classroom-a101",
    name: "Block A - Classroom A101",
    description: "Lecture hall for first-year classes, orientation sessions and counselling briefings.",
    category: "Academic",
    purpose: "Class, counselling, orientation",
    person: "Class coordinator",
    department: "Academic Block A",
    routeHint: "Head to Block A from the central path and use the first-floor corridor.",
    steps: ["Follow the central path", "Enter Block A", "Go to Floor 1", "Classroom A101 is on the right"],
    mapX: 35,
    mapY: 28,
    floor: "1",
    hours: "As per timetable",
    latitude: 28.6148,
    longitude: 77.2092,
    image:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop",
  },
  {
    id: "computer-lab",
    name: "Computer Science Lab",
    description: "Computer lab for practicals, project work, software access and technical help.",
    category: "Laboratory",
    purpose: "Lab practical, project, software help",
    person: "Lab in-charge",
    department: "Computer Science",
    routeHint: "Use the academic walkway, enter the CS wing, then go to the second-floor lab.",
    steps: ["Walk toward Academic Block", "Enter CS wing", "Take stairs to Floor 2", "Computer Lab is beside faculty room"],
    mapX: 76,
    mapY: 56,
    floor: "2",
    contact: "lab.cs@campus.edu",
    hours: "Mon-Sat, 9:00 AM - 8:00 PM",
    latitude: 28.6151,
    longitude: 77.2097,
    image:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop",
  },
  {
    id: "professor-cabin",
    name: "Professor Cabin - Dr. Pooja Gupta",
    description: "Faculty cabin for academic counselling, project guidance and department queries.",
    category: "Academic",
    purpose: "Meet professor, counselling, project guidance",
    person: "Dr. Pooja Gupta",
    department: "Information Technology",
    routeHint: "Go to the IT department, take the second corridor, and look for Cabin IT-204.",
    steps: ["Start from Main Gate", "Walk toward IT Department", "Take the second corridor", "Cabin IT-204 is on the left"],
    mapX: 70,
    mapY: 22,
    floor: "2",
    contact: "pooja.gupta@campus.edu",
    hours: "Mon-Fri, 11:00 AM - 3:00 PM",
    latitude: 28.615,
    longitude: 77.209,
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&auto=format&fit=crop",
  },
  {
    id: "hostel-office",
    name: "Hostel Office",
    description: "Hostel admission, room allotment, visitor permission and resident support desk.",
    category: "Hostel",
    purpose: "Hostel allotment, permission, room query",
    person: "Hostel warden",
    department: "Hostel Administration",
    routeHint: "Continue past the library and follow the residential lane to the hostel office.",
    steps: ["Walk past Central Library", "Continue on residential lane", "Turn left near Cafeteria", "Hostel Office is ahead"],
    mapX: 84,
    mapY: 78,
    floor: "Ground",
    contact: "hostel@campus.edu",
    hours: "Mon-Sat, 10:00 AM - 6:00 PM",
    latitude: 28.6154,
    longitude: 77.2102,
    image:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop",
  },
  {
    id: "cafeteria",
    name: "Campus Cafeteria",
    description: "Food court and common meeting area for students, parents and visitors.",
    category: "Cafeteria",
    purpose: "Food, waiting area, visitor meeting",
    person: "Cafeteria manager",
    department: "Student Amenities",
    routeHint: "Take the central path and turn toward the student amenities area.",
    steps: ["Move to central campus path", "Pass Block A", "Turn toward student amenities", "Cafeteria entrance is ahead"],
    mapX: 54,
    mapY: 72,
    floor: "Ground",
    contact: "cafeteria@campus.edu",
    hours: "Mon-Sat, 8:00 AM - 8:00 PM",
    latitude: 28.614,
    longitude: 77.2101,
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop",
  },
  {
    id: "parking-area",
    name: "Parking Area",
    description: "Multi-level parking with four-wheeler and two-wheeler slots.",
    category: "Parking",
    purpose: "Vehicle parking",
    person: "Parking supervisor",
    department: "Facilities",
    routeHint: "Turn left from the main gate before the academic blocks.",
    steps: ["Enter campus", "Turn left after security", "Follow parking sign boards", "Park in the marked zone"],
    mapX: 19,
    mapY: 63,
    floor: "Basement",
    hours: "Open 24/7",
    latitude: 28.6135,
    longitude: 77.2085,
    image:
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&auto=format&fit=crop",
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
