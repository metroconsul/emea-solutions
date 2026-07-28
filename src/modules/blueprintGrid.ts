import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Crop-marks (┌ ┐ └ ┘) scale + fade in as each frame enters — blueprint feel. */
export function initBlueprintGrid(reduced: boolean): void {
  if (reduced) return;
  gsap.set(".crop", { scale: 0.5, transformOrigin: "center" });
  ScrollTrigger.batch(".crop", {
    start: "top 94%",
    onEnter: (els) =>
      gsap.to(els, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
        stagger: { each: 0.05, from: "random" },
        overwrite: true,
      }),
  });
}
