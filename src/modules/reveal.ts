import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/** Heading line reveals + batch fade-ins + KPI counters. */
export function setupReveals(reduced: boolean): void {
  if (reduced) return;

  gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
    const split = new SplitText(el, { type: "lines", mask: "lines" });
    gsap.set(el, { visibility: "visible" });
    gsap.from(split.lines, {
      yPercent: 115,
      duration: 1,
      ease: "power3.out",
      stagger: 0.12,
      scrollTrigger: { trigger: el, start: "top 86%" },
    });
  });

  gsap.set("[data-reveal-batch]", { y: 30, filter: "blur(8px)" });
  ScrollTrigger.batch("[data-reveal-batch]", {
    start: "top 90%",
    onEnter: (els) =>
      gsap.to(els, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        overwrite: true,
      }),
  });
}

export function initCounters(reduced: boolean): void {
  gsap.utils.toArray<HTMLElement>("[data-kpi]").forEach((kpi) => {
    const numEl = kpi.querySelector<HTMLElement>("[data-count]");
    if (!numEl) return;
    const target = Number(numEl.dataset.count || "0");
    if (reduced) {
      numEl.textContent = String(target);
      return;
    }
    const counter = { v: 0 };
    ScrollTrigger.create({
      trigger: kpi,
      start: "top 85%",
      once: true,
      onEnter: () =>
        gsap.to(counter, {
          v: target,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            numEl.textContent = String(Math.round(counter.v));
          },
        }),
    });
  });
}
