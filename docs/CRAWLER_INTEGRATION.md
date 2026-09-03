# Specialized trace — resource-graph-crawler

Sibling service: [ahmaddroobi99/resource-graph-crawler](https://github.com/ahmaddroobi99/resource-graph-crawler)

## What the crawler actually is

A same-host BFS. Fetched URLs are **nodes**. References discovered in HTML, scripts, CSS, comments, and binary payloads are **edges**. Production facade:

| Path | Role |
| --- | --- |
| `GET /health` | Liveness |
| `GET /ready` | Target probe (503 if the configured seed is down) |
| `POST /api/v1/crawl` | Bounded crawl. Body: `{ max_pages, workers }`. Capped (~12 pages on the public API). |

The live API crawls a **configured** `RGC_BASE_URL` / `RGC_ALLOWED_HOST`. It does not accept an arbitrary `.ca` URL. Folding a 2,000-page BFS into a kiosk click would also miss the serverless budget.

## What the kiosk does instead (the specialized part)

On **Trace**, the kiosk runs a **category-scoped resource graph** that reuses the crawler’s *model*:

1. Seed = the focused catalog host (homepage + typical same-host paths).
2. Expand up to four **same-category** mosaic neighbors, then adjacent taxa.
3. Stamp every node with the mosaic taxonomy (`local-news`, `seniors-care`, `faith-youth`, …).
4. Attach Wayback year nodes as a time axis.
5. Cap at ~12 pages / assets, matching `RGC_API_MAX_PAGES`.
6. If `VITE_CRAWLER_BASE` is set, `POST /api/v1/crawl` is attempted; a timeout or 4xx/5xx falls back to the local graph. The neighbor overlay still applies.

This is **not** “crawl the whole `.ca` web.” It is a specialized trace: stay inside the exhibit’s semantic neighborhood.

## Response shape the UI expects

```ts
{
  seed: string
  source: "specialized-local" | "crawler" | "fixture"
  nodes: { id, url, kind, label, category, host }[]
  edges: { from, to, rel }[]
  stats: { pages, assets, neighbors, elapsedMs, note }
}
```

`kind`: `page` | `asset` | `neighbor` | `snapshot`.  
`rel`: `href` | `asset` | `category` | `wayback`.

## Guardrails

- Never send a wildcard `*.ca` crawl from the kiosk.
- Do not vendor the crawler source into this repo.
- No secrets in the client. If the crawler requires `Authorization: Bearer`, keep the key on a server function — the MVP does not.
