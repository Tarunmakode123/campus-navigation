import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { LocationForm } from "@/components/LocationForm";

export const Route = createFileRoute("/admin/new")({
  head: () => ({ meta: [{ title: "New location — Smart Navigator" }] }),
  component: NewLocation,
});

function NewLocation() {
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
        <h1 className="mt-3 text-2xl font-bold tracking-tight">New location</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Add a place visitors can find and navigate to.
        </p>
        <LocationForm />
      </div>
    </div>
  );
}
