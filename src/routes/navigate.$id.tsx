import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Footprints, MapPin, Navigation, Ruler, Play } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useLocations } from "@/lib/locations";
import { useEntryPoint } from "@/lib/entry-point";

export const Route = createFileRoute("/navigate/$id")({
  head: () => ({
    meta: [{ title: "Navigation — Smart Navigator" }],
  }),
  component: NavigatePage,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">
      Destination not found
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-6 text-center text-sm text-destructive">{error.message}</div>
  ),
});

// Haversine in meters
function distance(a: [number, number], b: [number, number]) {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const x =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

function NavigatePage() {
  const { id } = Route.useParams();
  const all = useLocations();
  const dest = all.find((l) => l.id === id);
  if (!dest) throw notFound();

  const entryId = useEntryPoint();
  const entry =
    all.find((l) => l.id === entryId) ?? all.find((l) => l.id === "main-gate") ?? all[0];
  const [pos, setPos] = useState<[number, number] | null>(
    entry?.latitude != null && entry?.longitude != null
      ? [entry.latitude, entry.longitude]
      : null,
  );
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (p) => setPos([p.coords.latitude, p.coords.longitude]),
      () => {},
      { enableHighAccuracy: true, timeout: 5000 },
    );
  }, []);

  const meters = useMemo(() => {
    if (!pos || dest.latitude == null || dest.longitude == null) return null;
    const m = distance(pos, [dest.latitude, dest.longitude]);
    // Demo apps may have very tiny lat/lng deltas — floor to a sensible number
    return Math.max(15, Math.round(m));
  }, [pos, dest]);

  const minutes = meters ? Math.max(1, Math.round(meters / 80)) : null; // ~80m/min walking

  return (
    <div className="min-h-screen bg-gradient-subtle pb-24">
      <AppHeader />

      <div className="mx-auto max-w-3xl px-4 pt-4">
        <Link
          to="/location/$id"
          params={{ id: dest.id }}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to {dest.name}
        </Link>
      </div>

      <main className="mx-auto mt-4 max-w-3xl space-y-4 px-4">
        {/* Map */}
        <div className="relative h-72 overflow-hidden rounded-3xl border border-border bg-card shadow-card sm:h-96">
          <MapCanvas
            from={pos}
            to={
              dest.latitude != null && dest.longitude != null
                ? [dest.latitude, dest.longitude]
                : null
            }
            animating={started}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Stat
            icon={<Ruler className="h-4 w-4" />}
            label="Distance"
            value={meters ? `${meters} m` : "—"}
          />
          <Stat
            icon={<Footprints className="h-4 w-4" />}
            label="Walking time"
            value={minutes ? `${minutes} min` : "—"}
          />
        </div>

        {/* Route steps */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
          <h2 className="mb-3 text-sm font-semibold">Route</h2>
          <ol className="space-y-3">
            <Step n={1} title="You are here" sub={entry?.name ?? "Current position"} />
            <Step n={2} title={`Head toward ${dest.category}`} sub="Follow the highlighted path" />
            <Step
              n={3}
              title={`Arrive at ${dest.name}`}
              sub={dest.floor ? `Floor ${dest.floor}` : "Destination"}
              done
            />
          </ol>
        </div>

        <button
          onClick={() => setStarted((s) => !s)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-hero px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-elegant transition-transform active:scale-[0.98]"
        >
          {started ? <Navigation className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {started ? "Navigating…" : "Start Navigation"}
        </button>
      </main>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        {icon} {label}
      </div>
      <div className="mt-1 text-xl font-bold tracking-tight text-foreground">{value}</div>
    </div>
  );
}

function Step({
  n,
  title,
  sub,
  done,
}: {
  n: number;
  title: string;
  sub: string;
  done?: boolean;
}) {
  return (
    <li className="flex items-start gap-3">
      <div
        className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
          done
            ? "bg-accent text-accent-foreground"
            : "bg-primary text-primary-foreground"
        }`}
      >
        {done ? "✓" : n}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
    </li>
  );
}

function MapCanvas({
  from,
  to,
  animating,
}: {
  from: [number, number] | null;
  to: [number, number] | null;
  animating: boolean;
}) {
  // Stylized abstract map - SVG with grid and animated route line
  return (
    <div className="relative h-full w-full bg-[oklch(0.96_0.02_220)]">
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="oklch(0.88 0.02 220)" strokeWidth="1" />
          </pattern>
          <linearGradient id="route" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-primary-glow)" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#grid)" />
        {/* Buildings */}
        <rect x="40" y="40" width="80" height="60" rx="6" fill="oklch(0.9 0.02 240)" />
        <rect x="280" y="60" width="80" height="80" rx="6" fill="oklch(0.9 0.02 240)" />
        <rect x="160" y="180" width="120" height="70" rx="6" fill="oklch(0.9 0.02 240)" />
        {/* Route */}
        <path
          d="M 60 240 Q 140 240 180 180 T 320 100"
          fill="none"
          stroke="url(#route)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="10 8"
          className={animating ? "animate-pulse" : ""}
        />
        {/* Start */}
        <circle cx="60" cy="240" r="9" fill="var(--color-accent)" />
        <circle cx="60" cy="240" r="14" fill="var(--color-accent)" opacity="0.3">
          <animate attributeName="r" from="9" to="22" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.4" to="0" dur="1.5s" repeatCount="indefinite" />
        </circle>
        {/* End */}
        <circle cx="320" cy="100" r="9" fill="var(--color-primary)" />
        <g transform="translate(308 76)">
          <path
            d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24c0-6.6-5.4-12-12-12z"
            fill="var(--color-primary)"
          />
          <circle cx="12" cy="12" r="5" fill="white" />
        </g>
      </svg>
      <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-foreground shadow-card backdrop-blur">
        <MapPin className="mr-1 inline h-3 w-3 text-primary" />
        {from ? "Live position" : "Estimated route"}
      </div>
    </div>
  );
}
