import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis: Lenis | null = null;

export function initSmoothScroll(): Lenis | null {
  if (prefersReducedMotion() || lenis) return lenis;
  lenis = new Lenis({ lerp: 0.11 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}

export function scrollToTarget(target: string) {
  const el = document.querySelector(target);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el as HTMLElement, { offset: -90, duration: 1.4 });
  } else {
    (el as HTMLElement).scrollIntoView({ behavior: 'smooth' });
  }
}

/**
 * Creates section animations once fonts are ready, inside a gsap.context
 * scoped to `root`. Safe under React StrictMode double-mounting: the first
 * (immediately cleaned-up) run is cancelled before the fonts promise lands.
 */
export function withFontsReady(root: Element, fn: (ctx: gsap.Context) => void): () => void {
  const ctx = gsap.context(() => {}, root);
  let cancelled = false;
  document.fonts.ready.then(() => {
    if (cancelled || prefersReducedMotion()) return;
    ctx.add(() => fn(ctx));
    ScrollTrigger.refresh();
  });
  return () => {
    cancelled = true;
    ctx.revert();
  };
}

/** Masked line/word reveal for section titles (SplitText + ScrollTrigger). */
export function titleReveal(el: Element, opts: { delay?: number; once?: boolean } = {}) {
  if (prefersReducedMotion()) return;
  const split = SplitText.create(el, {
    type: 'lines,words',
    mask: 'lines',
    linesClass: 'st-line',
  });
  gsap.from(split.words, {
    yPercent: 115,
    duration: 0.9,
    stagger: 0.045,
    ease: 'power3.out',
    delay: opts.delay ?? 0,
    scrollTrigger: {
      trigger: el,
      start: 'top 86%',
      once: true,
    },
  });
}

/** Generic fade/slide-up reveal (Webflow IX2 equivalent). */
export function fadeUp(el: Element, opts: { y?: number; delay?: number; start?: string } = {}) {
  if (prefersReducedMotion()) return;
  gsap.from(el, {
    y: opts.y ?? 40,
    autoAlpha: 0,
    duration: 0.9,
    ease: 'power2.out',
    delay: opts.delay ?? 0,
    scrollTrigger: {
      trigger: el,
      start: opts.start ?? 'top 88%',
      once: true,
    },
  });
}

/** Animated counter (count-up) used in the hero stats. */
export function countUp(el: HTMLElement, target: number, suffix = '', duration = 2) {
  if (prefersReducedMotion()) {
    el.textContent = `${target}${suffix}`;
    return;
  }
  const proxy = { value: 0 };
  gsap.to(proxy, {
    value: target,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      el.textContent = `${Math.round(proxy.value)}${suffix}`;
    },
  });
}

export { gsap, ScrollTrigger, SplitText };
