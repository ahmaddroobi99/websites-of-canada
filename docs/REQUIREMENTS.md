# Websites of Canada — Platform Requirements

**Product name:** Websites of Canada  
**Inspiration:** Internet Archive Canada + Vancouver Public Library interactive kiosk (Central Library, installed May 29, 2026)  
**Sibling exhibits:** Swiss National Library (2021, Kai Jauslin / Nextension + Barbara Signori), Internet Archive Europe / KB Netherlands, Internet Archive SF HQ  

Official exhibit writeup: https://internetarchivecanada.org/2026/06/19/explore-30-years-of-the-canadian-web-at-vancouver-public-library/

This is a **tribute rebuild**, not an official IA/VPL product.

---

## 1. Problem

A web archive is invisible until you already know the URL. The VPL kiosk turns ~100,000 preserved `.ca` homepages into a playable semantic galaxy. This project rebuilds that loop in the browser, then adds two capabilities the physical kiosk does not have:

1. **Specialized trace** using the [resource-graph-crawler](https://github.com/ahmaddroobi99/resource-graph-crawler) *model* (URLs = nodes, refs = edges, same-host BFS, cap ~12) scoped to mosaic categories.
2. **Exploration recommender** mapping [ENME517](https://github.com/ahmaddroobi99/ENME517) shortest-path DoE (greedy / BFS / A* vs occupancy) onto “which archived site to open next.”

ENME517 is **not** a recommender. Do not describe this as “the ENME517 recommender.”

---

## 2. Must have

- Attract → mosaic → pan/zoom → select → Wayback filmstrip → reset.
- Arcade HUD analogue (joystick, +/−, select, close, reset, yellow search).
- Keyboard, mouse, touch. Voice search via Web Speech API with typed fallback.
- Seed catalog of sites visible in the VPL photos, clustered by category, plus filler chips for mosaic density.
- Year filmstrip (catalog years; hydrate Wayback CDX when CORS allows).
- Specialized trace + ENME517 policies with a polyline that **changes** when the policy changes.
- Docs: architecture mermaid, GIF slots, BUILD_PROMPTS, this file.
- Static Netlify kiosk in `kiosk/`. React kiosk for the Grok/Vercel app.

## 3. Out of scope

- Recreating IA’s 100,000 proprietary screenshots.
- Crawling the entire `.ca` web from the browser.
- Claiming we own the exhibit.

## 4. Interaction (from the photos)

| Control | Color | Action |
| --- | --- | --- |
| Joystick / WASD | Blue | Pan |
| Magnifier / + / wheel | White / red | Zoom in |
| − | White | Zoom out |
| Triangle / Enter | Green | Open focus site |
| Mic / Space / yellow chip | Yellow | Voice / text search |
| × / Esc | White / red | Close overlay |
| Power / R | Blue | Reset |

Green L-corners = viewfinder. Purple chip = “Zoom in for more”.

## 5. Seed sites (from the VPL photos)

`nepeanseniors.ca` (2001–2008), `buildjyn.ca` (2017/2020/2021/2025), `mtltimes.ca`, `newswirebc.ca`, `newsrooms.ca`, `larevue.qc.ca`, `lamauricie.qc.ca`, `nubee.ca`, `tacticcreative.ca`, `paradigmgroup.ca`, `photos.ca`, plus news / agency / seniors / faith-youth / civic clusters.

## 6. Success

A visitor can: start → search “seniors” → open Nepean timeline → Trace → Recommend (greedy vs A* paths differ) → Reset.
