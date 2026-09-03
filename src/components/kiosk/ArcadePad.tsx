import { Mic, Minus, Play, Plus, Power, Search, X } from "lucide-react";
import type { ReactNode } from "react";
import { useKiosk } from "@/store/kiosk-store";

export function ArcadePad() {
  const mode = useKiosk((s) => s.mode);
  const nudge = useKiosk((s) => s.nudge);
  const start = useKiosk((s) => s.start);
  const reset = useKiosk((s) => s.reset);
  const closeSite = useKiosk((s) => s.closeSite);
  const hoverId = useKiosk((s) => s.hoverId);
  const focusId = useKiosk((s) => s.focusId);
  const openSite = useKiosk((s) => s.openSite);
  const toggleSearch = useKiosk((s) => s.toggleSearch);

  const select = () => {
    if (mode === "attract") start();
    else if (mode === "site") closeSite();
    else if (hoverId) openSite(hoverId);
  };

  return (
    <div className="pointer-events-auto absolute bottom-4 right-4 z-30 hidden w-[228px] rounded-md bg-[#8b1818] p-3 shadow-[0_18px_40px_rgba(0,0,0,0.45)] md:block">
      <div className="mb-3 flex justify-center">
        <Joystick onMove={nudge} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <RoundBtn label="Close" className="bg-fg text-bg" onClick={closeSite}>
          <X className="size-4" />
        </RoundBtn>
        <RoundBtn label="Zoom in" className="bg-fg text-bg" onClick={() => nudge(0, 0, 1)}>
          <Search className="size-4" />
        </RoundBtn>
        <RoundBtn label="Zoom out" className="bg-danger text-fg" onClick={() => nudge(0, 0, -1)}>
          <Plus className="size-4" />
        </RoundBtn>
        <RoundBtn label="Select" className="bg-finder text-bg" onClick={select}>
          <Play className="size-4 fill-current" />
        </RoundBtn>
        <RoundBtn label="Reset" className="bg-reset text-bg" onClick={reset}>
          <Power className="size-4" />
        </RoundBtn>
        <RoundBtn label="Search" className="bg-search text-search-fg" onClick={() => toggleSearch(true)}>
          <Mic className="size-4" />
        </RoundBtn>
      </div>
      <p className="mt-2 text-center text-[10px] text-white/70">
        {mode === "attract" ? "Green to start" : focusId ? "Site open" : "WASD pan · +/− zoom"}
      </p>
    </div>
  );
}

function RoundBtn({
  children,
  className,
  onClick,
  label,
}: {
  children: ReactNode;
  className: string;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`grid size-11 place-items-center rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.35),0_3px_0_rgba(0,0,0,0.35)] transition-transform duration-150 ease-out active:scale-[0.96] ${className}`}
    >
      {children}
    </button>
  );
}

function Joystick({ onMove }: { onMove: (dx: number, dy: number) => void }) {
  return (
    <div
      className="relative size-16 rounded-full bg-[#1a1a1a] shadow-inner"
      onPointerDown={(e) => {
        const el = e.currentTarget;
        el.setPointerCapture(e.pointerId);
        const move = (ev: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const dx = (ev.clientX - (r.left + r.width / 2)) / 24;
          const dy = (ev.clientY - (r.top + r.height / 2)) / 24;
          onMove(dx * 40, dy * 40);
        };
        const up = () => {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", up);
          onMove(0, 0);
        };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
      }}
    >
      <div className="absolute left-1/2 top-[18%] h-7 w-3.5 -translate-x-1/2 rounded-sm bg-[#1a1a1a]" />
      <div className="absolute left-1/2 top-1/2 size-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-reset shadow-md" />
    </div>
  );
}

export function MobileControls() {
  const nudge = useKiosk((s) => s.nudge);
  const mode = useKiosk((s) => s.mode);
  const start = useKiosk((s) => s.start);
  const hoverId = useKiosk((s) => s.hoverId);
  const openSite = useKiosk((s) => s.openSite);
  if (mode === "attract") return null;
  return (
    <div className="absolute bottom-20 left-3 z-30 flex flex-col gap-2 md:hidden">
      <div className="grid grid-cols-3 gap-1">
        <span />
        <Pad onHold={() => nudge(0, -28)}>W</Pad>
        <span />
        <Pad onHold={() => nudge(-28, 0)}>A</Pad>
        <Pad
          onHold={() => {
            if (hoverId) openSite(hoverId);
            else start();
          }}
        >
          <Play className="size-4 fill-current" />
        </Pad>
        <Pad onHold={() => nudge(28, 0)}>D</Pad>
        <span />
        <Pad onHold={() => nudge(0, 28)}>S</Pad>
        <span />
      </div>
      <div className="flex gap-1">
        <Pad onHold={() => nudge(0, 0, 1)}>
          <Plus className="size-4" />
        </Pad>
        <Pad onHold={() => nudge(0, 0, -1)}>
          <Minus className="size-4" />
        </Pad>
      </div>
    </div>
  );
}

function Pad({ children, onHold }: { children: ReactNode; onHold: () => void }) {
  return (
    <button
      type="button"
      className="grid size-11 place-items-center rounded-md bg-elevated/90 text-sm font-medium text-fg"
      onPointerDown={(e) => {
        e.preventDefault();
        onHold();
        const id = window.setInterval(onHold, 80);
        const up = () => {
          window.clearInterval(id);
          window.removeEventListener("pointerup", up);
        };
        window.addEventListener("pointerup", up);
      }}
    >
      {children}
    </button>
  );
}
