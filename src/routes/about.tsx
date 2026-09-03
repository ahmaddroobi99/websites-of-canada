import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({ component: About });

function About() {
  return (
    <main className="min-h-dvh overflow-auto bg-bg px-6 py-12 text-fg">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">Websites of Canada</p>
        <h1 className="mt-2 font-serif text-4xl">Architecture</h1>
        <p className="mt-4 text-muted">
          A browser tribute to the VPL / Internet Archive Canada kiosk, plus a category-scoped resource
          graph and ENME517 pathfinding policies.
        </p>
        <div className="mt-8 overflow-auto rounded-lg border border-line bg-surface p-4">
          <pre className="font-mono text-xs leading-6 text-ia">{`visitor → kiosk SPA
             ├─ catalog        semantic mosaic
             ├─ era rail       year occupancy filter
             ├─ Wayback CDX    year filmstrip + compare
             ├─ specialized trace  (resource-graph-crawler model)
             ├─ recommend      greedy / BFS / A*
             └─ tour / heat / lab`}</pre>
        </div>
        <h2 className="mt-10 font-display text-xl font-semibold">Applied on this kiosk</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li>Era rail — dim tiles that were not captured near that year.</li>
          <li>Occupancy heat — ENME517 density field over clusters.</li>
          <li>Guided tour — camera flies the recommend path, then opens the last stop.</li>
          <li>Minimap, visited rail, shareable #open/host/year.</li>
          <li>Compare two Wayback years side by side.</li>
        </ul>
        <h2 className="mt-10 font-display text-xl font-semibold">Sibling applications</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li>Websites of Switzerland — original Nextension / Swiss National Library lineage.</li>
          <li>Websites of a City — municipal archive kiosk.</li>
          <li>Classroom pack — era + tour as a digital-heritage lab.</li>
          <li>Library install kit — attract timeout, large type, arcade-pad map.</li>
          <li>Resource-graph studio — live crawler for one consented .ca seed.</li>
          <li>Occupancy lab — greedy / BFS / A* as a DoE visualizer.</li>
          <li>Indigenous web memory — community-reviewed cluster, not a scrape.</li>
          <li>Francophone mosaic — Québec / Acadie first, not an afterthought toggle.</li>
        </ul>
        <h2 className="mt-10 font-display text-xl font-semibold">Controls</h2>
        <table className="mt-3 w-full text-sm">
          <tbody>
            {[
              ["WASD / joystick", "Pan"],
              ["+/− / wheel", "Zoom"],
              ["Enter / green", "Open focus site"],
              ["Space / yellow", "Search / voice"],
              ["T", "Guided tour"],
              ["H", "Occupancy heat"],
              ["L", "Next exhibits lab"],
              ["Esc / red ×", "Close"],
              ["R / blue power", "Reset"],
            ].map(([k, v]) => (
              <tr key={k} className="border-b border-line">
                <td className="py-2 font-medium">{k}</td>
                <td className="py-2 text-muted">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-8">
          <Link to="/" className="text-finder underline">
            Back to the kiosk
          </Link>
        </p>
      </div>
    </main>
  );
}
