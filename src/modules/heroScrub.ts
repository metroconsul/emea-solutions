import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/**
 * §1 HERO — cinematic "mergulho na fábrica". The camera flies forward down an
 * elegant wireframe industrial hall (slim switchgear + overhead cable trays
 * receding to a vanishing point). Headline fades + blurs out, a wine ember
 * glow grows, and the scene closes to black near the end so it hands off
 * seamlessly to the dark statement section.
 *
 * Drops in a pre-rendered sequence if `/media/factory-frames/manifest.json`
 * ({count, ext?, pad?}) is present. Reduced motion → one static frame, no pin.
 */
export function initHeroScrub(reduced: boolean): gsap.core.Timeline | null {
  const hero = document.getElementById("hero");
  const canvas = hero?.querySelector<HTMLCanvasElement>(".hero__canvas");
  const inner = hero?.querySelector<HTMLElement>(".hero__inner");
  const ctx = canvas?.getContext("2d");
  if (!hero || !canvas || !ctx) return null;

  const SP = 3.4; // station spacing
  const HW = 3.0; // hall half-width
  const CEIL = -2.0;
  const FLOOR = 2.0;
  const Z_TOTAL = 26;
  const NEAR = 0.6;
  const FAR = 32;

  let W = 0;
  let H = 0;
  let dpr = 1;
  const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
  const smooth = (e0: number, e1: number, x: number) => {
    const t = clamp01((x - e0) / (e1 - e0));
    return t * t * (3 - 2 * t);
  };

  function resize(): void {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas!.clientWidth;
    H = canvas!.clientHeight;
    canvas!.width = Math.round(W * dpr);
    canvas!.height = Math.round(H * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  const fx = (x: number, z: number, cz: number) => {
    const d = Math.max(z - cz, NEAR);
    return W / 2 + (x * (H * 0.9)) / d;
  };
  const fy = (y: number, z: number, cz: number) => {
    const d = Math.max(z - cz, NEAR);
    return H * 0.46 + (y * (H * 0.9)) / d;
  };
  const depthAlpha = (z: number, cz: number) => {
    const d = z - cz;
    return clamp01(1 - (Math.max(d, NEAR) - NEAR) / (FAR - NEAR));
  };

  function seg(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, cz: number, a: number): void {
    if (a <= 0.01) return;
    ctx!.beginPath();
    ctx!.moveTo(fx(x1, z1, cz), fy(y1, z1, cz));
    ctx!.lineTo(fx(x2, z2, cz), fy(y2, z2, cz));
    ctx!.strokeStyle = `rgba(210,216,213,${a})`;
    ctx!.stroke();
  }

  function drawProcedural(progress: number): void {
    const cz = progress * Z_TOTAL;
    const bg = ctx!.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#0c0d0d");
    bg.addColorStop(1, "#070808");
    ctx!.fillStyle = bg;
    ctx!.fillRect(0, 0, W, H);
    ctx!.lineWidth = 1;

    const startI = Math.max(0, Math.floor(cz / SP) - 1);
    const endI = Math.ceil((cz + FAR) / SP);

    // continuous rails (floor edges, ceiling edges, tray rails)
    const railZ0 = Math.max(cz + NEAR, startI * SP);
    const railZ1 = (endI + 1) * SP;
    const rails: Array<[number, number]> = [
      [-HW, FLOOR], [HW, FLOOR], [-HW, CEIL], [HW, CEIL],
      [-1.1, CEIL + 0.25], [1.1, CEIL + 0.25], [0, FLOOR],
    ];
    for (const [x, y] of rails) {
      seg(x, y, railZ0, x, y, railZ1, cz, 0.16);
    }

    // stations: cross-section ribs + slim side panels + tray ties
    for (let i = endI; i >= startI; i--) {
      const z = i * SP;
      if (z - cz > FAR) continue;
      const a = depthAlpha(z, cz);
      // ceiling-to-floor rib on both walls
      seg(-HW, CEIL, z, -HW, FLOOR, z, cz, 0.22 * a);
      seg(HW, CEIL, z, HW, FLOOR, z, cz, 0.22 * a);
      // floor + ceiling cross line
      seg(-HW, FLOOR, z, HW, FLOOR, z, cz, 0.12 * a);
      seg(-1.1, CEIL + 0.25, z, 1.1, CEIL + 0.25, z, cz, 0.16 * a);
      // slim switchgear panel faces (a couple of internal lines)
      seg(-HW, CEIL + 0.7, z, -HW, FLOOR, z, cz, 0.0);
      seg(-HW + 0.001, CEIL + 0.9, z, -HW + 0.001, CEIL + 0.9, z + SP * 0.7, cz, 0.18 * a);
      // wine seam accent every other station
      if (i % 2 === 0) {
        ctx!.beginPath();
        ctx!.moveTo(fx(-HW, z, cz), fy(CEIL, z, cz));
        ctx!.lineTo(fx(-HW, z, cz), fy(FLOOR, z, cz));
        ctx!.strokeStyle = `rgba(165,42,56,${0.45 * a})`;
        ctx!.stroke();
        ctx!.beginPath();
        ctx!.moveTo(fx(HW, z, cz), fy(CEIL, z, cz));
        ctx!.lineTo(fx(HW, z, cz), fy(FLOOR, z, cz));
        ctx!.stroke();
      }
      // status LED dots on right wall
      const r = Math.max(1, ((H * 0.9) / Math.max(z + SP * 0.5 - cz, NEAR)) * 0.015);
      ctx!.beginPath();
      ctx!.arc(fx(HW - 0.2, z + SP * 0.5, cz), fy(CEIL + 0.6, z + SP * 0.5, cz), r, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(165,42,56,${0.8 * a})`;
      ctx!.fill();
    }

    // wine ember glow at the vanishing point, growing with depth
    const gx = W / 2;
    const gy = H * 0.46;
    const gr = ctx!.createRadialGradient(gx, gy, 0, gx, gy, H * (0.12 + progress * 0.5));
    gr.addColorStop(0, `rgba(150,28,40,${0.12 + progress * 0.4})`);
    gr.addColorStop(1, "rgba(150,28,40,0)");
    ctx!.globalCompositeOperation = "lighter";
    ctx!.fillStyle = gr;
    ctx!.fillRect(0, 0, W, H);
    ctx!.globalCompositeOperation = "source-over";

    // close to black near the end (hand off to dark section)
    const black = smooth(0.62, 1, progress);
    if (black > 0) {
      ctx!.fillStyle = `rgba(14,15,15,${black})`;
      ctx!.fillRect(0, 0, W, H);
    }
  }

  // optional pre-rendered sequence
  let frames: HTMLImageElement[] = [];
  let frameCount = 0;
  function drawSequence(progress: number): void {
    const f = Math.min(frameCount - 1, Math.round(progress * (frameCount - 1)));
    const img = frames[f];
    if (!img || !img.complete || !img.naturalWidth) return;
    ctx!.fillStyle = "#070808";
    ctx!.fillRect(0, 0, W, H);
    const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    ctx!.drawImage(img, (W - img.naturalWidth * s) / 2, (H - img.naturalHeight * s) / 2, img.naturalWidth * s, img.naturalHeight * s);
    const black = smooth(0.7, 1, progress);
    if (black > 0) {
      ctx!.fillStyle = `rgba(14,15,15,${black})`;
      ctx!.fillRect(0, 0, W, H);
    }
  }

  let draw: (p: number) => void = drawProcedural;
  let progress = reduced ? 0.04 : 0;

  fetch("/media/factory-frames/manifest.json")
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((m: { count?: number; ext?: string; pad?: number }) => {
      const count = m.count ?? 0;
      if (!count) return;
      const ext = m.ext ?? "jpg";
      const pad = m.pad ?? 4;
      let loaded = 0;
      frames = Array.from({ length: count }, (_, i) => {
        const img = new Image();
        img.onload = () => {
          loaded += 1;
          if (loaded === count) {
            frameCount = count;
            draw = drawSequence;
            draw(progress);
            ScrollTrigger.refresh();
          }
        };
        img.src = `/media/factory-frames/${String(i + 1).padStart(pad, "0")}.${ext}`;
        return img;
      });
    })
    .catch(() => {});

  resize();
  draw(progress);

  if (reduced) {
    window.addEventListener("resize", () => {
      resize();
      draw(progress);
    });
    return null;
  }

  ScrollTrigger.create({
    trigger: hero,
    start: "top top",
    end: "+=260%",
    pin: true,
    scrub: 1,
    invalidateOnRefresh: true,
    refreshPriority: 4,
    onRefresh: () => {
      resize();
      draw(progress);
    },
    onUpdate: (self) => {
      progress = self.progress;
      draw(progress);
      if (inner) {
        gsap.set(inner, {
          autoAlpha: 1 - clamp01(progress / 0.5),
          filter: `blur(${progress * 12}px)`,
          y: progress * -50,
        });
      }
    },
  });

  // intro reveal (returned so main unlocks scroll on complete)
  const title = hero.querySelector<HTMLElement>(".hero__title");
  const others = hero.querySelectorAll<HTMLElement>(
    ".hero__eyebrow, .hero__support, .hero__base > *"
  );
  const tl = gsap.timeline();
  gsap.set(inner!.querySelectorAll(":scope > *"), { opacity: 1 });
  if (title) {
    const split = new SplitText(title, { type: "words,chars" });
    tl.from(split.chars, {
      yPercent: 120,
      autoAlpha: 0,
      stagger: 0.018,
      duration: 0.9,
      ease: "power3.out",
    });
  }
  tl.from(
    Array.from(others),
    { y: 16, autoAlpha: 0, stagger: 0.08, duration: 0.7, ease: "power2.out" },
    0.2
  );
  return tl;
}
