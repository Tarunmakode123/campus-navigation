import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, MapPin, QrCode, ArrowRight, X } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useLocations, CATEGORIES } from "@/lib/locations";
import { clearEntryPoint, useEntryPoint } from "@/lib/entry-point";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Navigator — Find your way, instantly" },
      {
        name: "description",
        content:
          "Scan, search and navigate any campus, hospital or office. Smart Navigator gets visitors to the right place in seconds.",
      },
      { property: "og:title", content: "Smart Navigator" },
      {
        property: "og:description",
        content: "Scan, search and navigate any mapped environment.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const locations = useLocations();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("All");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return locations.filter((l) => {
      const matchQ =
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q);
      const matchC = cat === "All" || l.category === cat;
      return matchQ && matchC;
    });
  }, [locations, query, cat]);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <AppHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-95" />
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-glow/40 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-4 pt-10 pb-14 text-primary-foreground sm:pt-14 sm:pb-20">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
            <QrCode className="h-3 w-3" />
            Scan · Search · Navigate
          </div>
          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            Find anywhere on campus,
            <br className="hidden sm:block" />
            <span className="opacity-90">in seconds.</span>
          </h1>
          <p className="mt-3 max-w-lg text-sm opacity-90 sm:text-base">
            Search libraries, classrooms, labs and offices. Get instant walking directions
            from where you are.
          </p>

          <div className="mt-6 flex items-center gap-2 rounded-2xl bg-white p-2 shadow-elegant">
            <Search className="ml-2 h-5 w-5 shrink-0 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Library, Lab, Admin Office…"
              className="min-w-0 flex-1 bg-transparent py-2.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-6">
        <div className="-mx-4 mb-5 overflow-x-auto px-4">
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
            {query ? `Results for "${query}"` : "All locations"}
          </h2>
          <span className="text-xs text-muted-foreground">{results.length} places</span>
        </div>

        {results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <MapPin className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              No locations match your search.
            </p>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {results.map((loc) => (
              <li key={loc.id}>
                <Link
                  to="/location/$id"
                  params={{ id: loc.id }}
                  className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-elegant"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-hero text-primary-foreground">
                    {loc.image ? (
                      <img
                        src={loc.image}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <MapPin className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-foreground">
                      {loc.name}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                        {loc.category}
                      </span>
                      {loc.floor && <span>Floor {loc.floor}</span>}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
