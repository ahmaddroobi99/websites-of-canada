import { Mic, Search, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { searchSites } from "@/lib/catalog";
import { speechSupported, startListening } from "@/lib/speech";
import { useKiosk } from "@/store/kiosk-store";

export function SearchOverlay() {
  const open = useKiosk((s) => s.searchOpen);
  const query = useKiosk((s) => s.query);
  const setQuery = useKiosk((s) => s.setQuery);
  const runQuery = useKiosk((s) => s.runQuery);
  const toggleSearch = useKiosk((s) => s.toggleSearch);
  const listening = useKiosk((s) => s.listening);
  const setListening = useKiosk((s) => s.setListening);
  const speechError = useKiosk((s) => s.speechError);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) return null;
  const hits = searchSites(query, 8);

  const listen = () => {
    if (!speechSupported()) {
      setListening(false, "Voice search needs Chrome or Edge on HTTPS. Type instead.");
      inputRef.current?.focus();
      return;
    }
    setListening(true, null);
    startListening(
      (t) => {
        setQuery(t);
        runQuery(t);
      },
      () => setListening(false),
      (err) => setListening(false, err === "no-speech-api" ? "Voice unavailable — type a query." : err),
    );
  };

  return (
    <div className="absolute inset-0 z-40 flex items-end justify-center bg-bg/50 p-4 sm:items-center">
      <div className="w-full max-w-xl rounded-lg border border-line bg-surface p-4 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-display text-lg font-semibold">Search the Canadian web</p>
          <button type="button" onClick={() => toggleSearch(false)} className="rounded-sm p-1 text-muted hover:text-fg">
            <X className="size-5" />
          </button>
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const v = (inputRef.current?.value || query).trim();
            if (v) runQuery(v);
          }}
        >
          <label className="sr-only" htmlFor="kiosk-search">
            Search
          </label>
          <input
            id="kiosk-search"
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="open montreal times · show seniors · year 2001"
            className="h-11 flex-1 rounded-md border border-line bg-elevated px-3 text-fg outline-none ring-finder focus:ring-2"
          />
          <button
            type="button"
            onClick={listen}
            className={`grid size-11 place-items-center rounded-md ${listening ? "bg-search text-search-fg" : "bg-elevated text-fg"}`}
            aria-label="Voice search"
          >
            <Mic className="size-5" />
          </button>
          <button type="submit" className="grid size-11 place-items-center rounded-md bg-fg text-bg" aria-label="Run search">
            <Search className="size-5" />
          </button>
        </form>
        {speechError ? <p className="mt-2 text-xs text-danger">{speechError}</p> : null}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["show seniors", "open montreal times", "open nepean", "show agencies", "year 2001"].map((hint) => (
            <button
              key={hint}
              type="button"
              onClick={() => runQuery(hint)}
              className="rounded-full border border-line bg-elevated px-2.5 py-1 text-[11px] text-muted hover:border-search hover:text-fg"
            >
              {hint}
            </button>
          ))}
        </div>
        <ul className="mt-3 max-h-56 overflow-auto">
          {hits.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => runQuery(`open ${s.host}`)}
                className="flex w-full items-center justify-between rounded-sm px-2 py-2 text-left hover:bg-elevated"
              >
                <span>
                  <span className="block text-sm font-medium">{s.title}</span>
                  <span className="block text-xs text-muted">{s.host}</span>
                </span>
                <span className="text-[10px] uppercase tracking-wide text-subtle">{s.category}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
