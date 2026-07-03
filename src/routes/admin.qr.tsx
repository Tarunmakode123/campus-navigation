import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Printer, QrCode } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useLocations } from "@/lib/locations";

export const Route = createFileRoute("/admin/qr")({
  head: () => ({ meta: [{ title: "QR Codes — Smart Navigator" }] }),
  component: QrCodesPage,
});

function qrUrl(data: string, size = 320) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=10&data=${encodeURIComponent(data)}`;
}

function QrCodesPage() {
  const locations = useLocations();
  const entryLocations = locations.filter((loc) => loc.id === "main-gate");
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="min-h-screen bg-gradient-subtle pb-24">
      <AppHeader showAdmin={false} />

      <div className="mx-auto max-w-3xl px-4 pt-4 print:hidden">
        <Link
          to="/admin"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Admin
        </Link>
      </div>

      <main className="mx-auto max-w-2xl px-4 pt-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 print:hidden">
          <div className="min-w-0">
            <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              <QrCode className="h-6 w-6 text-primary" /> Main Gate QR code
            </h1>
            <p className="text-sm text-muted-foreground">
              Print and place this at the Main Gate. Scanning opens the app with Main Gate as the
              starting point.
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-gradient-hero px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-elegant"
          >
            <Printer className="h-4 w-4" /> Print
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4">
          {entryLocations.map((loc) => {
            const target = `${origin}/qr/${loc.id}`;
            return (
              <div
                key={loc.id}
                className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-card print:break-inside-avoid print:border-0 print:shadow-none"
              >
                <div className="rounded-xl bg-white p-4 shadow-card print:shadow-none">
                  <img
                    src={qrUrl(target, 520)}
                    alt={`QR code for ${loc.name}`}
                    className="h-64 w-64"
                  />
                </div>
                <div className="mt-4 text-lg font-bold">{loc.name}</div>
                <div className="text-sm text-muted-foreground">Scan here to start navigation</div>
                <div className="mt-1 break-all text-[10px] text-muted-foreground/70 print:hidden">
                  {target}
                </div>
                <Link
                  to="/qr/$id"
                  params={{ id: loc.id }}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border bg-secondary px-3.5 py-2 text-sm font-semibold text-secondary-foreground print:hidden"
                >
                  <QrCode className="h-4 w-4" />
                  Open scan page
                </Link>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
