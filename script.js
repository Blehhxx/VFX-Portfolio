// ============================================================
// CONFIG — edit these to personalize the site
// ============================================================

const NODES = [
  { id:"reel",     label:"Showreel",  sub:"watch the reel →", x:130, y:150, color:"var(--accent-green)", target:"#reel", fixed:true },
  { id:"projects", label:"Projects",  sub:"see the work →",   x:130, y:390, color:"var(--accent-green)", target:"#projects", fixed:true },
  { id:"about",    label:"About",     sub:"who I am →",       x:490, y:270, color:"var(--accent-coral)", target:"#about", fixed:true },
  { id:"contact",  label:"Contact",   sub:"say hello →",      x:850, y:270, color:"var(--accent-cyan)",  target:"#contact", fixed:true },
];

const EDGES = [
  ["reel","about"], ["projects","about"], ["about","contact"],
];

// tools available in the "scribble your own" playground — purely decorative,
// not linked to any section. Add/remove/recolor freely.
const TOOLS = [
  { type:"blur",      label:"Blur",      color:"var(--accent-purple)" },
  { type:"grade",     label:"Grade",     color:"var(--accent-orange)" },
  { type:"grain",     label:"Grain",     color:"var(--accent-coral)" },
  { type:"keyer",     label:"Keyer",     color:"var(--accent-cyan)" },
  { type:"transform", label:"Transform", color:"var(--accent-yellow)" },
  { type:"merge",     label:"Merge",     color:"var(--accent-green)" },
];

// where playground emails/downloads should go — update this to your own address
const OWNER_EMAIL = "you@example.com";

const PROJECTS = [
  { name:"Project One",   role:"Comp Artist · Studio Name · 2025", desc:"Short description of the shot work: environment extension, wire removal, CG integration — whatever applies.", tags:["Nuke","3D integration"] },
  { name:"Project Two",   role:"Lead Compositor · Studio Name · 2024", desc:"Description of your contribution: sequence breakdown, look development, or crowd/FX comp.", tags:["Nuke","Deep Comp"] },
  { name:"Project Three", role:"Comp Artist · Studio Name · 2024", desc:"Description of the shot: face replacement, set extension, or matte painting integration.", tags:["Mocha","Roto"] },
  { name:"Project Four",  role:"Comp Artist · Studio Name · 2023", desc:"Description of the work — beauty comp, cleanup, grade pass.", tags:["Nuke","Grain Match"] },
  { name:"Project Five",  role:"Compositor · Studio Name · 2023", desc:"Description of the shot's technical challenge and how it was solved.", tags:["NukeX","Camera Projection"] },
  { name:"Project Six",   role:"Comp Artist · Studio Name · 2022", desc:"Description of the work on this title.", tags:["Silhouette","Paint"] },
];

// ============================================================
// NODE GRAPH — fixed nav nodes + draggable/deletable scratch nodes,
// all rewireable by dragging port-to-port.
// ============================================================
const svgNS = "http://www.w3.org/2000/svg";
let liveEdges = EDGES.map(e => [...e]);
let scratchNodes = [];
let scratchCounter = 0;
let playgroundOpen = false;
const NODE_W = 168, NODE_H = 58, BAR_H = 6;

function allNodes(){ return [...NODES, ...scratchNodes]; }
function nodeById(id){ return allNodes().find(n => n.id === id); }

function portOut(n){ return { x: n.x + NODE_W, y: n.y + NODE_H/2 }; }
function portIn(n){ return { x: n.x, y: n.y + NODE_H/2 }; }

function bezierPath(a, b){
  const dx = Math.max(60, Math.abs(b.x - a.x) * 0.5);
  const dir = b.x >= a.x ? 1 : -1;
  return `M ${a.x} ${a.y} C ${a.x + dx*dir} ${a.y}, ${b.x - dx*dir} ${b.y}, ${b.x} ${b.y}`;
}

function renderGraph(){
  const nodesLayer = document.getElementById("nodes");
  const edgesLayer = document.getElementById("edges");
  nodesLayer.innerHTML = "";
  edgesLayer.innerHTML = "";

  liveEdges.forEach(([fromId, toId]) => {
    const from = nodeById(fromId), to = nodeById(toId);
    if (!from || !to) return;
    const d = bezierPath(portOut(from), portIn(to));

    const hit = document.createElementNS(svgNS, "path");
    hit.setAttribute("d", d);
    hit.setAttribute("class", "edge__hit");
    hit.dataset.related = `${fromId} ${toId}`;
    hit.addEventListener("click", () => {
      liveEdges = liveEdges.filter(([f,t]) => !(f===fromId && t===toId));
      renderGraph();
    });
    edgesLayer.appendChild(hit);

    const edge = document.createElementNS(svgNS, "path");
    edge.setAttribute("d", d);
    edge.setAttribute("class", "edge");
    edge.dataset.related = `${fromId} ${toId}`;
    edgesLayer.appendChild(edge);

    const pulse = document.createElementNS(svgNS, "path");
    pulse.setAttribute("d", d);
    pulse.setAttribute("class", "edge__pulse");
    pulse.dataset.related = `${fromId} ${toId}`;
    edgesLayer.appendChild(pulse);
  });

  allNodes().forEach(n => buildNode(n, nodesLayer));
}

function buildNode(n, nodesLayer){
  const g = document.createElementNS(svgNS, "g");
  g.setAttribute("class", n.fixed ? "node" : "node node--scratch");
  g.dataset.node = n.id;

  const body = document.createElementNS(svgNS, "rect");
  body.setAttribute("x", n.x); body.setAttribute("y", n.y);
  body.setAttribute("width", NODE_W); body.setAttribute("height", NODE_H);
  body.setAttribute("rx", 3);
  body.setAttribute("class", "node__body");
  g.appendChild(body);

  const bar = document.createElementNS(svgNS, "rect");
  bar.setAttribute("x", n.x); bar.setAttribute("y", n.y);
  bar.setAttribute("width", NODE_W); bar.setAttribute("height", BAR_H);
  bar.setAttribute("rx", 2);
  bar.setAttribute("class", "node__bar");
  bar.setAttribute("fill", n.color);
  g.appendChild(bar);

  const label = document.createElementNS(svgNS, "text");
  label.setAttribute("x", n.x + 14); label.setAttribute("y", n.y + 30);
  label.setAttribute("class", "node__label");
  label.textContent = n.label;
  g.appendChild(label);

  const sub = document.createElementNS(svgNS, "text");
  sub.setAttribute("x", n.x + 14); sub.setAttribute("y", n.y + 46);
  sub.setAttribute("class", "node__sub");
  sub.textContent = n.sub;
  g.appendChild(sub);

  if (n.fixed) {
    g.setAttribute("tabindex", "0");
    g.setAttribute("role", "link");
    g.setAttribute("aria-label", `Go to ${n.label} section`);

    const badge = document.createElementNS(svgNS, "circle");
    badge.setAttribute("cx", n.x + NODE_W - 16);
    badge.setAttribute("cy", n.y + NODE_H/2);
    badge.setAttribute("r", 11);
    badge.setAttribute("class", "node__badge");
    g.appendChild(badge);

    const chevron = document.createElementNS(svgNS, "path");
    const cx = n.x + NODE_W - 16, cy = n.y + NODE_H/2;
    chevron.setAttribute("d", `M ${cx-3} ${cy-5} L ${cx+4} ${cy} L ${cx-3} ${cy+5}`);
    chevron.setAttribute("class", "node__chevron");
    g.appendChild(chevron);

    function activate(){
      const el = document.querySelector(n.target);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    g.addEventListener("click", activate);
    g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); } });
  } else {
    // scratch node: draggable body, deletable
    body.addEventListener("pointerdown", e => startNodeMove(e, n));

    const delX = n.x + NODE_W - 16, delY = n.y + NODE_H/2;
    const delBg = document.createElementNS(svgNS, "circle");
    delBg.setAttribute("cx", delX); delBg.setAttribute("cy", delY); delBg.setAttribute("r", 11);
    delBg.setAttribute("class", "node__delete-bg");
    const delX1 = document.createElementNS(svgNS, "path");
    delX1.setAttribute("d", `M ${delX-4} ${delY-4} L ${delX+4} ${delY+4} M ${delX-4} ${delY+4} L ${delX+4} ${delY-4}`);
    delX1.setAttribute("class", "node__delete-x");
    const delGroup = document.createElementNS(svgNS, "g");
    delGroup.setAttribute("class", "node__delete");
    delGroup.appendChild(delBg);
    delGroup.appendChild(delX1);
    delGroup.addEventListener("click", () => {
      scratchNodes = scratchNodes.filter(sn => sn.id !== n.id);
      liveEdges = liveEdges.filter(([f,t]) => f!==n.id && t!==n.id);
      renderGraph();
    });
    g.appendChild(delGroup);
  }

  g.addEventListener("mouseenter", () => highlightEdges(n.id, true));
  g.addEventListener("mouseleave", () => highlightEdges(n.id, false));
  g.addEventListener("focus", () => highlightEdges(n.id, true));
  g.addEventListener("blur", () => highlightEdges(n.id, false));

  nodesLayer.appendChild(g);

  const outDot = makePort(portOut(n), "out", n.id);
  const inDot = makePort(portIn(n), "in", n.id);
  nodesLayer.appendChild(outDot);
  nodesLayer.appendChild(inDot);
}

function makePort(p, kind, nodeId){
  const dot = document.createElementNS(svgNS, "circle");
  dot.setAttribute("cx", p.x); dot.setAttribute("cy", p.y); dot.setAttribute("r", 5);
  dot.setAttribute("class", `port port--${kind}`);
  dot.dataset.node = nodeId;
  dot.dataset.kind = kind;
  if (kind === "out") {
    dot.addEventListener("pointerdown", startWireDrag);
  }
  return dot;
}

function toSvgPoint(svg, evt){
  const pt = svg.createSVGPoint();
  pt.x = evt.clientX; pt.y = evt.clientY;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}

let dragTemp = null;
function startWireDrag(evt){
  evt.stopPropagation();
  evt.preventDefault();
  const svg = document.getElementById("graphSvg");
  const edgesLayer = document.getElementById("edges");
  const fromId = evt.target.dataset.node;
  const from = nodeById(fromId);
  const start = portOut(from);

  dragTemp = document.createElementNS(svgNS, "path");
  dragTemp.setAttribute("class", "edge__drag");
  edgesLayer.appendChild(dragTemp);
  svg.classList.add("is-wiring");

  function onMove(e){
    const p = toSvgPoint(svg, e);
    dragTemp.setAttribute("d", bezierPath(start, p));
  }
  function onUp(e){
    const p = toSvgPoint(svg, e);
    let target = null, best = 20;
    allNodes().forEach(n => {
      if (n.id === fromId) return;
      const inPt = portIn(n);
      const d = Math.hypot(inPt.x - p.x, inPt.y - p.y);
      if (d < best) { best = d; target = n.id; }
    });
    if (target && !liveEdges.some(([f,t]) => f===fromId && t===target)) {
      liveEdges.push([fromId, target]);
    }
    dragTemp.remove();
    dragTemp = null;
    svg.classList.remove("is-wiring");
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    renderGraph();
  }
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp, { once:true });
}

function startNodeMove(evt, n){
  evt.stopPropagation();
  evt.preventDefault();
  const svg = document.getElementById("graphSvg");
  const start = toSvgPoint(svg, evt);
  const origX = n.x, origY = n.y;
  let moved = false;

  function onMove(e){
    const p = toSvgPoint(svg, e);
    n.x = origX + (p.x - start.x);
    n.y = origY + (p.y - start.y);
    moved = true;
    renderGraph();
  }
  function onUp(){
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
  }
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp, { once:true });
}

function highlightEdges(nodeId, on){
  document.querySelectorAll(".edge__pulse").forEach(p => {
    if (p.dataset.related.includes(nodeId)) p.style.opacity = on ? "1" : "0";
  });
}

document.getElementById("resetGraph").addEventListener("click", () => {
  liveEdges = EDGES.map(e => [...e]);
  renderGraph();
});

renderGraph();

// ============================================================
// PLAYGROUND — toolbox of scratch nodes + save/send flow
// ============================================================
const graphSvg = document.getElementById("graphSvg");
const toolbox = document.getElementById("toolbox");
const graphHint = document.getElementById("graphHint");
const toolboxChips = document.getElementById("toolboxChips");

TOOLS.forEach(tool => {
  const chip = document.createElement("button");
  chip.type = "button";
  chip.className = "tool-chip";
  chip.innerHTML = `<span class="tool-chip__dot" style="background:${tool.color}"></span>${tool.label}`;
  chip.addEventListener("click", () => spawnTool(tool));
  toolboxChips.appendChild(chip);
});

function spawnTool(tool){
  if (scratchNodes.length >= 10) return; // keep the canvas readable
  const count = scratchNodes.length;
  const col = count % 4, row = Math.floor(count / 4);
  const id = `scratch_${tool.type}_${++scratchCounter}`;
  scratchNodes.push({
    id, label: tool.label, sub: `#${scratchCounter}`,
    x: 60 + col * 230, y: 470 + row * 90,
    color: tool.color, fixed:false,
  });
  renderGraph();
}

function enterPlayground(){
  playgroundOpen = true;
  toolbox.hidden = false;
  document.getElementById("playgroundToggle").hidden = true;
  document.getElementById("resetGraph").hidden = true;
  graphSvg.setAttribute("viewBox", "0 0 1040 760");
  graphHint.textContent = "drop tools below, wire them up, then hit Done";
}

function exitPlayground(){
  playgroundOpen = false;
  toolbox.hidden = true;
  document.getElementById("playgroundToggle").hidden = false;
  document.getElementById("resetGraph").hidden = false;
  graphSvg.setAttribute("viewBox", "0 0 1040 560");
  graphHint.textContent = "drag a node's right dot onto another's left dot to rewire · click a wire to remove it";
  scratchNodes = [];
  scratchCounter = 0;
  liveEdges = liveEdges.filter(([f,t]) => nodeById(f)?.fixed && nodeById(t)?.fixed);
  renderGraph();
}

document.getElementById("playgroundToggle").addEventListener("click", enterPlayground);

document.getElementById("playgroundDone").addEventListener("click", () => {
  if (scratchNodes.length === 0) { exitPlayground(); return; }
  openExportModal();
});

// ---- export modal ----
const playgroundModal = document.getElementById("playgroundModal");
const exportNote = document.getElementById("exportNote");

function openExportModal(){
  exportNote.textContent = "";
  playgroundModal.classList.add("is-open");
  playgroundModal.setAttribute("aria-hidden", "false");
}
function closeExportModalOnly(){
  playgroundModal.classList.remove("is-open");
  playgroundModal.setAttribute("aria-hidden", "true");
}
playgroundModal.querySelectorAll("[data-close-playground]").forEach(el =>
  el.addEventListener("click", closeExportModalOnly)
);

function scratchSummary(){
  const relevant = liveEdges.filter(([f,t]) => !nodeById(f)?.fixed || !nodeById(t)?.fixed || scratchNodes.some(n=>n.id===f||n.id===t));
  const connections = liveEdges
    .filter(([f,t]) => scratchNodes.some(n => n.id===f) || scratchNodes.some(n => n.id===t))
    .map(([f,t]) => `${nodeById(f)?.label ?? f} → ${nodeById(t)?.label ?? t}`);
  return {
    nodes: scratchNodes.map(n => ({ type:n.label, id:n.id })),
    connections,
  };
}

document.getElementById("exportSave").addEventListener("click", () => {
  const summary = scratchSummary();
  const payload = { exportedAt: new Date().toISOString(), ...summary };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "my-comp-graph.json";
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
  exportNote.textContent = "Downloaded my-comp-graph.json ✓";
  setTimeout(() => { closeExportModalOnly(); exitPlayground(); }, 900);
});

document.getElementById("exportSend").addEventListener("click", () => {
  const summary = scratchSummary();
  const lines = [
    "Hi,", "",
    "I played with the node graph on your portfolio and made this:", "",
    `Tools used: ${summary.nodes.map(n => n.type).join(", ") || "none"}`,
    "Connections:",
    ...(summary.connections.length ? summary.connections.map(c => `- ${c}`) : ["- none"]),
    "", "(sent from the portfolio's scribble playground)",
  ];
  const subject = encodeURIComponent("My node graph from your portfolio");
  const body = encodeURIComponent(lines.join("\n"));
  window.location.href = `mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`;
  exportNote.textContent = "Opening your email client…";
  setTimeout(() => { closeExportModalOnly(); exitPlayground(); }, 900);
});

document.getElementById("exportDiscard").addEventListener("click", () => {
  closeExportModalOnly();
  exitPlayground();
});

// ============================================================
// PROJECT GRID
// ============================================================
(function buildProjects(){
  const grid = document.getElementById("projectGrid");
  const gradients = [
    "linear-gradient(135deg,#3a4a3a,#26262b)",
    "linear-gradient(135deg,#4a3a3f,#26262b)",
    "linear-gradient(135deg,#3a3f4a,#26262b)",
    "linear-gradient(135deg,#4a4536,#26262b)",
    "linear-gradient(135deg,#3a4448,#26262b)",
    "linear-gradient(135deg,#463a4a,#26262b)",
  ];

  PROJECTS.forEach((p, i) => {
    const card = document.createElement("button");
    card.className = "project-card";
    card.innerHTML = `
      <div class="project-card__thumb" style="background:${gradients[i % gradients.length]}">SHOT_${String(i+1).padStart(2,"0")}</div>
      <div class="project-card__body">
        <span class="project-card__index">0${i+1} /</span>
        <h3 class="project-card__name">${p.name}</h3>
        <p class="project-card__role">${p.role}</p>
      </div>`;
    card.addEventListener("click", () => openModal(p, gradients[i % gradients.length]));
    grid.appendChild(card);
  });
})();

// ============================================================
// MODAL
// ============================================================
const modal = document.getElementById("projectModal");
function openModal(p, gradient){
  document.getElementById("modalTitle").textContent = p.name.replace(/\s+/g,"_");
  document.getElementById("modalThumb").style.background = gradient;
  document.getElementById("modalName").textContent = p.name;
  document.getElementById("modalRole").textContent = p.role;
  document.getElementById("modalDesc").textContent = p.desc;
  document.getElementById("modalTags").innerHTML = p.tags.map(t => `<span>${t}</span>`).join("");
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}
function closeModal(){
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}
modal.querySelectorAll("[data-close]").forEach(el => el.addEventListener("click", closeModal));
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

// ============================================================
// MISC UI
// ============================================================
document.getElementById("year").textContent = new Date().getFullYear();

const menuToggle = document.getElementById("menuToggle");
const appNav = document.querySelector(".app-bar__nav");
menuToggle.addEventListener("click", () => {
  const open = appNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
document.querySelectorAll(".app-bar__nav a").forEach(a => a.addEventListener("click", () => {
  appNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

const playBtn = document.getElementById("playBtn");
const video = document.getElementById("reelVideo");
playBtn.addEventListener("click", () => {
  if (!video.src && !video.querySelector("source").src) return; // no reel loaded yet
  if (video.paused) { video.play(); } else { video.pause(); }
});
