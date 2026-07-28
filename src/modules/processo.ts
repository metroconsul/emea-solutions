import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { drawWire } from "./wireframe";

/**
 * §4 PROCESSO — light timeline. Each step (media + numbered body) rises in as
 * it enters, and its wireframe draws over the placeholder image.
 */
export function initProcesso(reduced: boolean): void {
  const steps = gsap.utils.toArray<HTMLElement>("[data-proc-step]");
  if (!steps.length) return;

  steps.forEach((step) => {
    const wire = step.querySelector<HTMLElement>(".proc__wire");
    if (reduced) {
      if (wire) drawWire(wire, true);
      return;
    }
    const media = step.querySelector<HTMLElement>(".proc__media");
    const body = step.querySelector<HTMLElement>(".proc__body");
    gsap.set([media, body], { y: 36, opacity: 0 });

    ScrollTrigger.create({
      trigger: step,
      start: "top 78%",
      once: true,
      onEnter: () => {
        gsap.to([media, body], {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.12,
        });
        if (media) {
          gsap.fromTo(
            media.querySelector("img, .is-ph"),
            { clipPath: "inset(100% 0 0 0)" },
            { clipPath: "inset(0% 0 0 0)", duration: 1, ease: "power3.out" }
          );
        }
        if (wire) drawWire(wire, false);
      },
    });
  });
}
