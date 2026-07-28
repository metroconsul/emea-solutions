import { gsap } from "gsap";

/** §8 FAQ — smooth accordion over native <details>, one open at a time. */
export function initFaq(reduced: boolean): void {
  const items = gsap.utils.toArray<HTMLDetailsElement>("[data-faq]");
  if (reduced) return;

  items.forEach((item) => {
    const summary = item.querySelector<HTMLElement>("summary");
    const panel = item.querySelector<HTMLElement>(".faq__a");
    if (!summary || !panel) return;

    summary.addEventListener("click", (e) => {
      e.preventDefault();

      if (item.open) {
        gsap.to(panel, {
          height: 0,
          duration: 0.35,
          ease: "power2.inOut",
          onComplete: () => {
            item.open = false;
            panel.style.height = "";
          },
        });
        return;
      }

      items.forEach((other) => {
        if (other !== item && other.open) {
          const op = other.querySelector<HTMLElement>(".faq__a");
          if (op)
            gsap.to(op, {
              height: 0,
              duration: 0.3,
              ease: "power2.inOut",
              onComplete: () => {
                other.open = false;
                op.style.height = "";
              },
            });
        }
      });

      item.open = true;
      const target = panel.scrollHeight;
      gsap.fromTo(
        panel,
        { height: 0 },
        {
          height: target,
          duration: 0.45,
          ease: "power2.out",
          onComplete: () => {
            panel.style.height = "auto";
          },
        }
      );
    });
  });
}
