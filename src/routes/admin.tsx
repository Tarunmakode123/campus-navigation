import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Edit3, Plus, RotateCcw, Trash2 } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { deleteLocation, resetLocations, useLocations } from "@/lib/locations";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Smart Navigator" }] }),
  component: AdminPage,
});

function AdminPage() {
  const locations = useLocations();

  return (
    <div className="min-h-screen bg-gradient-subtle pb-24">
      <AppHeader showAdmin={false} />

      <div className="mx-auto max-w-3xl px-4 pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </div>

      <main className="mx-auto max-w-3xl px-4 pt-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight">Manage locations</h1>
            <p className="text-sm text-muted-foreground">
              {locations.length} place{locations.length === 1 ? "" : "s"}
            </p>
          </div>
          <Link
            to="/admin/new"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-gradient-hero px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-elegant"
          >
            <Plus className="h-4 w-4" /> Add
          </Link>
        </div>

        <div className="mt-5 space-y-2.5">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-secondary text-primary">
                  {loc.image ? (
                    <img src={loc.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold">{loc.name[0]}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{loc.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{loc.category}</div>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Link
                  to="/admin/$id/edit"
                  params={{ id: loc.id }}
                  className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Edit"
                >
                  <Edit3 className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${loc.name}"?`)) {
                      deleteLocation(loc.id);
                      toast.success("Location deleted");
                    }
                  }}
                  className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            if (confirm("Reset to demo data? Your changes will be lost.")) {
              resetLocations();
              toast.success("Reset to demo data");
            }
          }}
          className="mt-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset to demo data
        </button>
      </main>
    </div>
  );
}
