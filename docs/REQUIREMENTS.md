# Websites of Canada — Platform Requirements

**Product name:** Websites of Canada  
**Inspiration:** Internet Archive Canada + Vancouver Public Library interactive kiosk (Central Library, 4th floor, installed May 29, 2026)  
**Sibling exhibits:** Swiss National Library (2021, Kai Jauslin / Nextension + Barbara Signori), Internet Archive Europe / KB Netherlands (`https://display.archive.org/nl`), Internet Archive SF HQ  
**This repo:** a rebuildable web platform + specialized `.ca` resource-graph tracing + pathfinding recommender

Official exhibit writeup: https://internetarchivecanada.org/2026/06/19/explore-30-years-of-the-canadian-web-at-vancouver-public-library/

---

## 1. Problem

A web archive is invisible until you already know the URL. The VPL kiosk solves that by turning 100,000 preserved `.ca` homepages into a playable semantic galaxy. This project rebuilds that experience in the browser, then adds two capabilities the physical kiosk does not have:

1. **Specialized trace** of a selected site using [resource-graph-crawler](https://github.com/ahmaddroobi99/resource-graph-crawler) (same-host BFS; URLs = nodes; HTML/CSS/JS/comment/binary refs = edges).
2. **Exploration recommender** inspired by [ENME517](https://github.com/ahmaddroobi99/ENME517) shortest-path DoE (A* / BFS / greedy / Weighted A* over a constrained semantic grid).

ENME517 is **not** a recommender system. This project *maps* its pathfinding + occupancy-density findings onto “which archived Canadian site should the visitor explore next.”

---

## 2. Goals

### Must have (MVP)
- Recreate the exhibit interaction loop in a browser: start screen → semantic mosaic → zoom/pan → select site → year timeline (Wayback) → reset.
- On-screen arcade HUD that mirrors the red box: joystick, zoom +/−, select, close, reset, yellow voice-search button.
- Keyboard + mouse + touch equivalents so it works without the physical controller.
- Voice search via Web Speech API (“show me seniors websites”, “open montreal times”, “zoom news”).
- Seed catalog of real sites visible in the VPL photos, clustered by category.
- Year filmstrip per site using Wayback CDX (`collapse=timestamp:4`, status 200, HTML only).
- Replay the chosen snapshot in an iframe or a new tab via `https://web.archive.org/web/{timestamp}/{url}`.
- Documented system architecture (mermaid) and GIF/screenshot slots in the README.
- Requirements + step-by-step Grok build prompts so the platform can be rebuilt incrementally.
- Static hosting on Netlify (`netlify.toml`).

### Should have (v1.1)
- On-demand specialized trace: call `POST /api/v1/crawl` on the resource-graph-crawler service for the selected host.
- Draw the returned resource graph as an overlay on the site viewer.
- Classify discovered resources into the **same** mosaic categories (news, seniors-care, faith-youth, marketing, education, civic, …).
- Recommender trail: highlight the next 3 sites using a selectable policy (`greedy` | `bfs` | `astar` | `doe`).
- QR / share link that opens the current snapshot on a phone.
- Bilingual labels (EN / FR) for the HUD.

### Could have (v2)
- Live CDX-backed mosaic of thousands of `.ca` homepages (not just the seed catalog).
- VLM + embedding pipeline that re-clusters screenshots the way the physical exhibit does.
- Physical-controller adapter (USB HID joystick) for library installs.
- Session DoE: randomly assign a ranking policy and log dwell / sites-opened (ethics + no PII).
- Occupancy-density experiment: measure when greedy similarity loses to A* as a cluster gets sparse.

### Out of scope
- Recreating Internet Archive’s 100,000 proprietary screenshot corpus.
- Crawling the entire `.ca` web from the browser.
- Training a new VLM.
- Claiming ENME517 already contains a recommender.

---

## 3. Users

| Persona | Need |
|---|---|
| Library visitor | Playful exploration, no tutorial wall |
| Student / journalist | Find a specific `.ca` domain and its year history |
| Digital historian | See how a community, newsroom, or nonprofit site evolved |
| Developer (you / Grok) | Rebuild from this pack without hidden context |

---

## 4. Interaction model (from the VPL photos)

### Hardware analogue (on-screen HUD)
| Control | Color | Action |
|---|---|---|
| Joystick | Blue ball | Pan the mosaic |
| Magnifier | White | Zoom toward viewfinder |
| X | White | Zoom out / close overlay |
| + | Red | Zoom in / next year |
| Triangle | Green | Select / open site / play timeline |
| Power | Blue | Reset to start screen |
| Mic | Yellow | Voice command |

Green L-shaped corner brackets are the viewfinder. Purple chip: “Zoom in for more”. Yellow chip: “Search”.

### Screen states
0. **Attract / start** — floating tiles + “Internet Archive Europe / PRESS BUTTON TO START”.
1. **Galaxy** — dense mosaic, viewfinder, search chip, Reset.
2. **Cluster** — zoomed neighborhood where homepages become readable.
3. **Focus** — one site framed, URL chip, play overlay.
4. **Wayback viewer** — stacked year cards, TIME range, filmstrip (e.g. 2001–2008 or 2017–2025), IA chrome, QR.
5. **Trace overlay** — resource-graph nodes/edges + category stamps.
6. **Recommend path** — A*/greedy trail through neighbor tiles.

---

## 5. Information architecture

```
Start
  └─ Mosaic (semantic grid)
        ├─ Voice / text search → jump to cluster or site
        ├─ Zoom / pan
        └─ Select site
              ├─ Year timeline (CDX)
              ├─ Open snapshot (Wayback)
              ├─ Specialized trace (resource-graph-crawler)
              └─ Recommend next (ENME517 policies)
```

---

## 6. Data requirements

### Seed catalog (`data/catalog.json`)
Each record:

```json
{
  "id": "nepeanseniors",
  "host": "nepeanseniors.ca",
  "url": "http://nepeanseniors.ca/",
  "title": "Nepean Seniors' Home Support",
  "tagline": "Help for seniors who want to remain independent",
  "address": "3865 Richmond Road Nepean ON K2H 5C1",
  "category": "seniors-care",
  "tags": ["seniors", "home-support", "ottawa", "nonprofit"],
  "years": [2001, 2002, 2003, 2004, 2005, 2008],
  "waybackExample": "https://web.archive.org/web/20010722232220/http://nepeanseniors.ca/",
  "x": 0.22,
  "y": 0.48
}
```

`x`,`y` ∈ [0,1] are semantic-grid coordinates. Sites in the same category must cluster.

### Category taxonomy
`seniors-care`, `community-nonprofit`, `faith-youth`, `local-news`, `national-news`, `newswire`, `magazines`, `education`, `digital-agency`, `creative-studio`, `photography`, `civic-government`, `health`, `sports`, `business-directory`, `indigenous`, `arts-culture`, `environment`

### Wayback
- CDX: `https://web.archive.org/cdx/search/cdx?url={host}&output=json&filter=statuscode:200&filter=mimetype:text/html&collapse=timestamp:4`
- Availability: `https://archive.org/wayback/available?url=`
- Replay: `https://web.archive.org/web/{timestamp}/{url}`
- Optional image mode: `https://web.archive.org/web/{timestamp}im_/{url}` (flaky; fallback to CSS thumbnail cards)

Do not block first paint on CDX. Hydrate years after load.

---

## 7. Functional requirements

### FR1 Mosaic explorer
- Render N seed tiles (MVP: ≤ 80) in a semantic grid.
- Pan with joystick HUD, WASD/arrows, click-drag, touch.
- Zoom with `+`/`−`, scroll wheel, pinch, red/white buttons.
- Viewfinder stays centered. Tiles under the viewfinder are “hot”.
- At low zoom, tiles look like a pointillist field. At high zoom, title + host + category are readable.

### FR2 Search
- Text search over title, host, tagline, tags, category.
- Voice search: start on yellow button or “Search” chip. Parse intents:
  - `open {site}`
  - `show {category}` / `zoom {category}`
  - `year {yyyy}`
  - `trace this site`
  - `recommend` / `what next`
- If Speech API is unavailable, fall back to typed search and say so.

### FR3 Wayback viewer
- Filmstrip of available years.
- Stacked-card visual matching the kiosk (selected year green-framed).
- Open snapshot. Show the raw Wayback URL.
- Reset returns to galaxy, not browser history back.

### FR4 Specialized trace (crawler)
- Button: “Trace this site”.
- Client calls resource-graph-crawler `POST /api/v1/crawl` with `{ seed: url, max_pages }`.
- If the live service is unreachable, use a fixture graph so the UI still demos.
- Render nodes + edges. Stamp each node with a mosaic category when the path/title matches the taxonomy.
- Show outbound `.ca` links as candidate mosaic neighbors.

### FR5 Recommender
- Policies implemented in JS (and mirrored in `recommender/` Python):
  - `greedy` — nearest unused neighbor in (x,y) of same or adjacent category.
  - `bfs` — high-degree / popular sites in the resource graph; cold-start friendly.
  - `astar` — `f = g + h` where `h` combines semantic distance, year gap, and diversity penalty.
  - `doe` — randomly assign a policy per session and record which one was used.
- Occupancy rule from ENME517: if cluster occupancy is high, default to greedy; if sparse, default to A*.
- Draw the recommended path as a polyline across the mosaic.

### FR6 Deploy + docs
- `netlify.toml` with publish dir `public/`.
- README with architecture mermaid, GIF slots, run/deploy commands.
- This requirements file, architecture, crawler integration, recommender note, and BUILD_PROMPTS.

---

## 8. Non-functional requirements

| ID | Requirement |
|---|---|
| NFR1 | MVP is static. No required backend for mosaic + HUD + seed timelines. |
| NFR2 | Works in current Chromium and Firefox. Voice search may be Chromium-only. |
| NFR3 | First meaningful paint < 2s on broadband with the seed catalog. |
| NFR4 | No personal data collected. DoE logs are local-only unless the operator opts in. |
| NFR5 | Respect Wayback / IA terms. Rate-limit CDX (max 1 request/site/session unless refreshed). |
| NFR6 | Crawler calls are host-scoped and bounded (`max_pages` ≤ 12 on the public API). |
| NFR7 | Accessible: keyboard-only path through every state. Visible focus. Contrast on HUD labels. |
| NFR8 | Responsive: desktop kiosk (1920×1080) first; usable on tablet. |
| NFR9 | Code and copy credit Internet Archive Canada, VPL, Internet Archive Europe, Kai Jauslin / Nextension. This is a tribute rebuild, not an official IA product. |

---

## 9. Integration requirements

### resource-graph-crawler
See `docs/CRAWLER_INTEGRATION.md`.

Env:
```
VITE_CRAWLER_BASE=https://<deployed-crawler>
VITE_CRAWLER_API_KEY=
```

### ENME517 mapping
See `docs/RECOMMENDER.md`.
Reuse the *idea* (algorithm dominance vs occupancy density), not the UCalgary notebooks as a runtime.

---

## 10. Success criteria

A reviewer can:
1. Open the Netlify URL and reach the galaxy without instructions.
2. Voice- or text-search “seniors” and land on `nepeanseniors.ca`.
3. Open the 2001 snapshot filmstrip.
4. Run a specialized trace (live or fixture) and see a graph.
5. Get a 3-site recommended path that changes when the policy changes.
6. Rebuild the whole platform from `docs/BUILD_PROMPTS.md` in a fresh Grok session.

---

## 11. Acceptance tests (manual)

- [ ] Start screen → yellow or green button → galaxy
- [ ] Pan with HUD joystick and with keyboard
- [ ] Zoom until a tile title is readable
- [ ] Select `buildjyn.ca` and see 2017 / 2020 / 2021 / 2025
- [ ] Select `mtltimes.ca` and see a news cluster neighborhood
- [ ] Voice: “show news” pans/zooms the news cluster
- [ ] Reset returns to start
- [ ] Trace button renders nodes even when crawler is offline (fixture)
- [ ] Policy toggle `greedy` vs `astar` changes the drawn path
- [ ] `netlify.toml` publish directory is `public`
