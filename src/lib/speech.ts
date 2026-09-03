import { CATEGORY_META, searchSites, type Category, type Site } from "./catalog";

export type Intent =
  | { type: "open"; site: Site; raw: string }
  | { type: "show"; category: Category; raw: string }
  | { type: "year"; year: number; raw: string }
  | { type: "trace"; raw: string }
  | { type: "recommend"; raw: string }
  | { type: "reset"; raw: string }
  | { type: "search"; query: string; raw: string };

const CATEGORY_ALIASES: Array<[RegExp, Category]> = [
  [/senior|a[iî]n[eé]|elder|aging/i, "seniors-care"],
  [/news ?wire|press release|cision/i, "newswire"],
  [/news|journal|times|gazette|herald/i, "local-news"],
  [/magazine|revue|walrus|maclean/i, "magazines"],
  [/agenc|marketing|nubee|paradigm/i, "digital-agency"],
  [/studio|creative|tactic/i, "creative-studio"],
  [/photo|stock|lens/i, "photography"],
  [/youth|jewish|hillel|faith|synagogue|church/i, "faith-youth"],
  [/universit|college|school|educat/i, "education"],
  [/city|civic|government|canada\.ca|municipal/i, "civic-government"],
  [/communit|nonprofit|charity|united way/i, "community-nonprofit"],
  [/indigenous|aboriginal|aptn|first nation/i, "indigenous"],
  [/art|nfb|culture|banff|film/i, "arts-culture"],
  [/sport|hockey|olympic|canuck/i, "sports"],
  [/business|bank|shopify|directory|yellow/i, "business"],
  [/environment|climate|park|suzuki|nature/i, "environment"],
  [/librar|archive|wayback|vpl/i, "library-archive"],
  [/health|hospital|sickkids/i, "health"],
];

export function parseIntent(raw: string): Intent {
  const text = raw.trim();
  const lower = text.toLowerCase();

  if (/^(reset|start over|go home|attract)/i.test(lower)) return { type: "reset", raw: text };
  if (/\b(trace|crawl|graph|map this)\b/i.test(lower)) return { type: "trace", raw: text };
  if (/\b(recommend|what next|suggest|path)\b/i.test(lower)) return { type: "recommend", raw: text };

  const yearHit = lower.match(/\b(19|20)\d{2}\b/);
  if (yearHit && /\byear\b|\bin\b|\bfrom\b/.test(lower)) {
    return { type: "year", year: Number(yearHit[0]), raw: text };
  }

  const openMatch = lower.match(/^(open|go to|show me|take me to)\s+(.+)/i);
  if (openMatch) {
    const q = openMatch[2];
    for (const [re, cat] of CATEGORY_ALIASES) {
      if (re.test(q) && !/\.ca\b/.test(q)) return { type: "show", category: cat, raw: text };
    }
    const hits = searchSites(q, 1);
    if (hits[0]) return { type: "open", site: hits[0], raw: text };
  }

  if (/^(show|zoom|find|cluster)\s+/i.test(lower)) {
    for (const [re, cat] of CATEGORY_ALIASES) {
      if (re.test(lower)) return { type: "show", category: cat, raw: text };
    }
  }

  for (const [re, cat] of CATEGORY_ALIASES) {
    if (re.test(lower) && lower.split(/\s+/).length <= 4) {
      return { type: "show", category: cat, raw: text };
    }
  }

  const hits = searchSites(text, 1);
  if (hits[0] && text.length > 2) return { type: "open", site: hits[0], raw: text };
  return { type: "search", query: text, raw: text };
}

export function categoryLabel(cat: Category, lang: "en" | "fr" = "en") {
  return lang === "fr" ? CATEGORY_META[cat].fr : CATEGORY_META[cat].label;
}

type Recog = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((ev: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: ((ev: { error: string }) => void) | null;
  start: () => void;
  stop: () => void;
};

export function speechSupported() {
  return typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window);
}

export function startListening(onText: (t: string) => void, onEnd: () => void, onError: (e: string) => void) {
  const Ctor =
    (window as unknown as { webkitSpeechRecognition?: new () => Recog; SpeechRecognition?: new () => Recog })
      .webkitSpeechRecognition ||
    (window as unknown as { SpeechRecognition?: new () => Recog }).SpeechRecognition;
  if (!Ctor) {
    onError("no-speech-api");
    return { stop() {} };
  }
  const rec = new Ctor();
  rec.lang = "en-CA";
  rec.continuous = false;
  rec.interimResults = false;
  rec.onresult = (ev) => {
    const t = ev.results[0]?.[0]?.transcript ?? "";
    if (t) onText(t);
  };
  rec.onend = onEnd;
  rec.onerror = (ev) => onError(ev.error);
  rec.start();
  return rec;
}
