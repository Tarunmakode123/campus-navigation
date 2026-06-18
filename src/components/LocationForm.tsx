import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CATEGORIES, type Category, type Location, saveLocation, slugify } from "@/lib/locations";
import { toast } from "sonner";
import { Save } from "lucide-react";

export function LocationForm({ initial }: { initial?: Location }) {
  const navigate = useNavigate();
  const [f, setF] = useState<Location>(
    initial ?? {
      id: "",
      name: "",
      description: "",
      category: "Academic",
      purpose: "",
      person: "",
      department: "",
      routeHint: "",
      steps: [],
      mapX: undefined,
      mapY: undefined,
      floor: "",
      contact: "",
      hours: "",
      latitude: undefined,
      longitude: undefined,
      image: "",
    },
  );

  const set = <K extends keyof Location>(k: K, v: Location[K]) =>
    setF((p) => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim()) return toast.error("Name is required");
    const id = f.id || slugify(f.name);
    saveLocation({ ...f, id });
    toast.success(initial ? "Location updated" : "Location added");
    navigate({ to: "/admin" });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Name *">
        <input
          required
          value={f.name}
          onChange={(e) => set("name", e.target.value)}
          className={inputCls}
          placeholder="e.g. Central Library"
        />
      </Field>

      <Field label="Description">
        <textarea
          value={f.description}
          onChange={(e) => set("description", e.target.value)}
          className={`${inputCls} min-h-[88px] resize-y`}
          placeholder="Short description shown on the detail page"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Work / purpose">
          <input
            value={f.purpose ?? ""}
            onChange={(e) => set("purpose", e.target.value)}
            className={inputCls}
            placeholder="Admission, fees, meet professor..."
          />
        </Field>
        <Field label="Person to meet">
          <input
            value={f.person ?? ""}
            onChange={(e) => set("person", e.target.value)}
            className={inputCls}
            placeholder="Dr. Sharma, Admin officer..."
          />
        </Field>
        <Field label="Department">
          <input
            value={f.department ?? ""}
            onChange={(e) => set("department", e.target.value)}
            className={inputCls}
            placeholder="Information Technology"
          />
        </Field>
        <Field label="Route hint">
          <input
            value={f.routeHint ?? ""}
            onChange={(e) => set("routeHint", e.target.value)}
            className={inputCls}
            placeholder="Turn right after Block A..."
          />
        </Field>
      </div>

      <Field label="Route steps">
        <textarea
          value={(f.steps ?? []).join("\n")}
          onChange={(e) =>
            set(
              "steps",
              e.target.value
                .split("\n")
                .map((step) => step.trim())
                .filter(Boolean),
            )
          }
          className={`${inputCls} min-h-[96px] resize-y`}
          placeholder={"One step per line\nStart at Main Gate\nTurn right at Block A"}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Category">
          <select
            value={f.category}
            onChange={(e) => set("category", e.target.value as Category)}
            className={inputCls}
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Floor">
          <input
            value={f.floor ?? ""}
            onChange={(e) => set("floor", e.target.value)}
            className={inputCls}
            placeholder="1, 2, Ground…"
          />
        </Field>
        <Field label="Contact">
          <input
            value={f.contact ?? ""}
            onChange={(e) => set("contact", e.target.value)}
            className={inputCls}
            placeholder="email or phone"
          />
        </Field>
        <Field label="Working hours">
          <input
            value={f.hours ?? ""}
            onChange={(e) => set("hours", e.target.value)}
            className={inputCls}
            placeholder="Mon-Fri · 9-5"
          />
        </Field>
        <Field label="Latitude">
          <input
            type="number"
            step="any"
            value={f.latitude ?? ""}
            onChange={(e) =>
              set("latitude", e.target.value === "" ? undefined : Number(e.target.value))
            }
            className={inputCls}
          />
        </Field>
        <Field label="Longitude">
          <input
            type="number"
            step="any"
            value={f.longitude ?? ""}
            onChange={(e) =>
              set("longitude", e.target.value === "" ? undefined : Number(e.target.value))
            }
            className={inputCls}
          />
        </Field>
        <Field label="Map X (0-100)">
          <input
            type="number"
            step="any"
            min={0}
            max={100}
            value={f.mapX ?? ""}
            onChange={(e) =>
              set("mapX", e.target.value === "" ? undefined : Number(e.target.value))
            }
            className={inputCls}
          />
        </Field>
        <Field label="Map Y (0-100)">
          <input
            type="number"
            step="any"
            min={0}
            max={100}
            value={f.mapY ?? ""}
            onChange={(e) =>
              set("mapY", e.target.value === "" ? undefined : Number(e.target.value))
            }
            className={inputCls}
          />
        </Field>
      </div>

      <Field label="Image URL">
        <input
          value={f.image ?? ""}
          onChange={(e) => set("image", e.target.value)}
          className={inputCls}
          placeholder="https://…"
        />
      </Field>

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-hero px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-elegant transition-transform active:scale-[0.98]"
      >
        <Save className="h-4 w-4" />
        {initial ? "Save changes" : "Create location"}
      </button>
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
