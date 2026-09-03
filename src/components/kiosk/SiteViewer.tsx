import { Columns2, ExternalLink, GitGraph, Route as RouteIcon, X } from "lucide-react";
import { useMemo } from "react";
import { BY_ID, CATEGORY_META } from "@/lib/catalog";
import { useKiosk } from "@/store/kiosk-store";
import type { Policy } from "@/lib/policies";
import type { TraceNode } from "@/lib/trace";

export function SiteViewer() {
  const mode = useKiosk((s) => s.mode);
  const focusId = useKiosk((s) => s.focusId);
  const closeSite = useKiosk((s) => s.closeSite);
  const captures = useKiosk((s) => s.captures);
  const year = useKiosk((s) => s.year);
  const setYear = useKiosk((s) => s.setYear);
  const runTrace = useKiosk((s) => s.runTrace);
  const runRecommend = useKiosk((s) => s.runRecommend);
  const graph = useKiosk((s) => s.graph);
  const rec = useKiosk((s) => s.rec);
  const policy = useKiosk((s) => s.policy);
  const setPolicy = useKiosk((s) => s.setPolicy);
  const startTour = useKiosk((s) => s.startTour);
  const compareYear = useKiosk((s) => s.compareYear);
  const setCompareYear = useKiosk((s) => s.setCompareYear);

  const site = focusId ? BY_ID.get(focusId) : null;
  if (mode !== "site" || !site) return null;

  const capture = captures.find((c) => c.year === year) ?? captures[0];
  const years = captures.length ? captures.map((c) => c.year) : site.years;
  const hi = Math.max(...years);
  const lo = Math.min(...years);

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-bg/50 p-3 sm:p-8">
      <div className="kiosk-enter relative flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-md border border-line bg-surface shadow-2xl">
        <div className="flex items-center gap-3 bg-[#111111] px-3 py-2 text-xs text-fg">
          <span className="rounded-sm bg-danger px-1.5 py-0.5 font-display font-bold tracking-wide">
            INTERNET ARCHIVE Wayback Machine
          </span>
          <span className="truncate font-medium">{site.url}</span>
          <span className="ml-auto hidden text-[10px] text-muted sm:inline">
            {capture?.replay}
          </span>
          <a
            href={capture?.replay ?? site.url}
            target="_blank"
            rel="noreferrer"
            className="grid size-8 place-items-center rounded-sm text-muted hover:text-fg"
            aria-label="Open in Wayback"
          >
            <ExternalLink className="size-4" />
          </a>
          <button
            type="button"
            onClick={closeSite}
            className="grid size-8 place-items-center rounded-full bg-danger text-fg"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="relative min-h-0 flex-1 bg-elevated">
          <HomepagePreview siteId={site.id} year={year} compareYear={compareYear} />
          <div className="absolute bottom-3 left-3 rounded-sm bg-finder/90 px-2 py-1 font-mono text-xs text-bg">
            TIME {hi}–{lo}
          </div>
        </div>

        <div className="border-t border-line bg-[#0b0d12] px-3 py-3">
          <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
            {captures.map((c) => (
              <button
                key={c.timestamp}
                type="button"
                onClick={() => setYear(c.year)}
                className={`min-w-24 shrink-0 rounded-sm border p-1 text-left ${
                  c.year === year ? "border-finder bg-elevated" : "border-line bg-surface"
                }`}
              >
                <div className="h-10 rounded-sm" style={{ background: site.accent }} />
                <div className="pt-1 text-center text-xs text-muted">{c.year}</div>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={runTrace}
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-fg px-3 text-sm font-medium text-bg"
            >
              <GitGraph className="size-4" />
              Trace
            </button>
            <button
              type="button"
              onClick={runRecommend}
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-search px-3 text-sm font-medium text-search-fg transition-transform duration-150 active:scale-[0.96]"
            >
              <RouteIcon className="size-4" />
              Recommend
            </button>
            <button
              type="button"
              onClick={startTour}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-line bg-elevated px-3 text-sm font-medium"
            >
              Tour
            </button>
            <button
              type="button"
              onClick={() => {
                const others = years.filter((y) => y !== year);
                setCompareYear(compareYear ? null : (others[0] ?? null));
              }}
              className={`inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-sm font-medium ${
                compareYear ? "border-finder bg-elevated text-fg" : "border-line bg-elevated"
              }`}
            >
              <Columns2 className="size-4" />
              Compare
            </button>
            <PolicyPills policy={policy} onChange={setPolicy} />
            <span className="ml-auto text-xs text-muted">{site.tagline}</span>
          </div>
        </div>

        {graph ? <TracePanel /> : null}
        {rec ? <RecommendPanel /> : null}
      </div>
    </div>
  );
}

function HomepagePreview({
  siteId,
  year,
  compareYear,
}: {
  siteId: string;
  year: number | null;
  compareYear?: number | null;
}) {
  if (compareYear && compareYear !== year) {
    return (
      <div className="grid h-full min-h-0 grid-cols-2">
        <div className="relative min-h-0 overflow-hidden border-r border-line">
          <SingleHomepage siteId={siteId} year={year} />
          <span className="absolute left-2 top-2 rounded-sm bg-bg/80 px-2 py-0.5 font-mono text-[11px] text-fg">
            {year}
          </span>
        </div>
        <div className="relative min-h-0 overflow-hidden">
          <SingleHomepage siteId={siteId} year={compareYear} />
          <span className="absolute left-2 top-2 rounded-sm bg-bg/80 px-2 py-0.5 font-mono text-[11px] text-fg">
            {compareYear}
          </span>
        </div>
      </div>
    );
  }
  return <SingleHomepage siteId={siteId} year={year} />;
}

function SingleHomepage({ siteId, year }: { siteId: string; year: number | null }) {
  if (siteId === "nepean") return <NepeanPage />;
  if (siteId === "buildjyn") return <JynPage year={year} />;
  if (siteId === "mtltimes") return <TimesPage />;
  const site = BY_ID.get(siteId);
  if (!site) return null;
  return (
    <div className="flex h-full flex-col bg-fg text-bg">
      <div className="flex items-center justify-between px-6 py-3" style={{ background: site.accent, color: "#fff" }}>
        <span className="font-display text-lg font-semibold">{site.title}</span>
        <span className="text-xs opacity-80">{site.host}</span>
      </div>
      <div className="grid flex-1 gap-4 p-6 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="font-serif text-2xl leading-tight">{site.tagline}</p>
          {site.address ? <p className="mt-2 text-sm text-subtle">{site.address}</p> : null}
          <p className="mt-4 max-w-prose text-sm leading-relaxed text-[#334155]">
            Archived homepage snapshot for {year ?? site.years[0]}. One screenshot per year, selected from
            Internet Archive captures — the same rule as the VPL kiosk. This rebuild does not host the
            original 100,000-image corpus.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {site.years.slice(0, 4).map((y) => (
            <div key={y} className="rounded-sm border border-line/40 p-2">
              <div className="mb-1 h-16 rounded-sm" style={{ background: site.color }} />
              <div className="text-xs text-subtle">{y}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NepeanPage() {
  const nodes = [
    { label: "About Us", tone: "#7eb6e0" },
    { label: "Programs", tone: "#5b93c5" },
    { label: "Newsletter", tone: "#3d7eb8" },
    { label: "Contact Us", tone: "#2b6cb0" },
  ];
  return (
    <div className="flex h-full flex-col bg-[#eef6fc] text-[#1e3a5f]">
      <div className="bg-[#2b6cb0] px-4 py-3 text-center text-white">
        <p className="font-display text-[clamp(1.05rem,2.4vw,1.55rem)] font-semibold tracking-wide">
          NEPEAN SENIORS' HOME SUPPORT
        </p>
        <p className="text-[11px] tracking-wide text-white/85">3865 Richmond Road Nepean ON K2H 5C1</p>
      </div>
      <div className="grid flex-1 items-center gap-4 px-6 py-6 md:grid-cols-2">
        <div className="flex flex-col items-center text-center">
          <svg width="88" height="72" viewBox="0 0 88 72" aria-hidden>
            <path d="M8 36 L44 8 L80 36" fill="none" stroke="#2b6cb0" strokeWidth="4" />
            <rect x="18" y="36" width="52" height="28" fill="#d7e8f7" stroke="#2b6cb0" strokeWidth="3" />
            <circle cx="44" cy="22" r="7" fill="#f97316" />
          </svg>
          <p className="mt-2 font-display text-sm font-semibold text-[#2b6cb0]">NEPEAN SENIORS'</p>
          <p className="text-xs font-medium text-[#2b6cb0]">HOME SUPPORT</p>
          <p className="mt-4 max-w-xs font-serif text-lg italic leading-snug text-[#1e3a5f]">
            'Help for seniors who want to remain independent'
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
          {nodes.map((n) => (
            <div key={n.label} className="flex flex-col items-center gap-1">
              <div
                className="grid size-16 place-items-center rounded-full border-2 border-[#2b6cb0] text-white shadow-md sm:size-20"
                style={{ background: n.tone }}
              >
                <span className="text-[10px] font-semibold">{n.label.split(" ")[0]}</span>
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wide">{n.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-[#2b6cb0] py-2 text-center text-[11px] tracking-wide text-white">
        About Us | Programs | Newsletters | Contact Us
      </div>
    </div>
  );
}

function JynPage({ year }: { year: number | null }) {
  const early = (year ?? 2025) <= 2017;
  return (
    <div className="flex h-full flex-col bg-[#f4f1ea] text-[#1c1917]">
      <div className={`flex items-center justify-between px-5 py-2 text-white ${early ? "bg-[#c2410c]" : "bg-[#1d4e89]"}`}>
        <span className="grid size-8 place-items-center rounded-full bg-white/15 font-display text-xs font-bold">jyn</span>
        <span className="text-[11px] tracking-wide opacity-90">
          {early ? "A new concept responding to the needs of a new generation" : "Jewish Youth Network · The Project · Timeline"}
        </span>
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden bg-[#7dd3fc]">
        <div className="absolute inset-x-[12%] bottom-[18%] top-[16%] rounded-sm bg-[#7c2d12] shadow-xl">
          <div className="absolute inset-x-[8%] top-[18%] bottom-[28%] bg-[#bae6fd]/70" />
          <div className="absolute left-[6%] top-0 h-full w-4 bg-[#9a3412]" />
          <div className="absolute right-[10%] top-0 h-full w-4 bg-[#9a3412]" />
        </div>
        <div className="absolute bottom-[10%] left-[18%] h-16 w-24 rounded-full bg-[#166534]" />
        <div className="absolute bottom-[12%] right-[22%] h-20 w-28 rounded-full bg-[#15803d]" />
        <p className="absolute bottom-2 left-0 right-0 text-center font-display text-xs font-semibold tracking-[0.14em] text-[#1d4e89]">
          {early ? "MIRIAM AND LARRY ROBBINS CENTRE FOR JEWISH YOUTH" : "JEWISH YOUTH NETWORK"}
        </p>
      </div>
    </div>
  );
}

function TimesPage() {
  return (
    <div className="flex h-full flex-col bg-white text-[#111827]">
      <div className="border-b border-[#1d4e89] px-6 py-3 text-center">
        <p className="font-serif text-[clamp(1.6rem,4vw,2.4rem)] leading-none">Montreal Times</p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-[#64748b]">mtltimes.ca · Montreal · Entertainment · News</p>
      </div>
      <div className="grid flex-1 gap-4 p-5 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="mb-3 aspect-[16/10] rounded-sm bg-[#f59e0b]/80" />
          <h2 className="font-serif text-2xl leading-tight">Betty White dies at 99 years young</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#334155]">
            Archived local-news homepage from the VPL mosaic — one selected capture per year.
          </p>
        </div>
        <div className="space-y-2">
          <div className="rounded-sm bg-[#111827] px-3 py-2 font-display text-sm font-bold tracking-wide text-white">
            BREAKING
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-20 rounded-sm bg-[#1d4e89]" />
            <div className="grid place-items-center rounded-sm bg-[#e11d2e] text-xs font-bold text-white">CH</div>
          </div>
          <p className="text-xs text-[#64748b]">Death at Montreal's Old Port · Canadiens update</p>
        </div>
      </div>
    </div>
  );
}

function PolicyPills({ policy, onChange }: { policy: Policy; onChange: (p: Policy) => void }) {
  const items: Policy[] = ["auto", "greedy", "bfs", "astar"];
  return (
    <div className="flex rounded-md border border-line p-0.5">
      {items.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={`h-8 rounded-sm px-2 text-xs font-medium ${policy === p ? "bg-elevated text-fg" : "text-muted"}`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}

function TracePanel() {
  const graph = useKiosk((s) => s.graph)!;
  const openSite = useKiosk((s) => s.openSite);
  const byHost = useMemo(() => {
    const m = new Map<string, string>();
    for (const s of BY_ID.values()) m.set(s.host, s.id);
    return m;
  }, []);

  return (
    <div className="absolute inset-x-0 top-12 bottom-28 overflow-auto bg-bg/95 p-4">
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="font-display text-lg font-semibold">Specialized trace</h3>
        <p className="text-xs text-muted">
          {graph.source} · {graph.nodes.length} nodes · {graph.edges.length} edges
        </p>
      </div>
      <p className="mb-3 max-w-3xl text-sm text-muted">{graph.stats.note}</p>
      <svg viewBox="0 0 640 280" className="h-52 w-full">
        {graph.edges.map((e, i) => {
          const a = posOf(graph.nodes.find((n) => n.id === e.from), graph.nodes);
          const b = posOf(graph.nodes.find((n) => n.id === e.to), graph.nodes);
          return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#2a3140" strokeWidth="1.2" />;
        })}
        {graph.nodes.map((n) => {
          const p = posOf(n, graph.nodes);
          const fill =
            n.kind === "neighbor" ? "#f5d76e" : n.kind === "snapshot" ? "#3b9eff" : n.kind === "asset" ? "#6b7382" : "#3ddc84";
          return (
            <g key={n.id}>
              <circle cx={p.x} cy={p.y} r={n.kind === "page" && n.label.includes(".") ? 10 : 7} fill={fill} />
              <text x={p.x + 12} y={p.y + 4} fill="#d4d8e0" fontSize="10">
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex flex-wrap gap-2">
        {graph.nodes
          .filter((n) => n.kind === "neighbor")
          .map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => {
                const id = byHost.get(n.host);
                if (id) openSite(id);
              }}
              className="rounded-full border border-line px-2 py-1 text-xs"
            >
              {n.host}
              <span className="ml-1 text-subtle">{n.category}</span>
            </button>
          ))}
      </div>
    </div>
  );
}

function posOf(node: TraceNode | undefined, all: TraceNode[]) {
  if (!node) return { x: 20, y: 20 };
  const i = all.findIndex((n) => n.id === node.id);
  const col = i % 8;
  const row = Math.floor(i / 8);
  return { x: 40 + col * 76, y: 36 + row * 52 };
}

function RecommendPanel() {
  const rec = useKiosk((s) => s.rec)!;
  const openSite = useKiosk((s) => s.openSite);
  const startTour = useKiosk((s) => s.startTour);
  return (
    <div className="absolute bottom-28 left-3 right-3 rounded-md border border-line bg-surface/95 p-3 shadow-lg">
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <h3 className="font-display font-semibold">
          Next five · {rec.resolved}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">occupancy {rec.occupancy.toFixed(2)}</span>
          <button type="button" onClick={startTour} className="text-xs font-medium text-search">
            Play tour
          </button>
        </div>
      </div>
      <p className="mb-2 text-xs text-muted">{rec.reason}</p>
      <ol className="flex flex-wrap gap-2">
        {rec.path.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => openSite(s.id)}
              className="rounded-sm border border-line bg-elevated px-2 py-1 text-left"
            >
              <span className="mr-1 text-search">{i + 1}</span>
              <span className="text-sm">{s.title}</span>
              <span className="ml-2 text-[10px] uppercase text-subtle">{CATEGORY_META[s.category].label}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
