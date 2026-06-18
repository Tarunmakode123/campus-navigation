import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  Clock,
  MapPin,
  Navigation,
  Phone,
  UserRound,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { getLocation, useLocations } from "@/lib/locations";

export const Route = createFileRoute("/location/$id")({
  head: ({ params }) => {
    const loc = typeof window !== "undefined" ? getLocation(params.id) : undefined;
    const title = loc ? `${loc.name} - Smart Navigator` : "Location - Smart Navigator";
    return {
      meta: [
        { title },
        { name: "description", content: loc?.description ?? "Location details" },
      ],
    };
  },
  component: LocationPage,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <h1 className="text-xl font-semibold">Location not found</h1>
        <Link to="/" className="mt-3 inline-block text-sm text-primary underline">
          Back to search
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-6 text-center text-sm text-destructive">{error.message}</div>
  ),
});

function LocationPage() {
  const { id } = Route.useParams();
  const all = useLocations();
  const loc = all.find((l) => l.id === id);
  if (!loc) throw notFound();

  return (
    <div className="min-h-screen bg-gradient-subtle pb-24">
      <AppHeader />

      <div className="mx-auto max-w-3xl px-4 pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </div>

      <article className="mx-auto mt-4 max-w-3xl px-4">
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
          <div className="relative h-52 w-full bg-gradient-hero sm:h-64">
            {loc.image && (
              <img src={loc.image} alt={loc.name} className="h-full w-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <span className="inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-medium backdrop-blur">
                {loc.category}
              </span>
              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                {loc.name}
              </h1>
              {loc.department && <p className="mt-1 text-sm opacity-85">{loc.department}</p>}
            </div>
          </div>

          <div className="space-y-4 p-5">
            <p className="text-sm leading-relaxed text-muted-foreground">{loc.description}</p>

            <div className="grid gap-2 sm:grid-cols-2">
              {loc.purpose && (
                <InfoRow
                  icon={<BriefcaseBusiness className="h-4 w-4" />}
                  label="Work handled"
                  value={loc.purpose}
                />
              )}
              {loc.person && (
                <InfoRow icon={<UserRound className="h-4 w-4" />} label="Meet" value={loc.person} />
              )}
              {loc.department && (
                <InfoRow
                  icon={<Building2 className="h-4 w-4" />}
                  label="Department"
                  value={loc.department}
                />
              )}
              {loc.floor && (
                <InfoRow icon={<Building2 className="h-4 w-4" />} label="Floor" value={loc.floor} />
              )}
              {loc.hours && (
                <InfoRow icon={<Clock className="h-4 w-4" />} label="Hours" value={loc.hours} />
              )}
              {loc.contact && (
                <InfoRow icon={<Phone className="h-4 w-4" />} label="Contact" value={loc.contact} />
              )}
              {loc.latitude != null && loc.longitude != null && (
                <InfoRow
                  icon={<MapPin className="h-4 w-4" />}
                  label="Coordinates"
                  value={`${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}`}
                />
              )}
            </div>

            {loc.routeHint && (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Navigation className="h-4 w-4 text-primary" />
                  Route preview
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{loc.routeHint}</p>
              </div>
            )}

            <Link
              to="/navigate/$id"
              params={{ id: loc.id }}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-hero px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-elegant transition-transform active:scale-[0.98]"
            >
              <Navigation className="h-4 w-4" />
              Start Navigation
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-secondary/40 p-3">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-card text-primary">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <div className="truncate text-sm font-medium text-foreground">{value}</div>
      </div>
    </div>
  );
}
