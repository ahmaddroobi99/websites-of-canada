import { ADJACENT, BY_ID, CATALOG, occupancy, type Category, type Site } from "./catalog";
import { dist } from "./utils";

export type Policy = "greedy" | "bfs" | "astar" | "auto";

export interface RecommendResult {
  policy: Policy;
  resolved: Exclude<Policy, "auto">;
  occupancy: number;
  reason: string;
  path: Site[];
}

const THETA_HIGH = 0.65;
const THETA_LOW = 0.25;

export function pickPolicy(category: Category, requested: Policy): Exclude<Policy, "auto"> {
  if (requested !== "auto") return requested;
  const occ = occupancy(category);
  if (occ >= THETA_HIGH) return "greedy";
  if (occ <= THETA_LOW) return "astar";
  return "bfs";
}

function unused(from: Site, visited: Set<string>) {
  return CATALOG.filter((s) => s.id !== from.id && !visited.has(s.id));
}

function semanticPenalty(a: Site, b: Site) {
  if (a.category === b.category) return 0;
  if (ADJACENT[a.category].includes(b.category)) return 0.45;
  return 1.15;
}

function yearGap(a: Site, b: Site) {
  const ay = a.years[a.years.length - 1] ?? 2000;
  const by = b.years[b.years.length - 1] ?? 2000;
  return Math.abs(ay - by) / 30;
}

function edgeCost(a: Site, b: Site) {
  const spatial = dist(a.x, a.y, b.x, b.y) / 1400;
  return spatial + semanticPenalty(a, b) + yearGap(a, b) * 0.35;
}

function greedyPath(start: Site, visited: Set<string>, n: number): Site[] {
  const path: Site[] = [start];
  const used = new Set(visited);
  used.add(start.id);
  let cur = start;
  for (let i = 0; i < n; i++) {
    const pool = unused(cur, used);
    if (!pool.length) break;
    pool.sort((a, b) => edgeCost(cur, a) - edgeCost(cur, b));
    const next = pool[0];
    path.push(next);
    used.add(next.id);
    cur = next;
  }
  return path.slice(1);
}

function bfsPath(start: Site, visited: Set<string>, n: number): Site[] {
  const used = new Set(visited);
  used.add(start.id);
  const q: Site[] = [start];
  const parent = new Map<string, string | null>([[start.id, null]]);
  const out: Site[] = [];

  while (q.length && out.length < n) {
    const cur = q.shift()!;
    const neigh = unused(cur, used)
      .filter((s) => s.category === cur.category || ADJACENT[cur.category].includes(s.category))
      .sort((a, b) => {
        const degA = a.featured ? 0 : 1;
        const degB = b.featured ? 0 : 1;
        return degA - degB || edgeCost(cur, a) - edgeCost(cur, b);
      })
      .slice(0, 6);
    for (const nb of neigh) {
      if (parent.has(nb.id)) continue;
      parent.set(nb.id, cur.id);
      used.add(nb.id);
      q.push(nb);
      if (nb.id !== start.id) out.push(nb);
      if (out.length >= n) break;
    }
  }
  return out.slice(0, n);
}

function astarPath(start: Site, visited: Set<string>, n: number): Site[] {
  const goal =
    CATALOG.filter(
      (s) => s.featured && s.id !== start.id && !visited.has(s.id) && s.category !== start.category,
    ).sort((a, b) => edgeCost(start, a) - edgeCost(start, b))[0] ??
    CATALOG.find((s) => s.id !== start.id && !visited.has(s.id));
  if (!goal) return [];

  const waypoints = CATALOG.filter(
    (s) => s.featured && s.id !== start.id && s.id !== goal.id && !visited.has(s.id),
  )
    .sort((a, b) => {
      const fa = edgeCost(start, a) + edgeCost(a, goal);
      const fb = edgeCost(start, b) + edgeCost(b, goal);
      const catA = a.category === start.category ? 0.35 : 0;
      const catB = b.category === start.category ? 0.35 : 0;
      return fa + catA - (fb + catB);
    })
    .slice(0, Math.max(0, n - 1));

  const path = [...waypoints, goal];
  const seen = new Set<string>();
  return path.filter((s) => (seen.has(s.id) ? false : (seen.add(s.id), true))).slice(0, n);
}

export function recommend(start: Site, visitedIds: string[], requested: Policy, n = 5): RecommendResult {
  const visited = new Set(visitedIds);
  const occ = occupancy(start.category);
  const resolved = pickPolicy(start.category, requested);
  const reason =
    requested === "auto"
      ? occ >= THETA_HIGH
        ? `Dense ${start.category} cluster (occupancy ${occ.toFixed(2)}) → greedy, matching ENME517 high-occupancy fields.`
        : occ <= THETA_LOW
          ? `Sparse ${start.category} field (occupancy ${occ.toFixed(2)}) → A*, matching ENME517 low-occupancy fields.`
          : `Mid occupancy ${occ.toFixed(2)} → BFS cold-start expansion.`
      : `Visitor selected ${resolved}. Occupancy of this cluster is ${occ.toFixed(2)}.`;

  const runner = resolved === "greedy" ? greedyPath : resolved === "bfs" ? bfsPath : astarPath;
  const path = runner(start, visited, n);
  return { policy: requested, resolved, occupancy: occ, reason, path };
}
