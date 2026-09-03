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
             ├─ catalog.json  (semantic mosaic)
             ├─ Wayback CDX   (year filmstrip)
             ├─ specialized trace  (resource-graph-crawler model)
             └─ recommend  (greedy / BFS / A*)`}</pre>
        </div>
        <h2 className="mt-10 font-display text-xl font-semibold">Controls</h2>
        <table className="mt-3 w-full text-sm">
          <tbody>
            {[
              ["WASD / joystick", "Pan"],
              ["+/− / wheel", "Zoom"],
              ["Enter / green", "Open focus site"],
              ["Space / yellow", "Search / voice"],
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
