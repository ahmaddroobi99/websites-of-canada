import { useEffect, useRef } from "react";
import { CATALOG, FEATURED, TILE_H, TILE_W, WORLD_H, WORLD_W, type Site } from "@/lib/catalog";
import { useKiosk } from "@/store/kiosk-store";

const cache = new Map<string, HTMLCanvasElement>();

function hashHue(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h % 360;
}

function paintHomepage(c: HTMLCanvasElement, site: Site) {
  const ctx = c.getContext("2d")!;
  const w = c.width;
  const h = c.height;
  ctx.fillStyle = site.color;
  ctx.fillRect(0, 0, w, h);

  const navH = Math.round(h * 0.13);
  ctx.fillStyle = site.accent;
  ctx.fillRect(0, 0, w, navH);

  ctx.fillStyle = contrast(site.accent);
  ctx.font = `600 ${Math.max(9, Math.round(w * 0.045))}px "IBM Plex Sans", sans-serif`;
  ctx.fillText(site.title.slice(0, 28), 10, navH * 0.68);

  if (site.category === "local-news" || site.category === "national-news") {
    ctx.fillStyle = "#111827";
    ctx.fillRect(8, navH + 8, w * 0.42, h * 0.38);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(w * 0.48, navH + 8, w * 0.46, 16);
    ctx.fillStyle = "#cbd5e1";
    for (let i = 0; i < 4; i++) ctx.fillRect(w * 0.48, navH + 32 + i * 14, w * 0.44, 8);
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(8, h * 0.72, w - 16, h * 0.18);
    ctx.fillStyle = "#fff";
    ctx.font = `700 ${Math.max(10, w * 0.05)}px "Newsreader", serif`;
    ctx.fillText("BREAKING", 14, h * 0.84);
  } else if (site.category === "seniors-care") {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, navH, w, h - navH);
    ctx.fillStyle = site.accent;
    ctx.font = `600 ${Math.max(11, w * 0.055)}px "IBM Plex Sans", sans-serif`;
    ctx.fillText(site.title, 12, navH + 22);
    ctx.fillStyle = "#64748b";
    ctx.font = `400 ${Math.max(8, w * 0.035)}px "IBM Plex Sans", sans-serif`;
    ctx.fillText(site.tagline.slice(0, 42), 12, navH + 40);
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.fillStyle = ["#93c5fd", "#60a5fa", "#3b82f6"][i];
      ctx.arc(36 + i * 52, navH + 78, 18, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (site.category === "faith-youth") {
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(0, navH, w, h * 0.55);
    ctx.fillStyle = "#1c1917";
    ctx.fillRect(w * 0.18, navH + 18, w * 0.64, h * 0.38);
    ctx.fillStyle = "#445";
    ctx.fillRect(w * 0.22, navH + 28, 18, h * 0.28);
    ctx.fillRect(w * 0.72, navH + 28, 18, h * 0.28);
    ctx.fillStyle = "#166534";
    ctx.beginPath();
    ctx.ellipse(w * 0.32, h * 0.62, 28, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, h * 0.7, w, h * 0.3);
    ctx.fillStyle = "#9a3412";
    ctx.font = `700 ${Math.max(9, w * 0.04)}px "Outfit", sans-serif`;
    ctx.fillText(site.title.slice(0, 26), 10, h * 0.86);
  } else if (site.category === "digital-agency" || site.category === "creative-studio") {
    const g = ctx.createLinearGradient(0, navH, w, h);
    g.addColorStop(0, "#1e1b4b");
    g.addColorStop(1, "#9a3412");
    ctx.fillStyle = g;
    ctx.fillRect(0, navH, w, h - navH);
    ctx.fillStyle = "#fff";
    ctx.font = `600 ${Math.max(12, w * 0.06)}px "Outfit", sans-serif`;
    ctx.fillText(site.title, 12, navH + 36);
    ctx.font = `400 ${Math.max(9, w * 0.038)}px "IBM Plex Sans", sans-serif`;
    ctx.fillText(site.tagline.slice(0, 36), 12, navH + 56);
  } else if (site.category === "photography") {
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, navH, w, h - navH);
    ctx.fillStyle = "#334155";
    ctx.fillRect(16, navH + 16, w - 32, h * 0.5);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = `500 ${Math.max(10, w * 0.045)}px "IBM Plex Sans", sans-serif`;
    ctx.fillText(site.title, 16, h * 0.84);
  } else if (site.category === "newswire") {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, navH, w, h - navH);
    ctx.fillStyle = site.accent;
    ctx.fillRect(0, navH, w, 28);
    ctx.fillStyle = "#fff";
    ctx.font = `700 ${Math.max(10, w * 0.045)}px "IBM Plex Sans", sans-serif`;
    ctx.fillText(site.title.toUpperCase(), 10, navH + 19);
    ctx.fillStyle = "#334155";
    for (let i = 0; i < 5; i++) ctx.fillRect(12, navH + 44 + i * 10, w - 24 - i * 8, 6);
  } else {
    ctx.fillStyle = contrast(site.color) === "#0b0b0c" ? "#0b0b0c" : "#f8fafc";
    ctx.globalAlpha = 0.08;
    ctx.fillRect(12, navH + 12, w - 24, 18);
    ctx.fillRect(12, navH + 38, w * 0.6, 10);
    ctx.globalAlpha = 1;
    ctx.fillStyle = contrast(site.color);
    ctx.font = `600 ${Math.max(10, w * 0.048)}px "IBM Plex Sans", sans-serif`;
    ctx.fillText(site.title.slice(0, 22), 12, navH + 28);
  }

  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillRect(0, h - 16, w, 16);
  ctx.fillStyle = "#fff";
  ctx.font = `500 9px "IBM Plex Sans", sans-serif`;
  ctx.fillText(site.host, 6, h - 5);
}

function contrast(hex: string) {
  const c = hex.replace("#", "");
  if (c.length < 6) return "#f8fafc";
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const l = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return l > 0.55 ? "#0b0b0c" : "#f8fafc";
}

function tileCanvas(site: Site) {
  const hit = cache.get(site.id);
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = 336;
  c.height = 216;
  paintHomepage(c, site);
  cache.set(site.id, c);
  return c;
}

function warmCache() {
  for (const s of FEATURED) tileCanvas(s);
}

export function MosaicCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const drag = useRef<{ x: number; y: number; cx: number; cy: number } | null>(null);
  const pinch = useRef<number | null>(null);

  useEffect(() => {
    warmCache();
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let raf = 0;
    let last = performance.now();
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      useKiosk.getState().tick(dt);
      draw(ctx, w, h);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onKey = (e: KeyboardEvent, down: boolean) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      const st = useKiosk.getState();
      if (down) {
        if (e.code === "Enter") {
          if (st.mode === "attract") st.start();
          else if (st.mode === "explore" && st.hoverId) st.openSite(st.hoverId);
          e.preventDefault();
        }
        if (e.code === "Escape") {
          if (st.mode === "site") st.closeSite();
          else if (st.searchOpen) st.toggleSearch(false);
          e.preventDefault();
        }
        if (e.code === "KeyR" && !e.metaKey && !e.ctrlKey) {
          st.reset();
          e.preventDefault();
        }
        if (e.code === "Space") {
          st.toggleSearch(true);
          e.preventDefault();
        }
        if (e.key === "/") {
          st.toggleSearch(true);
          e.preventDefault();
        }
      }
      st.setKeys([e.code], down);
    };
    const kd = (e: KeyboardEvent) => onKey(e, true);
    const ku = (e: KeyboardEvent) => onKey(e, false);
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    window.addEventListener("blur", () => useKiosk.getState().clearKeys());

    window.__controlsTest = {
      getYaw: () => useKiosk.getState().camera.x,
      getSpeed: () => useKiosk.getState().camera.z,
      getPan: () => ({ ...useKiosk.getState().camera }),
      setKeys: (codes: string[]) => {
        const st = useKiosk.getState();
        st.clearKeys();
        if (codes.length) st.setKeys(codes, true);
      },
    };
    window.__kioskQa = {
      runQuery: (q: string) => useKiosk.getState().runQuery(q),
      openSite: (id: string) => useKiosk.getState().openSite(id),
      start: () => useKiosk.getState().start(),
      reset: () => useKiosk.getState().reset(),
      trace: () => useKiosk.getState().runTrace(),
      recommend: () => useKiosk.getState().runRecommend(),
      policy: (p: "auto" | "greedy" | "bfs" | "astar") => useKiosk.getState().setPolicy(p),
    };

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
      delete window.__controlsTest;
      delete window.__kioskQa;
    };
  }, []);

  const hitTest = (clientX: number, clientY: number) => {
    const canvas = ref.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const { camera } = useKiosk.getState();
    const sx = clientX - rect.left;
    const sy = clientY - rect.top;
    const wx = camera.x + (sx - rect.width / 2) / camera.z;
    const wy = camera.y + (sy - rect.height / 2) / camera.z;
    let best: Site | null = null;
    let bestD = Infinity;
    for (const s of CATALOG) {
      const dx = wx - s.x;
      const dy = wy - s.y;
      if (Math.abs(dx) < TILE_W / 2 && Math.abs(dy) < TILE_H / 2) {
        const d = dx * dx + dy * dy;
        if (d < bestD) {
          bestD = d;
          best = s;
        }
      }
    }
    return best;
  };

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 h-full w-full touch-none bg-bg"
      onPointerDown={(e) => {
        const st = useKiosk.getState();
        if (st.mode === "attract") return;
        (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
        drag.current = { x: e.clientX, y: e.clientY, cx: st.camera.x, cy: st.camera.y };
      }}
      onPointerMove={(e) => {
        const st = useKiosk.getState();
        if (st.mode === "attract") return;
        if (drag.current) {
          const z = st.camera.z;
          st.flyTo(
            drag.current.cx - (e.clientX - drag.current.x) / z,
            drag.current.cy - (e.clientY - drag.current.y) / z,
            z,
          );
        } else {
          const hit = hitTest(e.clientX, e.clientY);
          st.setHover(hit?.id ?? null);
        }
      }}
      onPointerUp={() => {
        drag.current = null;
      }}
      onPointerCancel={() => {
        drag.current = null;
      }}
      onDoubleClick={(e) => {
        const st = useKiosk.getState();
        if (st.mode === "attract") {
          st.start();
          return;
        }
        const hit = hitTest(e.clientX, e.clientY);
        if (hit) st.openSite(hit.id);
      }}
      onWheel={(e) => {
        e.preventDefault();
        const st = useKiosk.getState();
        if (st.mode === "attract") return;
        const dz = e.deltaY > 0 ? -0.18 : 0.18;
        st.nudge(0, 0, dz);
      }}
      onTouchStart={(e) => {
        if (e.touches.length === 2) {
          const a = e.touches[0];
          const b = e.touches[1];
          pinch.current = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        }
      }}
      onTouchMove={(e) => {
        if (e.touches.length === 2 && pinch.current) {
          const a = e.touches[0];
          const b = e.touches[1];
          const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
          const st = useKiosk.getState();
          const ratio = d / pinch.current;
          st.flyTo(st.target.x, st.target.y, st.target.z * ratio);
          pinch.current = d;
        }
      }}
      onTouchEnd={() => {
        pinch.current = null;
      }}
    />
  );
}

function draw(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const { camera, hoverId, focusId, rec, mode } = useKiosk.getState();
  ctx.fillStyle = "#07090d";
  ctx.fillRect(0, 0, w, h);

  const z = camera.z;
  const ox = w / 2 - camera.x * z;
  const oy = h / 2 - camera.y * z;

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, w, h);
  ctx.clip();

  const tw = TILE_W * z;
  const th = TILE_H * z;
  const pad = 80;
  const lod = z < 0.35 ? 0 : z < 0.85 ? 1 : 2;

  for (const s of CATALOG) {
    const x = s.x * z + ox - tw / 2;
    const y = s.y * z + oy - th / 2;
    if (x > w + pad || y > h + pad || x + tw < -pad || y + th < -pad) continue;

    const hot = s.id === hoverId || s.id === focusId;
    if (lod === 0 || (!s.featured && lod < 2 && tw < 22)) {
      ctx.fillStyle = s.featured ? s.accent : s.color;
      ctx.globalAlpha = s.filler ? 0.7 : 1;
      ctx.fillRect(x, y, Math.max(1.2, tw * 0.92), Math.max(1.2, th * 0.92));
      ctx.globalAlpha = 1;
      continue;
    }

    if (s.featured && tw > 28) {
      const img = tileCanvas(s);
      ctx.drawImage(img, x, y, tw, th);
    } else {
      ctx.fillStyle = s.color;
      ctx.fillRect(x, y, tw, th);
      ctx.fillStyle = s.accent;
      ctx.fillRect(x, y, tw, Math.max(3, th * 0.14));
    }

    if (hot) {
      ctx.strokeStyle = "#3ddc84";
      ctx.lineWidth = 2.5;
      ctx.strokeRect(x - 1, y - 1, tw + 2, th + 2);
    }

    if (lod >= 2 && tw > 90) {
      ctx.fillStyle = "rgba(7,9,13,0.72)";
      ctx.fillRect(x, y + th - 22, tw, 22);
      ctx.fillStyle = "#f8fafc";
      ctx.font = `500 ${Math.max(10, Math.min(13, tw * 0.08))}px "IBM Plex Sans", sans-serif`;
      ctx.fillText(s.host, x + 6, y + th - 7, tw - 12);
    }
  }

  if (rec && rec.path.length && mode !== "attract") {
    const start = CATALOG.find((s) => s.id === focusId);
    const pts = [start, ...rec.path].filter(Boolean) as Site[];
    ctx.strokeStyle = "#f5d76e";
    ctx.lineWidth = 2.5;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    pts.forEach((s, i) => {
      const x = s.x * z + ox;
      const y = s.y * z + oy;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);
    pts.forEach((s, i) => {
      const x = s.x * z + ox;
      const y = s.y * z + oy;
      ctx.beginPath();
      ctx.fillStyle = i === 0 ? "#3ddc84" : "#f5d76e";
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  ctx.restore();

  if (mode !== "attract" && z < 0.55) {
    ctx.fillStyle = "rgba(7,9,13,0.0)";
  }
}

declare global {
  interface Window {
    __controlsTest?: {
      getYaw: () => number;
      getSpeed: () => number;
      getPan: () => { x: number; y: number; z: number };
      setKeys: (codes: string[]) => void;
    };
    __kioskQa?: {
      runQuery: (q: string) => void;
      openSite: (id: string) => void;
      start: () => void;
      reset: () => void;
      trace: () => void;
      recommend: () => void;
      policy: (p: "auto" | "greedy" | "bfs" | "astar") => void;
    };
  }
}
