import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

/**
 * The signature Vaulk move: big centered statements whose characters light up
 * left-to-right (dim → bright) as the section scrolls through — scrubbed, so
 * the shimmer tracks the scroll. Plus a slow parallax on the wine glow.
 */
export function initStatements(reduced: boolean): void {
  gsap.utils.toArray<HTMLElement>("[data-shimmer]").forEach((el) => {
    const split = new SplitText(el, { type: "words,chars" });
    gsap.set(el, { visibility: "visible" });

    if (reduced) {
      gsap.set(split.chars, { color: "#ffffff" });
      return;
    }

    gsap.set(split.chars, { color: "rgba(176,168,162,0.16)" });
    gsap.to(split.chars, {
      color: "rgba(255,255,255,1)",
      ease: "none",
      stagger: { each: 0.5 },
      scrollTrigger: {
        trigger: el,
        start: "top 82%",
        end: "top 28%",
        scrub: true,
      },
    });
  });

  if (reduced) return;
  gsap.utils.toArray<HTMLElement>(".statement__glow").forEach((glow) => {
    gsap.fromTo(
      glow,
      { scale: 0.7, opacity: 0.3 },
      {
        scale: 1.1,
        opacity: 0.6,
        ease: "none",
        scrollTrigger: {
          trigger: glow.closest(".statement"),
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  });
}
