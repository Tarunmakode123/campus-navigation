import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, Navigation, Search } from "lucide-react";
import { useLocations } from "@/lib/locations";
import { setEntryPoint } from "@/lib/entry-point";

export const Route = createFileRoute("/qr/$id")({
  head: () => ({ meta: [{ title: "Welcome — Smart Navigator" }] }),
  component: QrLanding,
  errorComponent: ({ error }) => (
    <div className="p-6 text-center text-sm text-destructive">{error.message}</div>
  ),
});

function QrLanding() {
  const { id } = Route.useParams();
  const all = useLocations();
  const loc = all.find((l) => l.id === id);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loc) setEntryPoint(loc.id);
    setReady(true);
  }, [loc]);

  if (!ready) return null;
  if (!loc) return <Navigate to="/" />;

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-hero p-6 text-primary-foreground">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white/15 backdrop-blur">
          <MapPin className="h-7 w-7" />
        </div>
        <p className="mt-5 text-sm opacity-80">You are here</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">{loc.name}</h1>
        <p className="mt-2 text-sm opacity-85">
          Welcome to Smart Navigator. Search any destination and we'll guide you from here.
        </p>

        <div className="mt-7 space-y-2">
          <Link
            to="/"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3.5 text-sm font-semibold text-primary shadow-elegant transition-transform active:scale-[0.98]"
          >
            <Search className="h-4 w-4" /> Find a destination
          </Link>
          <Link
            to="/location/$id"
            params={{ id: loc.id }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-medium backdrop-blur transition-colors hover:bg-white/20"
          >
            <Navigation className="h-4 w-4" /> About this place
          </Link>
        </div>
      </div>
    </div>
  );
}
