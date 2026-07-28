import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { drawWire } from "./wireframe";

/**
 * §3 SOLUÇÕES — pinned multi-step capability reveal (Vaulk's "System
 * capabilities"). The block pins; as you scroll, the left index advances, the
 * centre wireframe re-draws, the right content cross-fades, and a progress bar
 * fills in wine. Four steps: Elétrica → Automação → Instrumentação → Infra.
 */

const LABELS = [
  "ELÉTRICA — PAINÉIS & CCM",
  "AUTOMAÇÃO — PLC & INDÚSTRIA 4.0",
  "INSTRUMENTAÇÃO — REDES & CALIBRAÇÃO",
  "INFRAESTRUTURA — SPDA & NR-10/12",
];

export function initCapabilities(reduced: boolean): void {
  const section = document.getElementById("solucoes");
  const pin = section?.querySelector<HTMLElement>("[data-caps]");
  if (!section || !pin) return;

  const indexItems = gsap.utils.toArray<HTMLElement>("[data-caps-index] li");
  const panels = gsap.utils.toArray<HTMLElement>("[data-caps-panel]");
  const wires = gsap.utils.toArray<HTMLElement>(".caps__wire");
  const labelText = section.querySelector<HTMLElement>("[data-caps-labeltext]");
  const progress = section.querySelector<HTMLElement>("[data-caps-progress]");
  const total = panels.length;

  if (reduced) {
    section.classList.add("is-static");
    wires.forEach((w) => drawWire(w, true));
    return;
  }

  let current = -1;
  const show = (idx: number) => {
    if (idx === current) return;
    indexItems.forEach((li, i) => li.classList.toggle("is-active", i === idx));
    panels.forEach((p, i) => {
      const active = i === idx;
      p.classList.toggle("is-active", active);
      gsap.to(p, {
        autoAlpha: active ? 1 : 0,
        y: active ? 0 : 14,
        filter: active ? "blur(0px)" : "blur(6px)",
        duration: 0.45,
        ease: "power2.out",
      });
    });
    wires.forEach((w, i) => {
      if (i === idx) drawWire(w, false);
      else gsap.to(w, { autoAlpha: 0, duration: 0.3 });
    });
    if (labelText) labelText.textContent = LABELS[idx] || LABELS[0];
    current = idx;
  };

  show(0);

  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: `+=${total * 85}%`,
    pin,
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const idx = Math.min(total - 1, Math.floor(self.progress * total));
      show(idx);
      if (progress) gsap.set(progress, { scaleX: self.progress, transformOrigin: "left" });
    },
  });
}
