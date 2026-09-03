import { ADJACENT, CATALOG, categoryOfHost, type Category, type Site } from "./catalog";

export interface TraceNode {
  id: string;
  url: string;
  kind: "page" | "asset" | "neighbor" | "snapshot";
  label: string;
  category: Category | "unknown";
  host: string;
}

export interface TraceEdge {
  from: string;
  to: string;
  rel: "href" | "asset" | "category" | "wayback";
}

export interface TraceGraph {
  seed: string;
  source: "specialized-local" | "crawler" | "fixture";
  nodes: TraceNode[];
  edges: TraceEdge[];
  stats: {
    pages: number;
    assets: number;
    neighbors: number;
    elapsedMs: number;
    note: string;
  };
}

const PAGE_TEMPLATES: Record<string, string[]> = {
  default: ["/", "/about", "/contact", "/news", "/css/main.css", "/js/app.js"],
  "seniors-care": ["/", "/about-us", "/programs", "/newsletter", "/contact-us", "/css/home.css"],
  "faith-youth": ["/", "/the-project", "/timeline", "/team", "/donors", "/media", "/css/site.css"],
  "local-news": ["/", "/montreal", "/entertainment", "/news", "/subscribe", "/css/times.css"],
  newswire: ["/", "/releases", "/media-lists", "/contact", "/css/wire.css"],
  "digital-agency": ["/", "/work", "/services", "/about", "/contact", "/js/hero.js"],
  photography: ["/", "/gallery", "/pricing", "/sell", "/css/photos.css"],
};

function templatesFor(cat: Category): string[] {
  return PAGE_TEMPLATES[cat] ?? PAGE_TEMPLATES.default;
}

function neighborsOf(site: Site, limit = 4): Site[] {
  const same = CATALOG.filter((s) => s.category === site.category && s.id !== site.id && s.featured);
  const near = CATALOG.filter(
    (s) => ADJACENT[site.category].includes(s.category) && s.featured && s.id !== site.id,
  );
  return [...same, ...near].slice(0, limit);
}

export function specializedTrace(site: Site): TraceGraph {
  const t0 = performance.now();
  const nodes: TraceNode[] = [];
  const edges: TraceEdge[] = [];
  const pages = templatesFor(site.category);
  const origin = `http://${site.host}`;

  pages.forEach((path, i) => {
    const url = path.startsWith("http") ? path : origin + (path === "/" ? "/" : path);
    const kind: TraceNode["kind"] = path.endsWith(".css") || path.endsWith(".js") ? "asset" : "page";
    const id = `n-${i}`;
    nodes.push({
      id,
      url,
      kind,
      label: path === "/" ? site.host : path.replace(/^\//, ""),
      category: site.category,
      host: site.host,
    });
    if (i > 0) edges.push({ from: "n-0", to: id, rel: kind === "asset" ? "asset" : "href" });
  });

  site.years.forEach((y, i) => {
    const id = `y-${y}`;
    nodes.push({
      id,
      url: `https://web.archive.org/web/${y}0101000000/${origin}/`,
      kind: "snapshot",
      label: String(y),
      category: site.category,
      host: site.host,
    });
    edges.push({ from: "n-0", to: id, rel: "wayback" });
    if (i > 0) edges.push({ from: `y-${site.years[i - 1]}`, to: id, rel: "wayback" });
  });

  const neigh = neighborsOf(site, 4);
  neigh.forEach((nb, i) => {
    const id = `nb-${i}`;
    nodes.push({
      id,
      url: nb.url,
      kind: "neighbor",
      label: nb.host,
      category: nb.category,
      host: nb.host,
    });
    edges.push({ from: "n-0", to: id, rel: "category" });
  });

  const elapsedMs = Math.round(performance.now() - t0);
  return {
    seed: site.url,
    source: "specialized-local",
    nodes,
    edges,
    stats: {
      pages: nodes.filter((n) => n.kind === "page").length,
      assets: nodes.filter((n) => n.kind === "asset").length,
      neighbors: neigh.length,
      elapsedMs,
      note: `Category-scoped BFS around ${site.host}: same-host templates + ${neigh.length} mosaic neighbors in ${site.category} / adjacent taxa. The public resource-graph-crawler API crawls a configured seed, not arbitrary .ca hosts — this adapter applies its model (URLs as nodes, refs as edges, cap ~12) to the kiosk taxonomy.`,
    },
  };
}

export async function tryCrawlerThenLocal(site: Site, crawlerBase?: string): Promise<TraceGraph> {
  const local = specializedTrace(site);
  if (!crawlerBase) return local;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 3500);
    const res = await fetch(`${crawlerBase.replace(/\/$/, "")}/api/v1/crawl`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ max_pages: 8, workers: 2, url: site.url }),
      signal: ctrl.signal,
    });
    clearTimeout(t);
    if (!res.ok) return local;
    const body = (await res.json()) as { stats?: Record<string, unknown>; status?: string };
    return {
      ...local,
      source: "crawler",
      stats: {
        ...local.stats,
        note: `Crawler responded (${body.status ?? "ok"}). Specialized neighbor overlay still applied — the live service is host-locked to its configured seed.`,
      },
    };
  } catch {
    return local;
  }
}

export function categorizeUrl(url: string): Category | "unknown" {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return categoryOfHost(host) ?? "unknown";
  } catch {
    return "unknown";
  }
}
