import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Footprints,
  MapPin,
  Mic,
  MicOff,
  Navigation,
  Play,
  Ruler,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useLocations } from "@/lib/locations";
import { useEntryPoint } from "@/lib/entry-point";

export const Route = createFileRoute("/navigate/$id")({
  head: () => ({
    meta: [{ title: "Guided Route - Smart Navigator" }],
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

function distance(a: [number, number], b: [number, number]) {
  const earthRadius = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadius * Math.asin(Math.sqrt(x));
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
  const [voice, setVoice] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);

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
    return Math.max(25, Math.round(distance(pos, [dest.latitude, dest.longitude])));
  }, [pos, dest]);

  const minutes = meters ? Math.max(1, Math.round(meters / 80)) : null;
  const steps = dest.steps?.length
    ? dest.steps
    : ["Start from campus entry", "Follow the highlighted path", `Arrive at ${dest.name}`];
  const currentStep = steps[Math.min(stepIndex, steps.length - 1)];
  const progress = Math.round(((stepIndex + 1) / steps.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-subtle pb-24">
      <AppHeader />

      <div className="mx-auto max-w-5xl px-4 pt-4">
        <Link
          to="/location/$id"
          params={{ id: dest.id }}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to {dest.name}
        </Link>
      </div>

      <main className="mx-auto mt-4 grid max-w-5xl gap-4 px-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
          <div className="relative h-[520px] bg-slate-900 text-white">
            {dest.image && (
              <img
                src={dest.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-40"
              />
            )}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_0,rgba(2,6,23,0.2)_34%,rgba(2,6,23,0.88)_78%)]" />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
              <div className="rounded-full bg-black/35 px-3 py-1 text-xs font-medium backdrop-blur">
                AR route preview
              </div>
              <button
                onClick={() => setVoice((v) => !v)}
                className="grid h-10 w-10 place-items-center rounded-full bg-black/35 backdrop-blur"
                aria-label={voice ? "Turn voice guidance off" : "Turn voice guidance on"}
              >
                {voice ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </button>
            </div>

            <div className="absolute left-1/2 top-[36%] -translate-x-1/2 text-center">
              <div className="mx-auto grid h-24 w-24 place-items-center rounded-full border border-white/30 bg-primary/90 shadow-elegant">
                <Navigation className="h-12 w-12" />
              </div>
              <div className="mt-4 rounded-2xl bg-black/55 px-4 py-3 backdrop-blur">
                <div className="text-xs uppercase tracking-wide text-white/70">Next direction</div>
                <div className="mt-1 text-lg font-bold">{currentStep}</div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="rounded-3xl bg-white p-4 text-foreground shadow-elegant">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Destination
                    </div>
                    <h1 className="mt-1 truncate text-xl font-bold tracking-tight">{dest.name}</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                      From {entry?.name ?? "current position"}
                    </p>
                  </div>
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
                    <MapPin className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${started ? progress : 8}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Stat
              icon={<Ruler className="h-4 w-4" />}
              label="Distance"
              value={meters ? `${meters} m` : "Demo route"}
            />
            <Stat
              icon={<Footprints className="h-4 w-4" />}
              label="Walking"
              value={minutes ? `${minutes} min` : "3 min"}
            />
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
            <h2 className="text-sm font-semibold">Route steps</h2>
            <ol className="mt-3 space-y-3">
              {steps.map((step, index) => (
                <li key={step} className="flex items-start gap-3">
                  <button
                    onClick={() => {
                      setStarted(true);
                      setStepIndex(index);
                    }}
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                      index <= stepIndex && started
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                    aria-label={`Show step ${index + 1}`}
                  >
                    {index + 1}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-foreground">{step}</div>
                    <div className="text-xs text-muted-foreground">
                      {index === 0 ? "Start" : index === steps.length - 1 ? "Arrive" : "Continue"}
                    </div>
                  </div>
                  <ChevronRight className="mt-1 h-4 w-4 text-muted-foreground" />
                </li>
              ))}
            </ol>
          </div>

          <MiniMap
            from={{ x: entry?.mapX ?? 10, y: entry?.mapY ?? 84, label: entry?.name ?? "Entry" }}
            to={{ x: dest.mapX ?? 70, y: dest.mapY ?? 30, label: dest.name }}
          />

          <button
            onClick={() => {
              setStarted((s) => !s);
              if (!started) setStepIndex(0);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-hero px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-elegant transition-transform active:scale-[0.98]"
          >
            {started ? <Navigation className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {started ? "Navigation running" : "Start navigation"}
          </button>
        </aside>
      </main>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        {icon} {label}
      </div>
      <div className="mt-1 text-xl font-bold tracking-tight text-foreground">{value}</div>
    </div>
  );
}

function MiniMap({
  from,
  to,
}: {
  from: { x: number; y: number; label: string };
  to: { x: number; y: number; label: string };
}) {
  return (
    <div className="relative h-52 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,oklch(0.94_0.012_240)_1px,transparent_1px),linear-gradient(0deg,oklch(0.94_0.012_240)_1px,transparent_1px)] bg-[size:28px_28px]" />
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <path
          d={`M ${from.x} ${from.y} C 34 72, 42 52, 54 50 S 70 40, ${to.x} ${to.y}`}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 3"
        />
      </svg>
      <Pin x={from.x} y={from.y} label={from.label} tone="accent" />
      <Pin x={to.x} y={to.y} label={to.label} tone="primary" />
    </div>
  );
}

function Pin({
  x,
  y,
  label,
  tone,
}: {
  x: number;
  y: number;
  label: string;
  tone: "primary" | "accent";
}) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div
        className={`mx-auto grid h-7 w-7 place-items-center rounded-full border-2 border-card ${
          tone === "primary" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
        }`}
      >
        <MapPin className="h-3.5 w-3.5" />
      </div>
      <div className="mt-1 max-w-24 truncate rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium shadow-card">
        {label}
      </div>
    </div>
  );
}
