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
        {FEATURED.slice(0, 24).map((s, i) => {
          const ang = (i / 24) * Math.PI * 2;
          const r = 40 + (i % 5) * 5.5;
          const x = 50 + Math.cos(ang) * r;
          const y = 50 + Math.sin(ang) * (r * 0.5);
          return (
            <div
              key={s.id}
              className="absolute h-16 w-[7.5rem] overflow-hidden rounded-sm border border-line/40 shadow-md"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
                background: s.color,
                opacity: 0.88,
                animation: `tileDrift 18s ease-in-out ${i * 0.12}s infinite alternate`,
              }}
            >
              <div className="h-3 w-full" style={{ background: s.accent }} />
              <div className="px-1.5 pt-1.5 text-[9px] font-semibold leading-tight text-fg/85">{s.title}</div>
              <div className="truncate px-1.5 text-[8px] text-fg/55">{s.host}</div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={start}
        className="kiosk-enter pointer-events-auto relative z-20 mx-4 w-[min(92vw,560px)] overflow-hidden rounded-sm border border-white/80 bg-fg text-left shadow-[0_30px_80px_rgba(0,0,0,0.55)] transition-transform duration-150 ease-out active:scale-[0.98]"
      >
        <div className="bg-fg px-6 py-6 text-center sm:px-8 sm:py-8">
          <p className="font-serif text-[clamp(1.55rem,3.8vw,2.7rem)] leading-[1.15] tracking-tight text-bg">
            Internet Archive Europe
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 bg-[#101826] px-5 py-5 text-fg">
          <MapPin className="size-6 shrink-0 text-fg sm:size-7" strokeWidth={1.75} />
          <span className="font-display text-[clamp(0.8rem,2vw,1.15rem)] font-semibold tracking-[0.14em]">
            PRESS BUTTON TO START
          </span>
        </div>
      </button>
    </div>
  );
}
