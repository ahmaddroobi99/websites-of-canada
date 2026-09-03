import { create } from "zustand";
import { CATALOG, FEATURED, occupancy, WORLD_H, WORLD_W, type Site } from "@/lib/catalog";
import { recommend, type Policy, type RecommendResult } from "@/lib/policies";
import { parseIntent } from "@/lib/speech";
import { specializedTrace, type TraceGraph } from "@/lib/trace";
import { clamp } from "@/lib/utils";
import { capturesFromSite, fetchCdx, type WaybackCapture } from "@/lib/wayback";

export type Mode = "attract" | "explore" | "site";

export interface Camera {
  x: number;
  y: number;
  z: number;
}

interface KioskState {
  mode: Mode;
  camera: Camera;
  target: Camera;
  pan: { x: number; y: number };
  zoomVel: number;
  focusId: string | null;
  hoverId: string | null;
  searchOpen: boolean;
  query: string;
  listening: boolean;
  speechError: string | null;
  toast: string | null;
  policy: Policy;
  rec: RecommendResult | null;
  graph: TraceGraph | null;
  captures: WaybackCapture[];
  year: number | null;
  compareYear: number | null;
  visited: string[];
  lang: "en" | "fr";
  keys: Record<string, boolean>;
  eraYear: number | null;
  heatOn: boolean;
  labOpen: boolean;
  tourPlaying: boolean;
  tourIndex: number;
  tourClock: number;
  attractT: number;
  start: () => void;
  reset: () => void;
  setKeys: (codes: string[], held: boolean) => void;
  clearKeys: () => void;
  nudge: (dx: number, dy: number, dz?: number) => void;
  flyTo: (x: number, y: number, z: number) => void;
  setHover: (id: string | null) => void;
  openSite: (id: string) => void;
  closeSite: () => void;
  setYear: (y: number) => void;
  setCompareYear: (y: number | null) => void;
  toggleSearch: (open?: boolean) => void;
  setQuery: (q: string) => void;
  runQuery: (raw: string) => void;
  setListening: (v: boolean, err?: string | null) => void;
  setPolicy: (p: Policy) => void;
  runRecommend: () => void;
  runTrace: () => void;
  startTour: () => void;
  stopTour: () => void;
  setEraYear: (y: number | null) => void;
  toggleHeat: () => void;
  toggleLab: (open?: boolean) => void;
  tick: (dt: number) => void;
  setToast: (t: string | null) => void;
  toggleLang: () => void;
  applyHash: (hash?: string) => void;
}

const START_CAM: Camera = { x: WORLD_W * 0.5, y: WORLD_H * 0.42, z: 0.22 };

function siteById(id: string) {
  return CATALOG.find((s) => s.id === id) ?? null;
}

function writeHash(id?: string | null, year?: number | null) {
  if (typeof window === "undefined") return;
  const next = id ? `#open/${id}${year ? `/${year}` : ""}` : "#";
  if (window.location.hash !== next) history.replaceState(null, "", next === "#" ? window.location.pathname : next);
}

export const useKiosk = create<KioskState>((set, get) => ({
  mode: "attract",
  camera: { ...START_CAM },
  target: { ...START_CAM },
  pan: { x: 0, y: 0 },
  zoomVel: 0,
  focusId: null,
  hoverId: null,
  searchOpen: false,
  query: "",
  listening: false,
  speechError: null,
  toast: null,
  policy: "auto",
  rec: null,
  graph: null,
  captures: [],
  year: null,
  compareYear: null,
  visited: [],
  lang: "en",
  keys: {},
  eraYear: null,
  heatOn: false,
  labOpen: false,
  tourPlaying: false,
  tourIndex: 0,
  tourClock: 0,
  attractT: 0,

  start: () =>
    set({
      mode: "explore",
      target: { x: WORLD_W * 0.48, y: WORLD_H * 0.42, z: 0.26 },
      toast: "Pan with WASD or the joystick · zoom with +/− · Enter to open",
      labOpen: false,
    }),

  reset: () => {
    writeHash(null);
    set({
      mode: "attract",
      camera: { ...START_CAM },
      target: { ...START_CAM },
      pan: { x: 0, y: 0 },
      zoomVel: 0,
      focusId: null,
      hoverId: null,
      searchOpen: false,
      query: "",
      listening: false,
      rec: null,
      graph: null,
      captures: [],
      year: null,
      compareYear: null,
      toast: null,
      labOpen: false,
      tourPlaying: false,
      tourIndex: 0,
      tourClock: 0,
      attractT: 0,
    });
  },

  setKeys: (codes, held) =>
    set((s) => {
      const keys = { ...s.keys };
      for (const c of codes) keys[c] = held;
      return { keys };
    }),

  clearKeys: () => set({ keys: {}, pan: { x: 0, y: 0 }, zoomVel: 0 }),

  nudge: (dx, dy, dz = 0) =>
    set((s) => ({
      pan: { x: dx, y: dy },
      zoomVel: dz,
      tourPlaying: false,
      target: {
        x: clamp(s.target.x + dx, 0, WORLD_W),
        y: clamp(s.target.y + dy, 0, WORLD_H),
        z: clamp(s.target.z * (dz ? Math.pow(1.12, dz) : 1), 0.12, 3.4),
      },
    })),

  flyTo: (x, y, z) =>
    set({
      target: {
        x: clamp(x, 0, WORLD_W),
        y: clamp(y, 0, WORLD_H),
        z: clamp(z, 0.12, 3.4),
      },
    }),

  setHover: (id) => set({ hoverId: id }),

  openSite: (id) => {
    const site = siteById(id);
    if (!site) return;
    const captures = capturesFromSite(site);
    const visited = get().visited.includes(id) ? get().visited : [...get().visited, id];
    const year = captures[0]?.year ?? site.years[0] ?? null;
    set({
      mode: "site",
      focusId: id,
      captures,
      year,
      compareYear: null,
      visited,
      graph: null,
      rec: null,
      searchOpen: false,
      tourPlaying: false,
      labOpen: false,
    });
    writeHash(id, year);
    get().flyTo(site.x, site.y, 1.65);
    void fetchCdx(site).then((caps) => {
      if (get().focusId === id) {
        set({ captures: caps, year: caps[0]?.year ?? get().year });
      }
    });
  },

  closeSite: () =>
    set((s) => ({
      mode: "explore",
      graph: null,
      rec: null,
      compareYear: null,
      tourPlaying: false,
      target: { ...s.target, z: Math.min(s.target.z, 1.1) },
    })),

  setYear: (y) => {
    set({ year: y });
    const id = get().focusId;
    if (id) writeHash(id, y);
  },

  setCompareYear: (y) => set({ compareYear: y }),

  toggleSearch: (open) =>
    set((s) => ({
      searchOpen: open ?? !s.searchOpen,
      toast: null,
      labOpen: false,
    })),

  setQuery: (q) => set({ query: q }),

  runQuery: (raw) => {
    const intent = parseIntent(raw);
    const { flyTo, openSite, runTrace, runRecommend, reset } = get();
    switch (intent.type) {
      case "reset":
        reset();
        break;
      case "trace":
        set({ query: raw, searchOpen: false });
        if (get().focusId) runTrace();
        else set({ toast: "Open a site first, then trace." });
        break;
      case "recommend":
        set({ query: raw, searchOpen: false });
        if (get().focusId) runRecommend();
        else {
          const seed = FEATURED[0];
          openSite(seed.id);
          setTimeout(() => get().runRecommend(), 200);
        }
        break;
      case "year":
        set({
          query: raw,
          searchOpen: false,
          year: intent.year,
          eraYear: intent.year,
          toast: `Era ${intent.year}`,
        });
        break;
      case "show": {
        const cluster = CATALOG.filter((s) => s.category === intent.category);
        const cx = cluster.reduce((a, s) => a + s.x, 0) / cluster.length;
        const cy = cluster.reduce((a, s) => a + s.y, 0) / cluster.length;
        set({ query: raw, searchOpen: false, mode: "explore", toast: `Showing ${intent.category.replace(/-/g, " ")}` });
        flyTo(cx, cy, 1.15);
        break;
      }
      case "open":
        set({ query: raw, searchOpen: false });
        openSite(intent.site.id);
        break;
      case "search": {
        const q = intent.query;
        const hit = CATALOG.find(
          (s) =>
            s.title.toLowerCase().includes(q.toLowerCase()) || s.host.toLowerCase().includes(q.toLowerCase()),
        );
        if (hit) {
          set({ query: raw, searchOpen: false });
          openSite(hit.id);
        } else {
          set({ query: raw, searchOpen: false, toast: `No site matching “${q}”` });
        }
      }
    }
  },

  setListening: (v, err = null) => set({ listening: v, speechError: err }),

  setPolicy: (p) => {
    set({ policy: p });
    if (get().focusId) get().runRecommend();
  },

  runRecommend: () => {
    const s = get();
    const site = s.focusId ? siteById(s.focusId) : null;
    if (!site) return;
    const rec = recommend(site, s.visited, s.policy, 5);
    set({
      rec,
      toast: rec.reason,
      mode: "site",
    });
  },

  runTrace: () => {
    const s = get();
    const site = s.focusId ? siteById(s.focusId) : null;
    if (!site) return;
    const graph = specializedTrace(site);
    set({ graph, toast: graph.stats.note.slice(0, 140) });
  },

  startTour: () => {
    const s = get();
    let rec = s.rec;
    const seed = s.focusId ? siteById(s.focusId) : FEATURED[0];
    if (!seed) return;
    if (!rec) rec = recommend(seed, s.visited, s.policy, 5);
    const first = rec.path[0];
    if (!first) {
      set({ toast: "No path to tour yet — open a site, then Recommend." });
      return;
    }
    set({
      rec,
      mode: "explore",
      tourPlaying: true,
      tourIndex: 0,
      tourClock: 0,
      graph: null,
      searchOpen: false,
      labOpen: false,
      toast: `Tour 1/${rec.path.length} · ${first.title}`,
    });
    get().flyTo(first.x, first.y, 1.4);
  },

  stopTour: () => set({ tourPlaying: false, tourClock: 0 }),

  setEraYear: (y) =>
    set({
      eraYear: y,
      toast: y ? `Mosaic filtered to ${y}` : "All years",
    }),

  toggleHeat: () =>
    set((s) => ({
      heatOn: !s.heatOn,
      toast: s.heatOn ? "Occupancy heat off" : "Occupancy heat on — ENME517 density",
    })),

  toggleLab: (open) =>
    set((s) => ({
      labOpen: open ?? !s.labOpen,
      searchOpen: false,
    })),

  applyHash: (hash) => {
    const raw = (hash ?? (typeof window !== "undefined" ? window.location.hash : "")).replace(/^#/, "");
    const m = raw.match(/^open\/([^/]+)(?:\/(\d{4}))?/);
    if (!m) return;
    const site = siteById(m[1]) ?? CATALOG.find((s) => s.host === m[1] || s.id === m[1]);
    if (!site) return;
    if (get().mode === "attract") get().start();
    get().openSite(site.id);
    if (m[2]) get().setYear(Number(m[2]));
  },

  tick: (dt) => {
    const s = get();

    if (s.mode === "attract") {
      const attractT = s.attractT + dt;
      const x = START_CAM.x + Math.sin(attractT * 0.07) * 420;
      const y = START_CAM.y + Math.cos(attractT * 0.05) * 240;
      const t = 1 - Math.pow(0.001, dt);
      set({
        attractT,
        camera: {
          x: s.camera.x + (x - s.camera.x) * t,
          y: s.camera.y + (y - s.camera.y) * t,
          z: s.camera.z + (0.22 - s.camera.z) * t,
        },
        target: { x, y, z: 0.22 },
      });
      return;
    }

    if (s.tourPlaying && s.rec?.path.length) {
      let { tourClock, tourIndex } = s;
      tourClock += dt;
      if (tourClock > 2.35) {
        tourClock = 0;
        tourIndex += 1;
        if (tourIndex >= s.rec.path.length) {
          const last = s.rec.path[s.rec.path.length - 1];
          set({ tourPlaying: false, tourIndex: 0, tourClock: 0 });
          get().openSite(last.id);
          setTimeout(() => get().runRecommend(), 180);
          return;
        }
        const next = s.rec.path[tourIndex];
        get().flyTo(next.x, next.y, 1.4);
        set({
          tourClock,
          tourIndex,
          toast: `Tour ${tourIndex + 1}/${s.rec.path.length} · ${next.title}`,
        });
      } else {
        set({ tourClock });
      }
    }

    const k = s.keys;
    let ax = 0;
    let ay = 0;
    let az = 0;
    if (k.KeyA || k.ArrowLeft) ax -= 1;
    if (k.KeyD || k.ArrowRight) ax += 1;
    if (k.KeyW || k.ArrowUp) ay -= 1;
    if (k.KeyS || k.ArrowDown) ay += 1;
    if (k.Equal || k.NumpadAdd || k.KeyE) az += 1;
    if (k.Minus || k.NumpadSubtract || k.KeyQ) az -= 1;

    const speed = (920 / Math.max(0.25, s.camera.z)) * dt;
    const nx = clamp(s.target.x + ax * speed + s.pan.x, 0, WORLD_W);
    const ny = clamp(s.target.y + ay * speed + s.pan.y, 0, WORLD_H);
    const nz = clamp(s.target.z * Math.pow(1.18, az * dt * 6 + s.zoomVel), 0.12, 3.4);

    const t = 1 - Math.pow(0.001, dt);
    const cam: Camera = {
      x: s.camera.x + (nx - s.camera.x) * Math.min(1, t * 1.8),
      y: s.camera.y + (ny - s.camera.y) * Math.min(1, t * 1.8),
      z: s.camera.z + (nz - s.camera.z) * Math.min(1, t * 2.2),
    };
    set({
      camera: cam,
      target: { x: nx, y: ny, z: nz },
      pan: { x: s.pan.x * Math.pow(0.04, dt), y: s.pan.y * Math.pow(0.04, dt) },
      zoomVel: s.zoomVel * Math.pow(0.02, dt),
    });
  },

  setToast: (t) => set({ toast: t }),
  toggleLang: () => set((s) => ({ lang: s.lang === "en" ? "fr" : "en" })),
}));

export function focusedSite(): Site | null {
  const id = useKiosk.getState().focusId;
  return id ? siteById(id) : null;
}

export { occupancy };
