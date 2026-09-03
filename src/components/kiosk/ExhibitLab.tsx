import { ArrowUpRight, FlaskConical, X } from "lucide-react";
import { useKiosk } from "@/store/kiosk-store";

const EXHIBITS = [
  {
    title: "Websites of Switzerland",
    tag: "Lineage",
    body: "The interaction this kiosk copies — Kai Jauslin / Nextension with the Swiss National Library (2021). Same mosaic + viewfinder, different web.",
  },
  {
    title: "Websites of a City",
    tag: "Municipal",
    body: "A one-city pack: civic, news, neighbourhood, and school sites as a library-floor kiosk for a municipal archive.",
  },
  {
    title: "Classroom pack",
    tag: "Education",
    body: "Guided tours, era slider, and occupancy heat as a digital-heritage lab for high school and undergrad media history.",
  },
  {
    title: "Library install kit",
    tag: "Hardware",
    body: "Attract timeout, bilingual overlay, large-type mode, and an arcade-pad map so a branch can run this on a touch kiosk.",
  },
  {
    title: "Resource-graph studio",
    tag: "Crawler",
    body: "Unlock the live crawler for one consented .ca seed. Same-host BFS, URLs as nodes, refs as edges — not a 100k crawl.",
  },
  {
    title: "Occupancy lab",
    tag: "ENME517",
    body: "Expose greedy / BFS / A* as a DoE visualizer: cluster density is the field, visited tiles are obstacles.",
  },
  {
    title: "Indigenous web memory",
    tag: "Protocol",
    body: "A dedicated cluster with community review, takedown, and language labels — not scraped into the public mosaic by default.",
  },
  {
    title: "Francophone mosaic",
    tag: "Québec / Acadie",
    body: "French-first catalog, Revue / Mauricie-style mastheads, and FR voice intents as a sibling exhibit rather than a toggle.",
  },
];

export function ExhibitLab() {
  const open = useKiosk((s) => s.labOpen);
  const toggleLab = useKiosk((s) => s.toggleLab);
  const startTour = useKiosk((s) => s.startTour);
  const toggleHeat = useKiosk((s) => s.toggleHeat);
  const heatOn = useKiosk((s) => s.heatOn);
  if (!open) return null;

  return (
    <div className="absolute inset-0 z-40 flex items-end justify-center bg-bg/55 p-3 sm:items-center">
      <div className="kiosk-enter max-h-[min(88dvh,720px)] w-full max-w-3xl overflow-auto rounded-lg border border-line bg-surface p-4 shadow-2xl sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 font-display text-lg font-semibold">
              <FlaskConical className="size-5 text-finder" />
              Next exhibits
            </p>
            <p className="mt-1 max-w-xl text-sm text-muted">
              Applied on this kiosk: era filter, occupancy heat, guided tour, minimap, visited rail, shareable
              #open/host. These are the sibling applications that reuse the same mosaic.
            </p>
          </div>
          <button type="button" onClick={() => toggleLab(false)} className="rounded-sm p-1 text-muted hover:text-fg" aria-label="Close lab">
            <X className="size-5" />
          </button>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              toggleLab(false);
              startTour();
            }}
            className="h-9 rounded-md bg-search px-3 text-sm font-medium text-search-fg"
          >
            Play a tour
          </button>
          <button
            type="button"
            onClick={toggleHeat}
            className="h-9 rounded-md border border-line bg-elevated px-3 text-sm"
          >
            {heatOn ? "Heat off" : "Occupancy heat"}
          </button>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {EXHIBITS.map((ex) => (
            <li key={ex.title} className="rounded-md border border-line bg-elevated p-3">
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <h3 className="font-display text-sm font-semibold">{ex.title}</h3>
                <span className="text-[10px] uppercase tracking-wide text-subtle">{ex.tag}</span>
              </div>
              <p className="text-xs leading-relaxed text-muted">{ex.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex items-center gap-1 text-[11px] text-subtle">
          <ArrowUpRight className="size-3" />
          Tribute only — not an official Internet Archive product.
        </p>
      </div>
    </div>
  );
}
