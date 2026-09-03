const WORLD = { w: 11000, h: 6800, tw: 168, th: 108 };
const CATS = {
  "local-news": { label: "Local news", color: "#dbe4f0", accent: "#1d4e89", hx: 0.48, hy: 0.38 },
  "national-news": { label: "National news", color: "#e8eef6", accent: "#12325c", hx: 0.62, hy: 0.32 },
  newswire: { label: "Newswire", color: "#c0392b", accent: "#7b1113", hx: 0.36, hy: 0.46 },
  magazines: { label: "Magazines", color: "#f4efe4", accent: "#8a5a2b", hx: 0.28, hy: 0.3 },
  "digital-agency": { label: "Agencies", color: "#12141c", accent: "#6c7cff", hx: 0.55, hy: 0.16 },
  "creative-studio": { label: "Studios", color: "#1a1024", accent: "#e85d04", hx: 0.7, hy: 0.14 },
  photography: { label: "Photography", color: "#111", accent: "#f2f2f2", hx: 0.42, hy: 0.78 },
  "seniors-care": { label: "Seniors", color: "#d7e8f7", accent: "#2b6cb0", hx: 0.18, hy: 0.62 },
  health: { label: "Health", color: "#e6f4ea", accent: "#2f6f4e", hx: 0.12, hy: 0.48 },
  "faith-youth": { label: "Faith & youth", color: "#f4f1e8", accent: "#c2410c", hx: 0.8, hy: 0.55 },
  education: { label: "Education", color: "#0f2744", accent: "#d4a017", hx: 0.78, hy: 0.28 },
  "civic-government": { label: "Civic", color: "#e11d2e", accent: "#fff", hx: 0.22, hy: 0.16 },
  "community-nonprofit": { label: "Community", color: "#eef6ff", accent: "#2563eb", hx: 0.32, hy: 0.64 },
  indigenous: { label: "Indigenous", color: "#1c1917", accent: "#eab308", hx: 0.1, hy: 0.28 },
  "arts-culture": { label: "Arts", color: "#2b1240", accent: "#f5d0fe", hx: 0.88, hy: 0.42 },
  sports: { label: "Sports", color: "#111827", accent: "#ef4444", hx: 0.88, hy: 0.7 },
  business: { label: "Business", color: "#0b1220", accent: "#38bdf8", hx: 0.64, hy: 0.68 },
  environment: { label: "Environment", color: "#052e16", accent: "#86efac", hx: 0.08, hy: 0.78 },
  "library-archive": { label: "Libraries", color: "#111827", accent: "#93c5fd", hx: 0.5, hy: 0.9 },
};
const ADJ = {
  "local-news": ["national-news", "newswire", "magazines"],
  "national-news": ["local-news", "newswire"],
  newswire: ["local-news", "national-news", "business"],
  magazines: ["local-news", "arts-culture"],
  "digital-agency": ["creative-studio", "business"],
  "creative-studio": ["digital-agency", "photography"],
  photography: ["creative-studio", "arts-culture"],
  "seniors-care": ["health", "community-nonprofit"],
  health: ["seniors-care", "education"],
  "faith-youth": ["community-nonprofit", "education"],
  education: ["library-archive", "faith-youth"],
  "civic-government": ["library-archive", "newswire"],
  "community-nonprofit": ["seniors-care", "faith-youth"],
  indigenous: ["arts-culture", "environment"],
  "arts-culture": ["photography", "education"],
  sports: ["local-news", "business"],
  business: ["digital-agency", "newswire"],
  environment: ["indigenous", "community-nonprofit"],
  "library-archive": ["education", "civic-government"],
};
const SEEDS = [
  ["nepean", "nepeanseniors.ca", "Nepean Seniors' Home Support", "Help for seniors who want to remain independent", "seniors-care", [2001, 2002, 2003, 2004, 2005, 2008]],
  ["buildjyn", "buildjyn.ca", "Jewish Youth Network", "Miriam and Larry Robbins Centre", "faith-youth", [2017, 2020, 2021, 2025]],
  ["mtltimes", "mtltimes.ca", "Montreal Times", "Montreal entertainment, news, and social life", "local-news", [2012, 2016, 2021, 2023]],
  ["newswirebc", "newswirebc.ca", "NewsWire BC", "News releases to media in BC and across Canada", "newswire", [2008, 2014, 2019, 2022]],
  ["newsrooms", "newsrooms.ca", "Newsrooms", "Canadian and world news desks", "newswire", [2006, 2011, 2018]],
  ["larevue", "larevue.qc.ca", "La Revue", "À la une", "magazines", [2004, 2010, 2017, 2021]],
  ["lamauricie", "lamauricie.qc.ca", "La Mauricie", "Mauricie en ligne", "local-news", [2005, 2012, 2019]],
  ["nubee", "nubee.ca", "nubee", "stratégie + web + design", "digital-agency", [2014, 2018, 2023]],
  ["tactic", "tacticcreative.ca", "Tactic Creative", "Find your audiences", "creative-studio", [2016, 2020, 2024]],
  ["paradigm", "paradigmgroup.ca", "Paradigm", "Power of radio", "digital-agency", [2011, 2017, 2022]],
  ["photos", "photos.ca", "Show My Photos", "Sell photos worldwide", "photography", [2002, 2007, 2013, 2019]],
  ["cbc", "cbc.ca", "CBC", "Canada's public broadcaster", "national-news", [1996, 2001, 2008, 2015, 2022]],
  ["canada", "canada.ca", "Government of Canada", "Services and information", "civic-government", [2013, 2017, 2021, 2025]],
  ["vpl", "vpl.ca", "Vancouver Public Library", "Inspiration, connection, community", "library-archive", [1997, 2006, 2014, 2024]],
  ["ubc", "ubc.ca", "UBC", "A place of mind", "education", [1996, 2004, 2012, 2020]],
  ["thetyee", "thetyee.ca", "The Tyee", "Independent BC news", "local-news", [2003, 2010, 2018, 2024]],
  ["hillel", "hillel.ca", "Hillel Canada", "Jewish student life", "faith-youth", [2006, 2014, 2021]],
  ["seniorsgc", "seniors.gc.ca", "Seniors Canada", "Programs for older Canadians", "seniors-care", [2002, 2008, 2014, 2020]],
];

function mulberry(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry(20260902);
function place(cat, n) {
  const h = CATS[cat];
  const ang = rand() * Math.PI * 2;
  const rad = Math.sqrt(rand());
  const x = Math.min(0.97, Math.max(0.03, h.hx + Math.cos(ang) * 0.09 * rad + (n % 7) * 0.004));
  const y = Math.min(0.97, Math.max(0.03, h.hy + Math.sin(ang) * 0.07 * rad));
  return { x: x * WORLD.w, y: y * WORLD.h };
}
const catalog = [];
SEEDS.forEach((s, i) => {
  const meta = CATS[s[4]];
  const p = place(s[4], i);
  catalog.push({ id: s[0], host: s[1], title: s[2], tagline: s[3], category: s[4], years: s[5], featured: true, ...p, color: meta.color, accent: meta.accent });
});
Object.keys(CATS).forEach((cat) => {
  for (let i = 0; i < 20; i++) {
    const meta = CATS[cat];
    const p = place(cat, 80 + i);
    catalog.push({
      id: `f-${cat}-${i}`,
      host: `${cat.slice(0, 6)}${i}.ca`,
      title: `${CATS[cat].label} ${i}`,
      tagline: "Archive chip",
      category: cat,
      years: [2001 + (i % 12), 2010, 2018],
      filler: true,
      ...p,
      color: meta.color,
      accent: meta.accent,
    });
  }
});

const state = {
  mode: "attract",
  cam: { x: WORLD.w * 0.5, y: WORLD.h * 0.42, z: 0.22 },
  target: { x: WORLD.w * 0.5, y: WORLD.h * 0.42, z: 0.22 },
  keys: {},
  hover: null,
  focus: null,
  policy: "auto",
  path: [],
  graph: null,
  visited: [],
  era: null,
};
const $ = (id) => document.getElementById(id);
const canvas = $("mosaic");
const ctx = canvas.getContext("2d", { alpha: false });

function resize() {
  const dpr = Math.min(2, devicePixelRatio || 1);
  canvas.width = Math.round(innerWidth * dpr);
  canvas.height = Math.round(innerHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
addEventListener("resize", resize);
resize();

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}
function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
function occupancy(cat) {
  const c = catalog.filter((s) => s.category === cat);
  if (c.length < 2) return 0.2;
  const xs = c.map((s) => s.x), ys = c.map((s) => s.y);
  const area = Math.max(1, (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys)));
  return clamp((c.length * WORLD.tw * WORLD.th) / area * 1.8, 0.05, 1);
}
function cost(a, b) {
  const spatial = dist(a, b) / 1400;
  const mismatch = a.category === b.category ? 0 : 1.15;
  return spatial + mismatch;
}
function pickPolicy(cat, req) {
  if (req !== "auto") return req;
  const o = occupancy(cat);
  if (o >= 0.65) return "greedy";
  if (o <= 0.25) return "astar";
  return "bfs";
}
function recommend(start) {
  const resolved = pickPolicy(start.category, state.policy);
  const unused = catalog.filter((s) => s.id !== start.id && !state.visited.includes(s.id));
  const path = [];
  const used = new Set([start.id]);
  if (resolved === "greedy") {
    let cur = start;
    for (let i = 0; i < 5; i++) {
      const pool = unused.filter((s) => !used.has(s.id));
      if (!pool.length) break;
      pool.sort((a, b) => cost(cur, a) - cost(cur, b));
      path.push(pool[0]);
      used.add(pool[0].id);
      cur = pool[0];
    }
  } else if (resolved === "astar") {
    const goal =
      unused
        .filter((s) => s.featured && s.category !== start.category)
        .sort((a, b) => cost(start, b) - cost(start, a))[0] || unused[0];
    let cur = start;
    for (let i = 0; i < 5; i++) {
      const pool = unused.filter((s) => !used.has(s.id));
      if (!pool.length) break;
      pool.sort((a, b) => cost(cur, a) + cost(a, goal) - (cost(cur, b) + cost(b, goal)));
      const next = pool[0];
      path.push(next);
      used.add(next.id);
      cur = next;
      if (next === goal) break;
    }
  } else {
    const q = [start];
    const seen = new Set([start.id]);
    while (q.length && path.length < 5) {
      const cur = q.shift();
      unused
        .filter((s) => !seen.has(s.id) && (s.category === cur.category || (ADJ[cur.category] || []).includes(s.category)))
        .sort((a, b) => (a.featured === b.featured ? cost(cur, a) - cost(cur, b) : a.featured ? -1 : 1))
        .slice(0, 6)
        .forEach((nb) => {
          if (path.length >= 5) return;
          seen.add(nb.id);
          q.push(nb);
          path.push(nb);
        });
    }
  }
  return { resolved, occupancy: occupancy(start.category), path };
}
function trace(site) {
  const pages = ["/", "/about", "/contact", "/news", "/css/main.css"];
  const nodes = pages.map((p, i) => ({ id: "n" + i, label: p === "/" ? site.host : p, kind: p.endsWith(".css") ? "asset" : "page" }));
  const neigh = catalog.filter((s) => s.featured && s.category === site.category && s.id !== site.id).slice(0, 4);
  neigh.forEach((s, i) => nodes.push({ id: "nb" + i, label: s.host, kind: "neighbor", site: s }));
  return { nodes, neigh, note: `Category-scoped BFS around ${site.host} (resource-graph-crawler model, cap ~12).` };
}

function fly(x, y, z) {
  state.target.x = clamp(x, 0, WORLD.w);
  state.target.y = clamp(y, 0, WORLD.h);
  state.target.z = clamp(z, 0.12, 3.4);
}
function start() {
  state.mode = "explore";
  $("attract").hidden = true;
  $("finder").hidden = false;
  $("searchChip").hidden = false;
  $("eraRail").hidden = false;
  $("labBtn").hidden = false;
  fly(WORLD.w * 0.48, WORLD.h * 0.4, 0.38);
}
function reset() {
  state.mode = "attract";
  state.focus = null;
  state.path = [];
  state.graph = null;
  $("attract").hidden = false;
  $("finder").hidden = true;
  $("searchChip").hidden = true;
  $("eraRail").hidden = true;
  $("labBtn").hidden = true;
  $("labModal").hidden = true;
  $("focusCap").hidden = true;
  $("viewer").hidden = true;
  $("searchModal").hidden = true;
  fly(WORLD.w * 0.5, WORLD.h * 0.42, 0.22);
}
function openSite(site) {
  state.mode = "site";
  state.focus = site;
  if (!state.visited.includes(site.id)) state.visited.push(site.id);
  fly(site.x, site.y, 1.65);
  $("viewer").hidden = false;
  renderViewer(site);
}
function closeSite() {
  state.mode = "explore";
  state.focus = null;
  state.graph = null;
  state.path = [];
  $("viewer").hidden = true;
  fly(state.target.x, state.target.y, Math.min(state.target.z, 1.1));
}
function previewHtml(site) {
  if (site.id === "nepean") {
    return `<div class="hp nepean">
      <header><strong>NEPEAN SENIORS' HOME SUPPORT</strong><span>3865 Richmond Road Nepean ON K2H 5C1</span></header>
      <div class="grid">
        <div class="logo"><div class="house"></div><em>'Help for seniors who want to remain independent'</em></div>
        <div class="nodes">${["About Us","Programs","Newsletter","Contact Us"].map((l)=>`<div><i></i><b>${l}</b></div>`).join("")}</div>
      </div>
    </div>`;
  }
  if (site.id === "buildjyn") {
    return `<div class="hp jyn"><div class="sky"><div class="bldg"></div><div class="tree a"></div><div class="tree b"></div></div><p>JEWISH YOUTH NETWORK</p></div>`;
  }
  if (site.id === "mtltimes") {
    return `<div class="hp times"><h2>Montreal Times</h2><p class="kicker">mtltimes.ca</p><div class="split"><div><div class="photo"></div><h3>Betty White dies at 99 years young</h3></div><div><div class="breaking">BREAKING</div><div class="ch">CH</div></div></div></div>`;
  }
  return `<div class="hp generic" style="--accent:${site.accent}"><h2>${site.title}</h2><p>${site.tagline}</p><p class="muted">Archived homepage snapshot. Tribute rebuild — not the 100,000-image corpus.</p></div>`;
}
function renderViewer(site) {
  const years = site.years;
  $("viewer").innerHTML = `
    <div class="bar">
      <strong>Wayback Machine</strong>
      <span>${site.host}</span>
      <span style="margin-left:auto">http://${site.host}/</span>
      <button type="button" id="closeView">✕</button>
    </div>
    ${previewHtml(site)}
    <div class="film">${years.map((y, i) => `<button type="button" class="${i===0?"on":""}" data-year="${y}">${y}</button>`).join("")}</div>
    <div class="actions">
      <button type="button" id="traceBtn">Trace</button>
      <button type="button" id="recBtn">Recommend</button>
      <button type="button" data-pol="auto">auto</button>
      <button type="button" data-pol="greedy">greedy</button>
      <button type="button" data-pol="bfs">bfs</button>
      <button type="button" data-pol="astar">astar</button>
      <a href="https://web.archive.org/web/${years[0]}0701000000/http://${site.host}/" target="_blank" rel="noreferrer">Open in Wayback</a>
    </div>
    <div id="extra"></div>`;
  $("closeView").onclick = closeSite;
  $("viewer").querySelectorAll("[data-pol]").forEach((b) => {
    b.onclick = () => {
      state.policy = b.dataset.pol;
      $("recBtn").click();
    };
  });
  $("traceBtn").onclick = () => {
    const g = trace(site);
    state.graph = g;
    $("extra").innerHTML = `<p>${g.note}</p><ul>${g.nodes.map((n) => `<li>${n.kind} · ${n.label}</li>`).join("")}</ul>`;
    toast(g.note);
  };
  $("recBtn").onclick = () => {
    const r = recommend(site);
    state.path = r.path;
    $("extra").innerHTML = `<p>${r.resolved} · occupancy ${r.occupancy.toFixed(2)}</p><ol>${r.path.map((s) => `<li><button type="button" data-id="${s.id}">${s.title}</button></li>`).join("")}</ol>`;
    $("extra").onclick = (e) => {
      const id = e.target.dataset?.id;
      if (id) openSite(catalog.find((s) => s.id === id));
    };
    toast(`${r.resolved} path · occupancy ${r.occupancy.toFixed(2)}`);
  };
}
function toast(t) {
  const el = $("toast");
  el.hidden = false;
  el.textContent = t;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    el.hidden = true;
  }, 3200);
}
function runQuery(raw) {
  const q = raw.trim().toLowerCase();
  $("searchModal").hidden = true;
  if (/reset/.test(q)) return reset();
  if (/trace/.test(q) && state.focus) return $("traceBtn")?.click();
  if (/recommend/.test(q) && state.focus) return $("recBtn")?.click();
  for (const [k, meta] of Object.entries(CATS)) {
    if (q.includes(meta.label.toLowerCase().split(" ")[0]) || q.includes(k.split("-")[0])) {
      const c = catalog.filter((s) => s.category === k);
      const cx = c.reduce((a, s) => a + s.x, 0) / c.length;
      const cy = c.reduce((a, s) => a + s.y, 0) / c.length;
      state.mode = "explore";
      $("viewer").hidden = true;
      $("attract").hidden = true;
      $("finder").hidden = false;
      $("searchChip").hidden = false;
      fly(cx, cy, 1.15);
      toast("Showing " + meta.label);
      return;
    }
  }
  const hit = catalog.find((s) => s.host.includes(q) || s.title.toLowerCase().includes(q) || s.id === q);
  if (hit) openSite(hit);
  else toast("No site matching “" + raw + "”");
}

$("startBtn").onclick = start;
$("resetBtn").onclick = reset;
$("searchChip").onclick = () => {
  $("searchModal").hidden = !$("searchModal").hidden;
  $("searchInput").focus();
};
$("openLab").onclick = () => {
  $("labModal").hidden = false;
};
$("closeLab").onclick = () => {
  $("labModal").hidden = true;
};
$("eraRail").onclick = (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  state.era = btn.dataset.era ? Number(btn.dataset.era) : null;
  [...$("eraRail").querySelectorAll("button")].forEach((b) => b.classList.toggle("on", b === btn));
  toast(state.era ? "Era " + state.era : "All years");
};
$("searchForm").onsubmit = (e) => {
  e.preventDefault();
  runQuery($("searchInput").value);
};
$("searchInput").oninput = () => {
  const q = $("searchInput").value.toLowerCase();
  const hits = catalog.filter((s) => s.featured && (s.title.toLowerCase().includes(q) || s.host.includes(q))).slice(0, 8);
  $("searchHits").innerHTML = hits.map((s) => `<li><button type="button" data-id="${s.id}">${s.title} · ${s.host}</button></li>`).join("");
};
$("searchHits").onclick = (e) => {
  const id = e.target.dataset?.id;
  if (id) openSite(catalog.find((s) => s.id === id));
};

addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT") return;
  state.keys[e.code] = true;
  if (e.code === "Enter") {
    if (state.mode === "attract") start();
    else if (state.hover) openSite(state.hover);
  }
  if (e.code === "Escape") closeSite();
  if (e.code === "KeyR") reset();
  if (e.code === "Space" || e.key === "/") {
    e.preventDefault();
    $("searchModal").hidden = false;
    $("searchInput").focus();
  }
});
addEventListener("keyup", (e) => {
  state.keys[e.code] = false;
});

let drag = null;
canvas.addEventListener("pointerdown", (e) => {
  if (state.mode === "attract") return;
  drag = { x: e.clientX, y: e.clientY, cx: state.cam.x, cy: state.cam.y };
});
canvas.addEventListener("pointermove", (e) => {
  if (drag) {
    fly(drag.cx - (e.clientX - drag.x) / state.cam.z, drag.cy - (e.clientY - drag.y) / state.cam.z, state.cam.z);
  }
});
canvas.addEventListener("pointerup", () => {
  drag = null;
});
canvas.addEventListener("dblclick", (e) => {
  if (state.mode === "attract") return start();
  const hit = hitAt(e.clientX, e.clientY);
  if (hit) openSite(hit);
});
canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  if (state.mode === "attract") return;
  fly(state.target.x, state.target.y, state.target.z * (e.deltaY > 0 ? 0.9 : 1.1));
}, { passive: false });

function hitAt(cx, cy) {
  const wx = state.cam.x + (cx - innerWidth / 2) / state.cam.z;
  const wy = state.cam.y + (cy - innerHeight / 2) / state.cam.z;
  return catalog.find((s) => Math.abs(s.x - wx) < WORLD.tw / 2 && Math.abs(s.y - wy) < WORLD.th / 2) || null;
}

function draw() {
  const w = innerWidth, h = innerHeight;
  const z = state.cam.z;
  const ox = w / 2 - state.cam.x * z;
  const oy = h / 2 - state.cam.y * z;
  ctx.fillStyle = "#07090d";
  ctx.fillRect(0, 0, w, h);
  const tw = WORLD.tw * z, th = WORLD.th * z;
  const lod = z < 0.35 ? 0 : 1;
  for (const s of catalog) {
    const x = s.x * z + ox - tw / 2;
    const y = s.y * z + oy - th / 2;
    if (x > w || y > h || x + tw < 0 || y + th < 0) continue;
    ctx.fillStyle = s.featured ? s.accent : s.color;
    ctx.globalAlpha = s.filler ? 0.75 : 1;
    if (state.era && !s.years.some((y) => Math.abs(y - state.era) <= 4)) ctx.globalAlpha = 0.16;
    ctx.fillRect(x, y, Math.max(1, tw * 0.92), Math.max(1, th * 0.92));
    ctx.globalAlpha = 1;
    if (lod && s.featured && tw > 70) {
      ctx.fillStyle = "#fff";
      ctx.font = "12px IBM Plex Sans, sans-serif";
      ctx.fillText(s.host, x + 6, y + th - 8, tw - 12);
    }
    if (state.hover === s || state.focus === s) {
      ctx.strokeStyle = "#3ddc84";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, tw, th);
    }
  }
  if (state.path.length && state.focus) {
    ctx.strokeStyle = "#f5d76e";
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    [state.focus, ...state.path].forEach((s, i) => {
      const x = s.x * z + ox, y = s.y * z + oy;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);
  }
  $("zoomHint").hidden = z >= 0.55 || state.mode === "attract";
}

let last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  let ax = 0, ay = 0, az = 0;
  if (state.keys.KeyA || state.keys.ArrowLeft) ax -= 1;
  if (state.keys.KeyD || state.keys.ArrowRight) ax += 1;
  if (state.keys.KeyW || state.keys.ArrowUp) ay -= 1;
  if (state.keys.KeyS || state.keys.ArrowDown) ay += 1;
  if (state.keys.Equal) az += 1;
  if (state.keys.Minus) az -= 1;
  const speed = (920 / Math.max(0.25, state.cam.z)) * dt;
  state.target.x = clamp(state.target.x + ax * speed, 0, WORLD.w);
  state.target.y = clamp(state.target.y + ay * speed, 0, WORLD.h);
  state.target.z = clamp(state.target.z * Math.pow(1.18, az * dt * 6), 0.12, 3.4);
  const t = 1 - Math.pow(0.001, dt);
  state.cam.x += (state.target.x - state.cam.x) * t * 1.8;
  state.cam.y += (state.target.y - state.cam.y) * t * 1.8;
  state.cam.z += (state.target.z - state.cam.z) * t * 2.2;
  const mid = { x: state.cam.x, y: state.cam.y };
  state.hover = catalog.find((s) => Math.abs(s.x - mid.x) < WORLD.tw / 2 && Math.abs(s.y - mid.y) < WORLD.th / 2) || null;
  const cap = $("focusCap");
  if (state.mode === "explore" && state.hover && state.cam.z > 0.7) {
    cap.hidden = false;
    cap.innerHTML = `<b>${state.hover.title}</b><span>${state.hover.host}</span>`;
  } else cap.hidden = true;
  draw();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

window.__controlsTest = {
  getYaw: () => state.cam.x,
  getSpeed: () => state.cam.z,
  setKeys: (codes) => {
    state.keys = {};
    codes.forEach((c) => (state.keys[c] = true));
  },
};
