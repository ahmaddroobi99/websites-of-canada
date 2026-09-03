import { FlaskConical, Mic, Power, Search } from "lucide-react";
import { BY_ID, CATEGORY_META, FEATURED, WORLD_H, WORLD_W } from "@/lib/catalog";
import { useKiosk } from "@/store/kiosk-store";

const ERAS = [1996, 2001, 2008, 2014, 2020, 2025];

export function HeaderBar() {
  const reset = useKiosk((s) => s.reset);
  const lang = useKiosk((s) => s.lang);
  const toggleLang = useKiosk((s) => s.toggleLang);
  const toggleLab = useKiosk((s) => s.toggleLab);
  const mode = useKiosk((s) => s.mode);

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-center pt-3">
      <div className="pointer-events-auto flex items-stretch overflow-hidden rounded-sm bg-[#0e1420] text-fg shadow-lg">
        <div className="flex items-center gap-2 px-3 py-2">
          <ArchiveMark />
          <div className="leading-tight">
            <div className="text-[10px] font-semibold tracking-wide text-muted">Internet</div>
            <div className="text-[10px] font-semibold tracking-wide text-muted">Archive Europe</div>
          </div>
        </div>
        <div className="flex items-center px-5 font-display text-[clamp(1rem,2vw,1.35rem)] font-semibold tracking-tight">
          Websites of Canada
        </div>
        <button
          type="button"
          onClick={reset}
          className="flex items-center gap-1.5 bg-[#0b1220] px-3 text-reset transition-transform duration-150 ease-out hover:bg-elevated active:scale-[0.96]"
          aria-label="Reset"
        >
          <Power className="size-4" />
          <span className="text-sm font-medium">Reset</span>
        </button>
        {mode !== "attract" ? (
          <button
            type="button"
            onClick={() => toggleLab(true)}
            className="flex items-center gap-1 px-3 text-xs font-medium text-muted hover:text-fg"
            aria-label="Next exhibits"
          >
            <FlaskConical className="size-3.5" />
            Lab
          </button>
        ) : null}
        <button
          type="button"
          onClick={toggleLang}
          className="px-3 text-xs font-medium text-muted hover:text-fg"
          aria-label="Toggle language"
        >
          {lang === "en" ? "FR" : "EN"}
        </button>
      </div>
    </header>
  );
}

function ArchiveMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden>
      <rect x="4" y="6" width="20" height="3" rx="0.5" fill="currentColor" />
      <rect x="6" y="11" width="3" height="11" fill="currentColor" />
      <rect x="12.5" y="11" width="3" height="11" fill="currentColor" />
      <rect x="19" y="11" width="3" height="11" fill="currentColor" />
      <rect x="4" y="23" width="20" height="2" fill="currentColor" />
    </svg>
  );
}

export function Viewfinder() {
  const mode = useKiosk((s) => s.mode);
  const z = useKiosk((s) => s.camera.z);
  if (mode === "attract") return null;
  const showHint = z < 0.55;
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <Corner className="left-[16%] top-[14%]" />
      <Corner className="right-[16%] top-[14%] rotate-90" />
      <Corner className="bottom-[20%] left-[16%] -rotate-90" />
      <Corner className="bottom-[20%] right-[16%] rotate-180" />
      {showHint ? (
        <div className="absolute left-1/2 top-[40%] -translate-x-1/2 rounded-full bg-chip px-3 py-1.5 text-sm font-medium text-fg shadow">
          Zoom in for more
        </div>
      ) : null}
    </div>
  );
}

function Corner({ className }: { className: string }) {
  return (
    <div
      className={`absolute h-16 w-16 border-finder ${className}`}
      style={{
        borderTopWidth: 12,
        borderLeftWidth: 12,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderStyle: "solid",
      }}
    />
  );
}

export function FocusCaption() {
  const mode = useKiosk((s) => s.mode);
  const hoverId = useKiosk((s) => s.hoverId);
  const z = useKiosk((s) => s.camera.z);
  if (mode !== "explore" || z < 0.7) return null;
  const site = hoverId ? BY_ID.get(hoverId) : null;
  if (!site) return null;
  return (
    <div className="pointer-events-none absolute bottom-[26%] left-1/2 z-20 -translate-x-1/2 text-center">
      <p className="font-display text-lg font-semibold text-fg drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] sm:text-2xl">
        {site.title}
      </p>
      <p className="text-sm text-fg/80">{site.host}</p>
    </div>
  );
}

export function SearchChip() {
  const mode = useKiosk((s) => s.mode);
  const listening = useKiosk((s) => s.listening);
  const toggleSearch = useKiosk((s) => s.toggleSearch);
  if (mode === "attract") return null;
  return (
    <button
      type="button"
      onClick={() => toggleSearch(true)}
      className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-search px-5 py-2.5 font-semibold text-search-fg shadow-lg transition-transform duration-150 ease-out hover:brightness-105 active:scale-[0.96]"
    >
      {listening ? <Mic className="size-4" /> : <Search className="size-4" />}
      Search
    </button>
  );
}

export function Toast() {
  const toast = useKiosk((s) => s.toast);
  if (!toast) return null;
  return (
    <div className="pointer-events-none absolute bottom-24 left-1/2 z-40 w-[min(90vw,560px)] -translate-x-1/2 rounded-md bg-elevated/95 px-4 py-2 text-center text-sm text-fg shadow-lg">
      {toast}
    </div>
  );
}

export function EraRail() {
  const mode = useKiosk((s) => s.mode);
  const eraYear = useKiosk((s) => s.eraYear);
  const setEraYear = useKiosk((s) => s.setEraYear);
  if (mode === "attract") return null;
  return (
    <div className="pointer-events-auto absolute left-3 top-16 z-30 hidden flex-col gap-1 sm:flex">
      <button
        type="button"
        onClick={() => setEraYear(null)}
        className={`h-8 rounded-sm px-2 text-left text-[11px] font-medium ${
          eraYear == null ? "bg-fg text-bg" : "bg-elevated/90 text-muted"
        }`}
      >
        All years
      </button>
      {ERAS.map((y) => (
        <button
          key={y}
          type="button"
          onClick={() => setEraYear(y)}
          className={`h-8 rounded-sm px-2 text-left font-mono text-[11px] ${
            eraYear === y ? "bg-finder text-bg" : "bg-elevated/90 text-muted"
          }`}
        >
          {y}
        </button>
      ))}
    </div>
  );
}

export function MiniMap() {
  const mode = useKiosk((s) => s.mode);
  const camera = useKiosk((s) => s.camera);
  const hoverId = useKiosk((s) => s.hoverId);
  const rec = useKiosk((s) => s.rec);
  if (mode === "attract") return null;
  const w = 148;
  const h = 90;
  const sx = (x: number) => (x / WORLD_W) * w;
  const sy = (y: number) => (y / WORLD_H) * h;
  const vw = Math.min(w, (w * 0.9) / Math.max(0.2, camera.z));
  const vh = Math.min(h, (h * 0.7) / Math.max(0.2, camera.z));
  return (
    <div className="pointer-events-none absolute bottom-6 left-3 z-20 hidden overflow-hidden rounded-sm border border-line bg-bg/80 md:block" style={{ width: w, height: h }}>
      <svg width={w} height={h} aria-hidden>
        {FEATURED.map((s) => (
          <circle
            key={s.id}
            cx={sx(s.x)}
            cy={sy(s.y)}
            r={s.id === hoverId ? 3.2 : 1.7}
            fill={s.id === hoverId ? "#3ddc84" : s.accent}
          />
        ))}
        {rec?.path.length ? (
          <polyline
            fill="none"
            stroke="#f5d76e"
            strokeWidth="1"
            points={rec.path.map((s) => `${sx(s.x)},${sy(s.y)}`).join(" ")}
          />
        ) : null}
        <rect
          x={sx(camera.x) - vw / 2}
          y={sy(camera.y) - vh / 2}
          width={vw}
          height={vh}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}

export function VisitedDock() {
  const mode = useKiosk((s) => s.mode);
  const visited = useKiosk((s) => s.visited);
  const openSite = useKiosk((s) => s.openSite);
  if (mode === "attract" || visited.length === 0) return null;
  return (
    <div className="absolute bottom-6 left-1/2 z-30 hidden -translate-x-[calc(50%+140px)] gap-1 md:flex">
      {visited.slice(-5).map((id) => {
        const s = BY_ID.get(id);
        if (!s) return null;
        return (
          <button
            key={id}
            type="button"
            onClick={() => openSite(id)}
            title={s.title}
            className="h-9 w-12 overflow-hidden rounded-sm border border-line"
            style={{ background: s.color }}
          >
            <span className="block h-2" style={{ background: s.accent }} />
          </button>
        );
      })}
    </div>
  );
}

export function HeatToggle() {
  const mode = useKiosk((s) => s.mode);
  const heatOn = useKiosk((s) => s.heatOn);
  const toggleHeat = useKiosk((s) => s.toggleHeat);
  const startTour = useKiosk((s) => s.startTour);
  const tourPlaying = useKiosk((s) => s.tourPlaying);
  const stopTour = useKiosk((s) => s.stopTour);
  if (mode === "attract") return null;
  return (
    <div className="pointer-events-auto absolute right-3 top-16 z-30 hidden flex-col gap-1 sm:flex">
      <button
        type="button"
        onClick={toggleHeat}
        className={`h-8 rounded-sm px-2 text-[11px] font-medium ${heatOn ? "bg-finder text-bg" : "bg-elevated/90 text-muted"}`}
      >
        Heat
      </button>
      <button
        type="button"
        onClick={() => (tourPlaying ? stopTour() : startTour())}
        className={`h-8 rounded-sm px-2 text-[11px] font-medium ${tourPlaying ? "bg-search text-search-fg" : "bg-elevated/90 text-muted"}`}
      >
        {tourPlaying ? "Stop" : "Tour"}
      </button>
    </div>
  );
}

export function ClusterLegend() {
  const mode = useKiosk((s) => s.mode);
  const z = useKiosk((s) => s.camera.z);
  const runQuery = useKiosk((s) => s.runQuery);
  if (mode !== "explore" || z > 0.7) return null;
  const cats = Object.entries(CATEGORY_META).slice(0, 8);
  return (
    <div className="pointer-events-auto absolute bottom-20 left-3 z-20 hidden max-w-[160px] flex-col gap-0.5 md:flex">
      {cats.map(([id, meta]) => (
        <button
          key={id}
          type="button"
          onClick={() => runQuery(`show ${meta.label}`)}
          className="flex items-center gap-1.5 text-left text-[10px] text-muted hover:text-fg"
        >
          <span className="size-2 rounded-full" style={{ background: meta.accent }} />
          {meta.label}
        </button>
      ))}
    </div>
  );
}

