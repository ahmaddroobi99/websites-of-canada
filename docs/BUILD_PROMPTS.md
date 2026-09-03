# Step-by-step Grok build prompts

Use one prompt per session. After each step the kiosk should still be playable.

## Prompt 0 — context

You are building Websites of Canada, a browser tribute to the VPL / Internet Archive Canada kiosk.
Read docs/REQUIREMENTS.md, docs/ARCHITECTURE.md, docs/CRAWLER_INTEGRATION.md, docs/RECOMMENDER.md.
Repo: https://github.com/ahmaddroobi99/websites-of-canada
Crawler: https://github.com/ahmaddroobi99/resource-graph-crawler
Pathfinding source: https://github.com/ahmaddroobi99/ENME517
Recreate: dark kiosk, semantic mosaic, lime viewfinder, yellow voice Search, arcade HUD, Wayback year filmstrip.
Do not claim we own 100,000 official screenshots. ENME517 is a shortest-path DoE — map it as exploration policies.

## Prompt 1 — shell

TanStack Start + React kiosk at `/` and a static twin in `kiosk/` for Netlify. Attract screen: PRESS BUTTON TO START.

## Prompt 2 — mosaic camera

Pan/zoom over the catalog. Same category → nearby (x,y). Green L-viewfinder. Low zoom = chips; high zoom = title + host. WASD pans; A = left.

## Prompt 3 — arcade HUD

Map joystick, yellow mic, green select, blue reset, +/−, Enter, Esc, R, / as in REQUIREMENTS.

## Prompt 4 — search

Text + Web Speech API. Intents: open {name}, show {category}, year {yyyy}, trace, recommend. Fail over to typed search.

## Prompt 5 — Wayback filmstrip

CDX when possible; fallback to catalog years[]. Check nepeanseniors.ca 2001–2008 and buildjyn.ca 2017/2020/2021/2025.

## Prompt 6 — specialized trace

Category-scoped BFS (crawler model). Demo graph if the live service is host-locked. Never crawl outside catalog .ca hosts.

## Prompt 7 — ENME517 policies

Implement greedy, bfs, astar. Occupancy = cluster size / bbox area. Draw a 5-site polyline. Switching policy must change the path.

## Prompt 8 — README + GIFs

Mermaid architecture, controller map, GIF slots docs/gifs/01-attract.gif … 06-recommend.gif, credit IA Canada / IA Europe / VPL / Kai Jauslin.

## Prompt 9 — deploy

Netlify project websites-of-canada, publish `kiosk/`. Smoke: start → search “seniors” → open Nepean timeline → Trace → Recommend.

## Guardrails

Vanilla or React; one concern per commit; no secrets; no 100k image scrape; do not vendor the crawler source.
