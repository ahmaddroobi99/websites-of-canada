import { MapPin } from "lucide-react";
import { FEATURED } from "@/lib/catalog";
import { useKiosk } from "@/store/kiosk-store";

export function AttractScreen() {
  const start = useKiosk((s) => s.start);
  const mode = useKiosk((s) => s.mode);
  if (mode !== "attract") return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
      <div className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden md:block">
        {FEATURED.slice(0, 22).map((s, i) => {
          const ang = (i / 22) * Math.PI * 2;
          const r = 42 + (i % 4) * 6;
          const x = 50 + Math.cos(ang) * r;
          const y = 50 + Math.sin(ang) * (r * 0.52);
          return (
            <div
              key={s.id}
              className="absolute h-14 w-24 rounded-sm border border-line/50 shadow-md"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
                background: s.color,
                opacity: 0.85,
              }}
            >
              <div className="h-2.5 w-full" style={{ background: s.accent }} />
              <div className="truncate px-1 pt-1 text-[9px] font-medium text-fg/80">{s.host}</div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={start}
        className="pointer-events-auto relative z-20 mx-4 w-[min(92vw,560px)] overflow-hidden rounded-sm border border-white/80 bg-fg text-left shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
      >
        <div className="bg-fg px-6 py-6 text-center sm:px-8 sm:py-7">
          <p className="font-serif text-[clamp(1.5rem,3.6vw,2.55rem)] leading-tight tracking-tight text-bg">
            Internet Archive Europe
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 bg-[#101826] px-5 py-5 text-fg">
          <MapPin className="size-6 shrink-0 text-fg sm:size-7" strokeWidth={1.75} />
          <span className="font-display text-[clamp(0.8rem,2vw,1.15rem)] font-semibold tracking-[0.12em]">
            PRESS BUTTON TO START
          </span>
        </div>
      </button>
    </div>
  );
}
