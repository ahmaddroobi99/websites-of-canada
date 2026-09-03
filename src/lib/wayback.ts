import type { Site } from "./catalog";

export interface WaybackCapture {
  timestamp: string;
  year: number;
  original: string;
  replay: string;
  status: string;
}

const cache = new Map<string, WaybackCapture[]>();

export function replayUrl(timestamp: string, original: string) {
  const ts = timestamp.replace(/\D/g, "").padEnd(14, "0").slice(0, 14);
  return `https://web.archive.org/web/${ts}/${original}`;
}

export function capturesFromSite(site: Site): WaybackCapture[] {
  return site.years.map((year) => {
    const timestamp = `${year}0701000000`;
    const original = site.url;
    return {
      timestamp,
      year,
      original,
      replay: site.waybackExample && year === site.years[0] ? site.waybackExample : replayUrl(timestamp, original),
      status: "200",
    };
  });
}

export async function fetchCdx(site: Site): Promise<WaybackCapture[]> {
  if (cache.has(site.host)) return cache.get(site.host)!;
  const fallback = capturesFromSite(site);
  try {
    const qs = new URLSearchParams({
      url: site.host,
      output: "json",
      filter: "statuscode:200",
      collapse: "timestamp:6",
      limit: "24",
    });
    const res = await fetch(`https://web.archive.org/cdx/search/cdx?${qs.toString()}`);
    if (!res.ok) {
      cache.set(site.host, fallback);
      return fallback;
    }
    const data = (await res.json()) as string[][];
    if (!Array.isArray(data) || data.length < 2) {
      cache.set(site.host, fallback);
      return fallback;
    }
    const rows = data.slice(1);
    const byYear = new Map<number, WaybackCapture>();
    for (const row of rows) {
      const timestamp = row[1];
      const original = row[2];
      const status = row[4] ?? "200";
      const year = Number(timestamp.slice(0, 4));
      if (!byYear.has(year)) {
        byYear.set(year, {
          timestamp,
          year,
          original,
          replay: replayUrl(timestamp, original),
          status,
        });
      }
    }
    const list = [...byYear.values()].sort((a, b) => b.year - a.year);
    const merged = list.length ? list : fallback;
    cache.set(site.host, merged);
    return merged;
  } catch {
    cache.set(site.host, fallback);
    return fallback;
  }
}
