import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  GraduationCap,
  MapPin,
  MessageSquareText,
  Navigation,
  QrCode,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { CATEGORIES, type Location, useLocations } from "@/lib/locations";
import { clearEntryPoint, useEntryPoint } from "@/lib/entry-point";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Campus Guide - Smart Navigator" },
      {
        name: "description",
        content:
          "Scan a campus QR, choose your work, find the right person or department, and get walking directions.",
      },
      { property: "og:title", content: "Campus Guide" },
      {
        property: "og:description",
        content: "Purpose-based campus navigation for students, parents and visitors.",
      },
    ],
  }),
  component: Home,
});

const PURPOSES = [
  { label: "Admission", hint: "Fees, documents, student records", icon: Building2 },
  { label: "Meet professor", hint: "Faculty cabin and counselling", icon: UserRound },
  { label: "Class", hint: "Classroom, orientation, timetable", icon: GraduationCap },
  { label: "Lab practical", hint: "Computer lab and project work", icon: MessageSquareText },
  { label: "Library", hint: "Books, card and reading room", icon: Search },
  { label: "Hostel", hint: "Room allotment and permissions", icon: MapPin },
];

function Home() {
  const locations = useLocations();
  const entryId = useEntryPoint();
  const entry = locations.find((l) => l.id === entryId);
  const [query, setQuery] = useState("");
  const [purpose, setPurpose] = useState<string>("All");
  const [cat, setCat] = useState<string>("All");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return locations.filter((l) => {
      const haystack = [
        l.name,
        l.description,
        l.category,
        l.purpose,
        l.person,
        l.department,
        l.routeHint,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchQ = !q || haystack.includes(q);
      const matchPurpose =
        purpose === "All" || haystack.includes(purpose.toLowerCase());
      const matchC = cat === "All" || l.category === cat;
      return matchQ && matchPurpose && matchC;
    });
  }, [locations, query, purpose, cat]);

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <AppHeader />

      <main className="mx-auto max-w-5xl px-4 pb-10 pt-4">
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="overflow-hidden rounded-3xl bg-gradient-hero text-primary-foreground shadow-elegant">
            <div className="px-5 py-6 sm:px-7 sm:py-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
                <QrCode className="h-3.5 w-3.5" />
                QR scan based campus guide
              </div>
              <h1 className="mt-4 max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
                Tell the app your work. It tells you the person, place and route.
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 opacity-90 sm:text-base">
                Built for a 35-acre campus flow: students, parents and visitors can search a
                department, choose a task, meet the right person and start guided walking navigation.
              </p>

              <div className="mt-6 flex items-center gap-2 rounded-2xl bg-white p-2 shadow-card">
                <Search className="ml-2 h-5 w-5 shrink-0 text-muted-foreground" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search work, person, department or room"
                  className="min-w-0 flex-1 bg-transparent py-2.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
            </div>
          </div>

          <CampusMap locations={locations} />
        </section>

        {entry && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-accent/30 bg-accent/10 p-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
              <QrCode className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                QR scanned entry point
              </div>
              <div className="truncate text-sm font-semibold text-foreground">{entry.name}</div>
            </div>
            <button
              onClick={() => clearEntryPoint()}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Clear entry point"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <section className="mt-6">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold tracking-tight">What work do you have?</h2>
              <p className="text-sm text-muted-foreground">
                Choose a purpose, then pick the matching destination.
              </p>
            </div>
            {purpose !== "All" && (
              <button
                onClick={() => setPurpose("All")}
                className="text-xs font-medium text-primary hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {PURPOSES.map((item) => {
              const Icon = item.icon;
              const active = purpose === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => setPurpose(item.label)}
                  className={`flex min-h-20 items-center gap-3 rounded-2xl border p-3 text-left transition-all ${
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-elegant"
                      : "border-border bg-card text-foreground shadow-card hover:border-primary/30"
                  }`}
                >
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                      active ? "bg-white/15" : "bg-secondary text-primary"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{item.label}</span>
                    <span
                      className={`mt-0.5 block text-xs ${
                        active ? "text-primary-foreground/80" : "text-muted-foreground"
                      }`}
                    >
                      {item.hint}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-6">
          <div className="-mx-4 mb-4 overflow-x-auto px-4">
            <div className="flex gap-2">
              {["All", ...CATEGORIES].map((c) => {
                const active = cat === c;
                return (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                      active
                        ? "border-primary bg-primary text-primary-foreground shadow-card"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              {query || purpose !== "All" ? "Matching places" : "Campus directory"}
            </h2>
            <span className="text-xs text-muted-foreground">{results.length} places</span>
          </div>

          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <MapPin className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                No place matches this search. Try a person, department or task.
              </p>
            </div>
          ) : (
            <ul className="grid gap-3 md:grid-cols-2">
              {results.map((loc) => (
                <li key={loc.id}>
                  <LocationCard loc={loc} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

function LocationCard({ loc }: { loc: Location }) {
  return (
    <Link
      to="/location/$id"
      params={{ id: loc.id }}
      className="group grid h-full grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-elegant"
    >
      <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-hero text-primary-foreground">
        {loc.image ? (
          <img src={loc.image} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <MapPin className="h-5 w-5" />
        )}
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-foreground">{loc.name}</div>
        <div className="mt-1 truncate text-xs text-muted-foreground">
          {loc.purpose ?? loc.description}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
            {loc.category}
          </span>
          {loc.person && (
            <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
              {loc.person}
            </span>
          )}
        </div>
      </div>
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-primary transition-transform group-hover:translate-x-0.5">
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}

function CampusMap({ locations }: { locations: Location[] }) {
  const plotted = locations.filter((l) => l.mapX != null && l.mapY != null);

  return (
    <div className="relative min-h-80 overflow-hidden rounded-3xl border border-border bg-card shadow-card">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,oklch(0.94_0.012_240)_1px,transparent_1px),linear-gradient(0deg,oklch(0.94_0.012_240)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <path
          d="M10 84 C28 76, 30 56, 39 52 S53 40, 62 36 S69 30, 70 22"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray="3 3"
        />
        <path
          d="M39 52 C48 62, 48 72, 54 72 S72 74, 84 78"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeDasharray="3 3"
        />
        <rect x="27" y="18" width="18" height="18" rx="3" fill="oklch(0.91 0.02 240)" />
        <rect x="55" y="26" width="18" height="18" rx="3" fill="oklch(0.91 0.02 240)" />
        <rect x="69" y="49" width="18" height="18" rx="3" fill="oklch(0.91 0.02 240)" />
        <rect x="46" y="65" width="18" height="16" rx="3" fill="oklch(0.91 0.02 240)" />
      </svg>
      <div className="absolute left-4 top-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Live campus map
        </p>
        <h2 className="text-xl font-bold tracking-tight">35 acre navigation</h2>
      </div>
      {plotted.map((loc) => (
        <Link
          key={loc.id}
          to="/location/$id"
          params={{ id: loc.id }}
          className="absolute grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow-elegant"
          style={{ left: `${loc.mapX}%`, top: `${loc.mapY}%` }}
          title={loc.name}
        >
          <MapPin className="h-3.5 w-3.5" />
        </Link>
      ))}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-2xl bg-white/90 p-3 text-xs shadow-card backdrop-blur">
        <div>
          <div className="font-semibold text-foreground">Scan, choose work, follow route</div>
          <div className="text-muted-foreground">AR-style route guidance is on each destination.</div>
        </div>
        <Navigation className="h-5 w-5 shrink-0 text-primary" />
      </div>
    </div>
  );
}
