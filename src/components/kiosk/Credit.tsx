import { Link } from "@tanstack/react-router";
import { useKiosk } from "@/store/kiosk-store";

export function Credit() {
  const mode = useKiosk((s) => s.mode);
  if (mode !== "attract") return null;
  return (
    <p className="pointer-events-auto absolute bottom-3 left-3 right-3 z-30 max-w-lg text-[10px] leading-relaxed text-muted sm:bottom-4 sm:left-4 sm:right-auto sm:text-[11px]">
      Tribute to <span className="text-fg">Websites of Canada</span> at Vancouver Public Library.
      Original exhibit: Internet Archive Canada × VPL, presented by Internet Archive Europe.
      Interaction concept: Kai Jauslin / Nextension.{" "}
      <Link to="/about" className="text-finder underline">
        Architecture
      </Link>
    </p>
  );
}
