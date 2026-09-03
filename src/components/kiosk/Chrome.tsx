import { Mic, Power, Search } from "lucide-react";
import { useKiosk } from "@/store/kiosk-store";

export function HeaderBar() {
  const reset = useKiosk((s) => s.reset);
  const lang = useKiosk((s) => s.lang);
  const toggleLang = useKiosk((s) => s.toggleLang);

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
          className="flex items-center gap-1.5 bg-[#0b1220] px-3 text-reset hover:bg-elevated"
          aria-label="Reset"
        >
          <Power className="size-4" />
          <span className="text-sm font-medium">Reset</span>
        </button>
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
      <Corner className="left-[18%] top-[16%]" />
      <Corner className="right-[18%] top-[16%] rotate-90" />
      <Corner className="bottom-[22%] left-[18%] -rotate-90" />
      <Corner className="bottom-[22%] right-[18%] rotate-180" />
      {showHint ? (
        <div className="absolute left-1/2 top-[42%] -translate-x-1/2 rounded-full bg-chip px-3 py-1.5 text-sm font-medium text-fg shadow">
          Zoom in for more
        </div>
      ) : null}
    </div>
  );
}

function Corner({ className }: { className: string }) {
  return (
    <div
      className={`absolute h-14 w-14 border-finder ${className}`}
      style={{
        borderTopWidth: 10,
        borderLeftWidth: 10,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderStyle: "solid",
      }}
    />
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
      className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-search px-5 py-2.5 font-semibold text-search-fg shadow-lg hover:brightness-105"
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
