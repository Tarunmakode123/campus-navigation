import { Link } from "@tanstack/react-router";
import { Compass, Settings } from "lucide-react";

export function AppHeader({ showAdmin = true }: { showAdmin?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-hero shadow-elegant">
            <Compass className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Smart Navigator</span>
        </Link>
        {showAdmin && (
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Settings className="h-3.5 w-3.5" />
            Admin
          </Link>
        )}
      </div>
    </header>
  );
}
