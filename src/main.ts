import "./styles/main.css";

import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import { initWireframes } from "./modules/wireframe";
import { initHeroScrub } from "./modules/heroScrub";
import { initStatements } from "./modules/statement";
import { initBlueprintGrid } from "./modules/blueprintGrid";
import { initCapabilities } from "./modules/capabilities";
import { initProcesso } from "./modules/processo";
import { initSetores } from "./modules/setores";
import { initFaq } from "./modules/faq";
import { initContato } from "./modules/contato";
import { initNav } from "./modules/nav";
import { setupReveals, initCounters } from "./modules/reveal";

gsap.registerPlugin(ScrollTrigger, SplitText);

// Always open at the top — pinned/scrubbed sections don't restore cleanly.
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.scrollTo(0, 0);

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lenis: Lenis | null = null;
if (!reduced) {
  document.documentElement.classList.add("js-motion");
  lenis = new Lenis({ smoothWheel: true });
  const l = lenis;
  l.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => l.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  l.stop(); // locked during the hero intro
  (window as unknown as { lenis: Lenis }).lenis = l;
}

// build wireframes before sections that draw them
initWireframes();

initNav(lenis);
initBlueprintGrid(reduced);
initStatements(reduced);
initCapabilities(reduced);
initProcesso(reduced);
initSetores(reduced);
initFaq(reduced);
initContato();
setupReveals(reduced);
initCounters(reduced);

const intro = initHeroScrub(reduced);
if (lenis) {
  const l = lenis;
  if (intro) {
    intro.eventCallback("onComplete", () => l.start());
    gsap.delayedCall(2.2, () => l.start()); // safety
  } else {
    l.start();
  }
}

ScrollTrigger.refresh();

if (!reduced) {
  if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener("load", () => ScrollTrigger.refresh());
  let t = 0;
  window.addEventListener("resize", () => {
    window.clearTimeout(t);
    t = window.setTimeout(() => ScrollTrigger.refresh(), 200);
  });
}
