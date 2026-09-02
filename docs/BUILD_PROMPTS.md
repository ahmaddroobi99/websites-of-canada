# Grok build prompts — develop Websites of Canada step by step

Use these prompts IN ORDER in a fresh Grok session that has GitHub + Netlify (or Vercel) tools.

Repo: https://github.com/ahmaddroobi99/websites-of-canada
Crawler: https://github.com/ahmaddroobi99/resource-graph-crawler
Pathfinding source: https://github.com/ahmaddroobi99/ENME517

After each step: commit to main, keep the site playable, do not rewrite unrelated files.

## Prompt 0 — context pack

You are building Websites of Canada, a browser tribute to the VPL / Internet Archive Canada kiosk.
Read README.md, docs/REQUIREMENTS.md, docs/ARCHITECTURE.md, docs/CRAWLER_INTEGRATION.md, docs/RECOMMENDER.md, data/catalog.json before writing code.
Recreate the exhibit UX: dark kiosk, semantic mosaic, green L-viewfinder, yellow voice Search, arcade HUD, Wayback year filmstrip.
Do not pretend we own 100,000 official screenshots. Use the seed catalog.
ENME517 is a shortest-path DoE, not a recsys — map it as exploration policies.
Commit to ahmaddroobi99/websites-of-canada on main.

## Prompt 1 — static shell + attract screen

Create public/index.html, public/styles.css, public/app.js, netlify.toml (publish = public).
Attract screen: header Internet Archive Europe | Websites of Canada | Reset; center card PRESS BUTTON TO START; floating mini-tiles; footer credit Internet Archive Canada x VPL, concept Kai Jauslin / Nextension, not an official IA product.
Yellow or green button starts the galaxy. Dark navy/black palette. No framework.

## Prompt 2 — semantic mosaic + camera

Pan/zoom camera over public/data/catalog.json.
Each site is a tile at (x,y). Same category = nearby coordinates.
Click-drag / WASD / arrows / on-screen joystick pan.
Wheel / +/- / red + zoom.
Centered green L-shaped viewfinder.
Purple Zoom in for more chip at mid zoom.
Low zoom = color chips; high zoom = title, host, category.
Hot tile = under viewfinder. Enter or green triangle selects it.
Keep 60fps for ~80 tiles. CSS transforms on a world layer are fine.

## Prompt 3 — arcade HUD + keyboard map

Red-box HUD docked bottom-center:
Blue joystick, white magnifier (zoom in), white X (zoom out / close), red + (zoom in / next year), green triangle (select / play), blue power (reset), yellow mic (voice).
Hold joystick to repeat pan. Keyboard: arrows pan, +/-, Enter select, Esc close, R reset, / focus search, V voice.

## Prompt 4 — search + voice intents

Yellow Search chip opens a command box.
Text search: title, host, tagline, tags, category.
Voice: Web Speech API. Intents: open {name}, show {category}, zoom {category}, year {yyyy}, trace this site, recommend / what next.
If SpeechRecognition is missing, typed fallback + one-line notice.
On match: pan/zoom camera to the site or cluster.

## Prompt 5 — Wayback filmstrip

Selected site opens stacked-card viewer.
Show title, tagline, host, category, URL chip.
Filmstrip from catalog.years immediately, then hydrate:
https://web.archive.org/cdx/search/cdx?url={host}&output=json&filter=statuscode:200&filter=mimetype:text/html&collapse=timestamp:4
Cache CDX in sessionStorage. Fail soft.
Selected year green-framed. TIME {max}-{min} label.
Open snapshot at web.archive.org/web/{ts}/{url}. Also offer new tab (iframes may be denied).
Seed check: nepeanseniors.ca 2001-2008; buildjyn.ca 2017/2020/2021/2025; mtltimes.ca news cluster.

## Prompt 6 — specialized trace

Trace this site button.
POST ${CRAWLER_BASE}/api/v1/crawl with { seed, max_pages: 12 }.
Normalize to { nodes, edges, outbound_ca, degraded }.
On failure load public/data/fixtures/{id}.json.
SVG graph beside the filmstrip. Color nodes by mosaic category.
Highlight outbound .ca hosts that exist in the catalog.
Never crawl more than the selected host.

## Prompt 7 — ENME517 exploration policies

public/js/recommend.js with greedy, bfs, astar, doe as in docs/RECOMMENDER.md.
Cluster occupancy from catalog density.
Default policy uses theta_high=0.65 / theta_low=0.25 switch.
Draw recommended 3-site path as polyline.
Green triangle walks one hop. Policy select must change the path.
Do not claim ENME517 is a trained recommender.

## Prompt 8 — README GIFs + architecture polish

README must include mermaid architecture, controller map, GIF slots docs/gifs/01-attract.gif through 06-recommend.gif, storyboard notes, run locally, deploy Netlify, env vars, credit block.
No fake 100k-screenshot claim.

## Prompt 9 — deploy

netlify.toml publish = public.
Create or reuse Netlify project websites-of-canada on team ahmad-droobi1999.
If Netlify create fails, deploy public/ to Vercel as websites-of-canada and record both URLs.
Smoke-test: start -> search seniors -> open nepeanseniors timeline -> trace fixture -> recommend path.

## Prompt 10 — optional Python sidecar

requirements.txt for local sidecar (httpx).
recommender/policies.py mirrors JS policies so a researcher can batch-score catalog.json.
Print policy, occupancy, path for every seed site.

## Guardrails
Vanilla HTML/CSS/JS unless a later prompt introduces a build tool.
One concern per commit.
Preserve tribute credit on every screen.
Do not commit scraped HTML, API keys, or 100k images.
If a tool fails, leave the fixture path working.
