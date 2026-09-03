"""ENME517-inspired ranking policies. Mirrors src/lib/policies.ts."""

from __future__ import annotations

import math
from dataclasses import dataclass
from typing import Iterable, Literal

Policy = Literal["greedy", "bfs", "astar", "auto"]
THETA_HIGH = 0.65
THETA_LOW = 0.25


@dataclass(frozen=True)
class Site:
    id: str
    category: str
    x: float
    y: float
    featured: bool = False
    years: tuple[int, ...] = ()


def occupancy(sites: Iterable[Site], category: str) -> float:
    cluster = [s for s in sites if s.category == category]
    if len(cluster) < 2:
        return 0.2
    xs = [s.x for s in cluster]
    ys = [s.y for s in cluster]
    area = max(1.0, (max(xs) - min(xs)) * (max(ys) - min(ys)))
    density = (len(cluster) * 168 * 108) / area
    return max(0.05, min(1.0, density * 1.8))


def pick_policy(occ: float, requested: Policy) -> str:
    if requested != "auto":
        return requested
    if occ >= THETA_HIGH:
        return "greedy"
    if occ <= THETA_LOW:
        return "astar"
    return "bfs"


def _dist(a: Site, b: Site) -> float:
    return math.hypot(a.x - b.x, a.y - b.y)


def recommend(start: Site, catalog: list[Site], visited: set[str], requested: Policy, n: int = 5) -> list[Site]:
    occ = occupancy(catalog, start.category)
    policy = pick_policy(occ, requested)
    unused = [s for s in catalog if s.id != start.id and s.id not in visited]

    def cost(a: Site, b: Site) -> float:
        spatial = _dist(a, b) / 1400
        mismatch = 0.0 if a.category == b.category else 1.15
        years_a = a.years[-1] if a.years else 2000
        years_b = b.years[-1] if b.years else 2000
        return spatial + mismatch + 0.35 * abs(years_a - years_b) / 30

    if policy == "greedy":
        path: list[Site] = []
        cur = start
        used = set(visited) | {start.id}
        for _ in range(n):
            pool = [s for s in unused if s.id not in used]
            if not pool:
                break
            nxt = min(pool, key=lambda s: cost(cur, s))
            path.append(nxt)
            used.add(nxt.id)
            cur = nxt
        return path

    if policy == "bfs":
        out: list[Site] = []
        q = [start]
        seen = {start.id}
        while q and len(out) < n:
            cur = q.pop(0)
            neigh = sorted(
                [s for s in unused if s.id not in seen],
                key=lambda s: (0 if s.featured else 1, cost(cur, s)),
            )[:6]
            for nb in neigh:
                seen.add(nb.id)
                q.append(nb)
                out.append(nb)
                if len(out) >= n:
                    break
        return out[:n]

    # A*
    goals = [s for s in unused if s.featured and s.category != start.category] or unused
    goal = min(goals, key=lambda s: cost(start, s))
    gscore = {start.id: 0.0}
    came: dict[str, str] = {}
    open_ids = {start.id}
    by_id = {s.id: s for s in [start, *unused]}
    closed: set[str] = set()
    while open_ids and len(closed) < 220:
        cur_id = min(open_ids, key=lambda i: gscore[i] + cost(by_id[i], goal))
        open_ids.remove(cur_id)
        closed.add(cur_id)
        if cur_id == goal.id:
            break
        cur = by_id[cur_id]
        for nb in sorted(unused, key=lambda s: cost(cur, s))[:10]:
            if nb.id in closed:
                continue
            tentative = gscore[cur_id] + cost(cur, nb)
            if tentative < gscore.get(nb.id, math.inf):
                gscore[nb.id] = tentative
                came[nb.id] = cur_id
                open_ids.add(nb.id)
    chain: list[str] = []
    walk = goal.id if goal.id in came else (next(reversed(came), None))
    while walk and walk != start.id:
        chain.append(walk)
        walk = came.get(walk)
    chain.reverse()
    return [by_id[i] for i in chain[:n] if i in by_id]
