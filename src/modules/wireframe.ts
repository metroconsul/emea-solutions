import { gsap } from "gsap";

/**
 * Procedural technical line-drawings (echoing Vaulk's wireframe shelter). Each
 * `[data-wire="type"]` container is filled with an SVG of thin strokes that can
 * "draw in" via stroke-dashoffset. Re-skinned to electrical/industrial motifs.
 */

const SVGNS = "http://www.w3.org/2000/svg";
const VB_W = 800;
const VB_H = 500;

type Shape = { tag: string; attrs: Record<string, string | number> };

function rect(x: number, y: number, w: number, h: number): Shape {
  return { tag: "rect", attrs: { x, y, width: w, height: h } };
}
function line(x1: number, y1: number, x2: number, y2: number): Shape {
  return { tag: "line", attrs: { x1, y1, x2, y2 } };
}
function poly(points: string): Shape {
  return { tag: "polyline", attrs: { points } };
}
function circle(cx: number, cy: number, r: number): Shape {
  return { tag: "circle", attrs: { cx, cy, r } };
}

/** A bank of switchgear / CCM cabinets in light perspective. */
function eletrica(): Shape[] {
  const s: Shape[] = [];
  const baseY = 430;
  const topY = 120;
  // floor + busbar runway
  s.push(line(40, baseY, 760, baseY));
  s.push(line(120, topY - 26, 720, topY - 26)); // overhead busbar
  let x = 90;
  for (let i = 0; i < 5; i++) {
    const w = 116;
    s.push(rect(x, topY, w, baseY - topY)); // cabinet
    s.push(line(x, topY + 40, x + w, topY + 40)); // top vent
    // door split
    s.push(line(x + w / 2, topY + 40, x + w / 2, baseY));
    // breaker rows
    for (let r = 0; r < 4; r++) {
      const yy = topY + 80 + r * 56;
      s.push(rect(x + 14, yy, w / 2 - 24, 30));
      s.push(rect(x + w / 2 + 10, yy, w / 2 - 24, 30));
    }
    // handles
    s.push(circle(x + w / 2 - 8, baseY - 40, 5));
    s.push(circle(x + w / 2 + 8, baseY - 40, 5));
    // riser to busbar
    s.push(line(x + w / 2, topY, x + w / 2, topY - 26));
    x += w + 8;
  }
  return s;
}

/** PLC / automation cabinet: DIN rails + modules + comms. */
function automacao(): Shape[] {
  const s: Shape[] = [];
  s.push(rect(200, 90, 400, 330)); // cabinet
  for (let r = 0; r < 4; r++) {
    const y = 130 + r * 70;
    s.push(line(220, y, 580, y)); // DIN rail
    let x = 230;
    const count = 5 + (r % 2);
    for (let i = 0; i < count; i++) {
      const w = 30 + (i % 3) * 14;
      s.push(rect(x, y - 26, w, 24));
      s.push(line(x + w / 2, y - 26, x + w / 2, y - 36)); // terminal
      x += w + 10;
    }
  }
  // network bus + nodes
  s.push(line(120, 450, 680, 450));
  for (let i = 0; i < 6; i++) {
    s.push(circle(160 + i * 90, 450, 6));
    s.push(line(160 + i * 90, 444, 160 + i * 90, 420));
  }
  s.push(line(400, 420, 400, 420));
  return s;
}

/** Instrumentation: vessel + transmitters + signal lines. */
function instrumentacao(): Shape[] {
  const s: Shape[] = [];
  // process pipe run
  s.push(line(60, 250, 740, 250));
  s.push(line(60, 280, 740, 280));
  // vessel
  s.push(rect(330, 150, 140, 230));
  s.push(poly("330,150 400,110 470,150"));
  // transmitters tapped off the line
  const taps = [160, 260, 540, 640];
  taps.forEach((x, i) => {
    s.push(line(x, 250, x, 180));
    s.push(circle(x, 165, 16)); // gauge
    s.push(line(x - 16, 165, x + 16, 165));
    s.push(line(x, 149, x, 165));
    // signal to junction
    s.push(poly(`${x},165 ${x},90 ${i % 2 ? 470 : 330},90`));
  });
  s.push(rect(360, 60, 80, 30)); // junction box
  return s;
}

/** Infra / SPDA: mast, down-conductors, grounding grid, cable trays. */
function infra(): Shape[] {
  const s: Shape[] = [];
  // air terminal mast
  s.push(line(400, 70, 400, 150));
  s.push(poly("388,150 400,120 412,150"));
  // building outline
  s.push(rect(180, 150, 440, 200));
  // down conductors
  s.push(line(180, 150, 180, 410));
  s.push(line(620, 150, 620, 410));
  s.push(line(400, 150, 400, 350));
  // grounding ring + rods
  s.push(line(120, 410, 700, 410));
  for (let i = 0; i < 7; i++) {
    const x = 150 + i * 90;
    s.push(line(x, 410, x, 450));
    s.push(line(x - 8, 450, x + 8, 450));
  }
  // cable trays inside
  s.push(line(210, 220, 590, 220));
  s.push(line(210, 260, 590, 260));
  for (let i = 0; i < 10; i++) s.push(line(210 + i * 40, 220, 210 + i * 40, 260));
  return s;
}

/** Generic plant elevation (break / setor). */
function planta(): Shape[] {
  const s: Shape[] = [];
  s.push(line(0, 400, 800, 400));
  // silhouetted plant blocks
  const blocks = [
    [60, 240, 140, 160],
    [220, 180, 120, 220],
    [360, 280, 90, 120],
    [470, 150, 160, 250],
    [650, 300, 110, 100],
  ];
  blocks.forEach(([x, y, w, h]) => {
    s.push(rect(x, y, w, h));
    for (let i = 1; i * 30 < w; i++) s.push(line(x + i * 30, y, x + i * 30, y + h));
  });
  // stack + conduit
  s.push(line(560, 150, 560, 70));
  s.push(rect(548, 50, 24, 24));
  // overhead line
  s.push(poly("0,120 200,140 400,110 600,135 800,115"));
  return s;
}

function simpleStep(seed: number): Shape[] {
  const s: Shape[] = [];
  s.push(rect(120, 120, 560, 260));
  for (let i = 0; i < 5; i++) s.push(line(120, 160 + i * 44, 680, 160 + i * 44));
  for (let i = 0; i < 6; i++) s.push(line(180 + i * 90, 120, 180 + i * 90, 380));
  s.push(circle(400, 250, 60 - seed * 4));
  s.push(line(120, 410, 680, 410));
  return s;
}

const BUILDERS: Record<string, () => Shape[]> = {
  eletrica,
  automacao,
  instrumentacao,
  infra,
  planta,
  setor: planta,
  diagnostico: () => simpleStep(0),
  projeto: () => simpleStep(1),
  montagem: () => simpleStep(2),
  comissionamento: () => simpleStep(3),
};

function buildSvg(type: string): SVGSVGElement {
  const svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${VB_W} ${VB_H}`);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.setAttribute("fill", "none");
  const shapes = (BUILDERS[type] || planta)();
  for (const sh of shapes) {
    const node = document.createElementNS(SVGNS, sh.tag);
    for (const [k, v] of Object.entries(sh.attrs)) node.setAttribute(k, String(v));
    node.setAttribute("stroke", "currentColor");
    node.setAttribute("stroke-width", "1.4");
    node.setAttribute("vector-effect", "non-scaling-stroke");
    node.setAttribute("class", "wf");
    svg.appendChild(node);
  }
  return svg;
}

/** Fill every [data-wire] holder once. */
export function initWireframes(): void {
  document.querySelectorAll<HTMLElement>("[data-wire]").forEach((holder) => {
    if (holder.querySelector("svg")) return;
    holder.appendChild(buildSvg(holder.dataset.wire || "planta"));
  });
}

/** Draw-in animation: arm dashes then sweep them to 0. */
export function drawWire(holder: HTMLElement, reduced: boolean): void {
  const shapes = holder.querySelectorAll<SVGGeometryElement>(".wf");
  if (!shapes.length) return;
  if (reduced) {
    gsap.set(holder, { autoAlpha: 1 });
    shapes.forEach((sh) => sh.style.removeProperty("stroke-dashoffset"));
    return;
  }
  shapes.forEach((sh) => {
    let len = 0;
    try {
      len = sh.getTotalLength();
    } catch {
      len = 400;
    }
    gsap.set(sh, { strokeDasharray: len, strokeDashoffset: len });
  });
  gsap.set(holder, { autoAlpha: 1 });
  gsap.to(shapes, {
    strokeDashoffset: 0,
    duration: 1.1,
    ease: "power2.out",
    stagger: { each: 0.012, from: "random" },
    overwrite: true,
  });
}
