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
  const targets = CATALOG.filter(
    (s) => s.featured && s.id !== start.id && !visited.has(s.id) && s.category !== start.category,
  );
  const goal =
    targets.sort((a, b) => {
      const da = semanticPenalty(start, a) + yearGap(start, a);
      const db = semanticPenalty(start, b) + yearGap(start, b);
      return da - db;
    })[0] ?? CATALOG.find((s) => s.id !== start.id)!;

  type Node = { id: string; g: number; f: number };
  const open: Node[] = [{ id: start.id, g: 0, f: edgeCost(start, goal) }];
  const gScore = new Map<string, number>([[start.id, 0]]);
  const came = new Map<string, string>();
  const closed = new Set<string>();

  while (open.length) {
    open.sort((a, b) => a.f - b.f);
    const cur = open.shift()!;
    if (closed.has(cur.id)) continue;
    closed.add(cur.id);
    if (cur.id === goal.id) break;
    const site = BY_ID.get(cur.id)!;
    const neigh = unused(site, visited)
      .filter((s) => !closed.has(s.id))
      .sort((a, b) => edgeCost(site, a) - edgeCost(site, b))
      .slice(0, 10);
    for (const nb of neigh) {
      const tentative = cur.g + edgeCost(site, nb);
      if (tentative < (gScore.get(nb.id) ?? Infinity)) {
        gScore.set(nb.id, tentative);
        came.set(nb.id, cur.id);
        const h = edgeCost(nb, goal) + (visited.has(nb.id) ? 2 : 0);
        open.push({ id: nb.id, g: tentative, f: tentative + h });
      }
    }
    if (closed.size > 220) break;
  }

  const chain: string[] = [];
  let walk: string | undefined = came.has(goal.id) ? goal.id : [...came.keys()].pop();
  while (walk && walk !== start.id) {
    chain.push(walk);
    walk = came.get(walk);
  }
  chain.reverse();
  return chain
    .map((id) => BY_ID.get(id)!)
    .filter(Boolean)
    .slice(0, n);
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
