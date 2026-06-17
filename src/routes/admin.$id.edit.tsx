import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { LocationForm } from "@/components/LocationForm";
import { useLocations } from "@/lib/locations";

export const Route = createFileRoute("/admin/$id/edit")({
  head: () => ({ meta: [{ title: "Edit location — Smart Navigator" }] }),
  component: EditLocation,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center text-sm">Not found</div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-6 text-center text-sm text-destructive">{error.message}</div>
  ),
});

function EditLocation() {
  const { id } = Route.useParams();
  const all = useLocations();
  const loc = all.find((l) => l.id === id);
  if (!loc) throw notFound();

  return (
    <div className="min-h-screen bg-gradient-subtle pb-24">
      <AppHeader showAdmin={false} />
      <div className="mx-auto max-w-2xl px-4 pt-4">
        <Link
          to="/admin"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Admin
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">Edit {loc.name}</h1>
        <p className="mb-6 text-sm text-muted-foreground">Update details and save.</p>
        <LocationForm initial={loc} />
      </div>
    </div>
  );
}
