import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

/** Chamfered nav: stuck/blur state, mobile menu, Lenis anchor scroll, active link. */
export function initNav(lenis: Lenis | null): void {
  const nav = document.getElementById("nav");
  if (!nav) return;

  const burger = nav.querySelector<HTMLButtonElement>(".nav__burger");
  const navH = nav.offsetHeight || 72;

  const onScroll = () => nav.classList.toggle("is-stuck", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  burger?.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
  });

  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector<HTMLElement>(id);
      if (!target) return;
      e.preventDefault();
      nav.classList.remove("is-open");
      burger?.setAttribute("aria-expanded", "false");
      if (lenis) lenis.scrollTo(target, { offset: -navH + 6 });
      else target.scrollIntoView({ behavior: "smooth" });
    });
  });

  const links = nav.querySelectorAll<HTMLElement>("[data-navlink]");
  ["solucoes", "processo", "setores", "projetos", "contato"].forEach((id) => {
    const sec = document.getElementById(id);
    const link = nav.querySelector<HTMLElement>(`[data-navlink="${id}"]`);
    if (!sec || !link) return;
    ScrollTrigger.create({
      trigger: sec,
      start: "top 55%",
      end: "bottom 55%",
      onToggle: (self) => {
        if (self.isActive) {
          links.forEach((l) => l.classList.remove("is-active"));
          link.classList.add("is-active");
        }
      },
    });
  });
}
