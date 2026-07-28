import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { drawWire } from "./wireframe";

/**
 * §5 SETORES — numbered use-case matrix (Vaulk's "use cases"). The card pins;
 * scrolling advances 001→006, the active matrix tab underlines in wine, and the
 * card title/copy cross-fade while the wireframe re-draws.
 */

const NAMES = [
  "Aeronáutico & aeroespacial",
  "Energia & utilidades",
  "Químico & petroquímico",
  "Alimentício & bebidas",
  "Automotivo",
  "Manufatura & metalmecânica",
];
const COPIES = [
  "Ambientes de manufatura de alta precisão, com tolerância zero a falhas e forte exigência normativa.",
  "Distribuição, força e continuidade operacional crítica em plantas que não podem parar.",
  "Instalações em áreas classificadas e processos com requisitos de segurança elevados.",
  "Linhas de processo com automação, higiene e alta disponibilidade.",
  "Linhas de produção automatizadas e modernização de processos produtivos.",
  "Força, comando e controle para o chão de fábrica e equipamentos pesados.",
];

export function initSetores(reduced: boolean): void {
  const section = document.getElementById("setores");
  const pin = section?.querySelector<HTMLElement>("[data-setor-pin]");
  if (!section || !pin) return;

  const tabs = gsap.utils.toArray<HTMLElement>("[data-setor-tab]");
  const label = section.querySelector<HTMLElement>("[data-setor-label]");
  const titleEl = section.querySelector<HTMLElement>("[data-setor-title]");
  const copyEl = section.querySelector<HTMLElement>("[data-setor-copy]");
  const wire = section.querySelector<HTMLElement>(".sect__wire");
  const total = NAMES.length;
  const pad = (n: number) => String(n).padStart(3, "0");

  let current = -1;
  const show = (idx: number) => {
    if (idx === current) return;
    tabs.forEach((t, i) => t.classList.toggle("is-active", i === idx));
    if (label) label.textContent = `SETOR DE ATUAÇÃO_ ${pad(idx + 1)}/${pad(total)}`;
    // swap text immediately (stays in sync with the index under fast scrub),
    // then fade the new content in
    if (titleEl) titleEl.textContent = NAMES[idx];
    if (copyEl) copyEl.textContent = COPIES[idx];
    const els = [titleEl, copyEl].filter(Boolean) as HTMLElement[];
    if (!reduced && current !== -1) {
      gsap.killTweensOf(els);
      gsap.fromTo(
        els,
        { autoAlpha: 0, y: 16, filter: "blur(6px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.45, ease: "power2.out" }
      );
    }
    if (wire) drawWire(wire, reduced);
    current = idx;
  };

  show(0);
  if (reduced) return;

  ScrollTrigger.create({
    trigger: pin,
    start: "top top",
    end: `+=${total * 60}%`,
    pin,
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const idx = Math.min(total - 1, Math.floor(self.progress * total));
      show(idx);
    },
  });
}
