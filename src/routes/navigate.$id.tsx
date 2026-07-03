import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
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
import {
  buildRouteSteps,
  calculateHomeRoute,
  DEFAULT_ENTRY_ID,
  formatMetres,
} from "@/lib/home-navigation";

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

function NavigatePage() {
  const { id } = Route.useParams();
  const all = useLocations();
  const dest = all.find((l) => l.id === id);
  if (!dest) throw notFound();

  const entryId = useEntryPoint();
  const entry =
    all.find((l) => l.id === entryId) ?? all.find((l) => l.id === DEFAULT_ENTRY_ID) ?? all[0];
  const [started, setStarted] = useState(false);
  const [voice, setVoice] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);

  const route = useMemo(
    () => calculateHomeRoute(entry?.id ?? DEFAULT_ENTRY_ID, dest.id),
    [entry?.id, dest.id],
  );
  const routeLocations = useMemo(
    () =>
      route.nodes
        .map((nodeId) => all.find((loc) => loc.id === nodeId))
        .filter(Boolean) as typeof all,
    [all, route.nodes],
  );
  const steps = buildRouteSteps(route, all);
  const minutes = Math.max(1, Math.ceil(route.totalMetres / 60));
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
                Indoor route preview
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
                      From {entry?.name ?? "Main Gate"} by QR route graph
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
              value={formatMetres(route.totalMetres)}
            />
            <Stat
              icon={<Footprints className="h-4 w-4" />}
              label="Walking"
              value={`${minutes} min`}
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
            route={routeLocations.map((loc) => ({
              x: loc.mapX ?? 50,
              y: loc.mapY ?? 50,
              label: loc.name,
            }))}
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
  route,
}: {
  from: { x: number; y: number; label: string };
  to: { x: number; y: number; label: string };
  route: { x: number; y: number; label: string }[];
}) {
  const path = route.length
    ? route.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ")
    : `M ${from.x} ${from.y} L ${to.x} ${to.y}`;

  return (
    <div className="relative h-52 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,oklch(0.94_0.012_240)_1px,transparent_1px),linear-gradient(0deg,oklch(0.94_0.012_240)_1px,transparent_1px)] bg-[size:28px_28px]" />
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <path
          d={path}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 3"
        />
        <rect x="12" y="47" width="56" height="24" rx="2" fill="oklch(0.91 0.02 240 / 0.55)" />
        <rect x="58" y="72" width="32" height="18" rx="2" fill="oklch(0.91 0.02 240 / 0.55)" />
        <rect x="60" y="47" width="30" height="17" rx="2" fill="oklch(0.88 0.035 150 / 0.55)" />
        <rect x="58" y="25" width="32" height="21" rx="2" fill="oklch(0.89 0.04 85 / 0.55)" />
        <rect x="58" y="7" width="32" height="14" rx="2" fill="oklch(0.92 0.035 70 / 0.55)" />
        <rect x="12" y="20" width="42" height="16" rx="2" fill="oklch(0.9 0.035 260 / 0.55)" />
        <rect x="12" y="7" width="42" height="12" rx="2" fill="oklch(0.92 0.035 120 / 0.55)" />
        <rect x="12" y="36" width="24" height="10" rx="2" fill="oklch(0.92 0.035 210 / 0.55)" />
      </svg>
      {route.slice(1, -1).map((point) => (
        <Pin key={point.label} x={point.x} y={point.y} label={point.label} tone="accent" />
      ))}
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
