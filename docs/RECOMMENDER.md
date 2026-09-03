# ENME517 → kiosk recommender

Source: [ahmaddroobi99/ENME517](https://github.com/ahmaddroobi99/ENME517)  
Lab rebuild: [enme517-lab](https://github.com/ahmaddroobi99/enme517-lab)

ENME517 is a **Design of Experiments** project on shortest-path search (greedy, BFS, A*) over occupancy-constrained grids. It is **not** a recommender system. This kiosk *maps* those policies onto “which archived `.ca` site should the visitor open next.”

## Mapping

| ENME517 | Kiosk |
| --- | --- |
| Grid cell | Catalog site |
| Obstacle | Already visited, or no known year |
| Occupancy density | Cluster size / bounding-box area |
| greedy / BFS / A* | Ranking policies for the next 5 sites |

## Switch rule

```
θ_high = 0.65
θ_low  = 0.25

if occupancy(cluster) >= θ_high: greedy   # dense news/agency fields
elif occupancy(cluster) <= θ_low:  astar  # sparse niches
else:                              bfs    # cold start
```

Visitors can override with `auto | greedy | bfs | astar`. Changing policy **must** change the drawn polyline.

## Costs

```
edge(a,b) = spatial/1400 + category_mismatch + 0.35 * year_gap/30
```

- Same category: mismatch 0
- Adjacent taxonomy: 0.45
- Otherwise: 1.15

A* uses `f = g + h` with `h` = remaining semantic+spatial cost toward a featured site outside the current category (diversity).

Python sidecar: `recommender/policies.py` mirrors the TypeScript in `src/lib/policies.ts` for batch scoring. Do not describe this as “the ENME517 recommender.”
