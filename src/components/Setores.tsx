import { useEffect, useRef, type ReactNode } from 'react';
import { gsap, withFontsReady, titleReveal, fadeUp } from '../lib/animations';
import './Setores.css';

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

const ICONS: Record<string, ReactNode> = {
  farmaceutica: (
    <svg viewBox="0 0 32 32" {...stroke}>
      <rect x="10" y="3.5" width="12" height="25" rx="6" transform="rotate(45 16 16)" />
      <line x1="11.8" y1="11.8" x2="20.2" y2="20.2" />
    </svg>
  ),
  alimenticia: (
    <svg viewBox="0 0 32 32" {...stroke}>
      <path d="M10 4v7a3 3 0 0 0 3 3v14" />
      <path d="M7 4v6M13 4v6" />
      <path d="M22 4c-2.5 1.5-4 4.5-4 8 0 2.5 1.5 4 4 4v12" />
    </svg>
  ),
  automotiva: (
    <svg viewBox="0 0 32 32" {...stroke}>
      <path d="M5 19l2-6.5A3 3 0 0 1 9.8 10h12.4a3 3 0 0 1 2.8 2.5L27 19v6h-3" />
      <path d="M5 19h22" />
      <circle cx="10" cy="24" r="2.6" />
      <circle cx="22" cy="24" r="2.6" />
      <path d="M12.6 24h6.8M5 25h2.4" />
    </svg>
  ),
  metalurgica: (
    <svg viewBox="0 0 32 32" {...stroke}>
      <path d="M7 6h18M7 26h18" />
      <path d="M13 6v20M19 6v20" />
    </svg>
  ),
  quimica: (
    <svg viewBox="0 0 32 32" {...stroke}>
      <path d="M13 4h6M14.5 4v8l7.5 12.5a2.5 2.5 0 0 1-2.1 3.5H12.1a2.5 2.5 0 0 1-2.1-3.5L17.5 12V4" />
      <path d="M12 20h8" />
    </svg>
  ),
  hospitalar: (
    <svg viewBox="0 0 32 32" {...stroke}>
      <circle cx="16" cy="16" r="12" />
      <path d="M16 10.5v11M10.5 16h11" />
    </svg>
  ),
  aeronautico: (
    <svg viewBox="0 0 32 32" {...stroke}>
      <path d="M4 20l24-9-4.5 8H10l-4 4 1.5-5.5L4 20z" />
      <path d="M14 19l-2 7 4-4" />
    </svg>
  ),
  aeroespacial: (
    <svg viewBox="0 0 32 32" {...stroke}>
      <path d="M16 3c4.5 2.8 7 7.5 7 12.5 0 2.4-.5 4.7-1.4 6.5h-11A15 15 0 0 1 9 15.5C9 10.5 11.5 5.8 16 3z" />
      <circle cx="16" cy="13" r="2.6" />
      <path d="M10.6 22l-3 5 5-2M21.4 22l3 5-5-2M16 22v6" />
    </svg>
  ),
};

const AREAS = [
  { label: 'Farmacêutica', icon: 'farmaceutica' },
  { label: 'Alimentícia', icon: 'alimenticia' },
  { label: 'Automotiva', icon: 'automotiva' },
  { label: 'Metalúrgica', icon: 'metalurgica' },
  { label: 'Química', icon: 'quimica' },
  { label: 'Hospitalar', icon: 'hospitalar' },
  { label: 'Aeronáutico', icon: 'aeronautico' },
  { label: 'Aeroespacial', icon: 'aeroespacial' },
];

export default function Setores() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;
    return withFontsReady(root, () => {
      titleReveal(root.querySelector('h2')!);
      fadeUp(root.querySelector('.sub')!, { delay: 0.15 });
      gsap.from('.area-card', {
        y: 36,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.07,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: root.querySelector('.areas-grid'),
          start: 'top 82%',
          once: true,
        },
      });
    });
  }, []);

  return (
    <section className="section setores" id="setores" ref={rootRef}>
      <div className="container">
        <div className="sec-head">
          <span className="sec-label">Áreas de Atuação</span>
          <div className="sec-title-block">
            <h2>Onde atuamos</h2>
            <p className="sub">
              Atendemos indústrias de diferentes segmentos — de aplicações críticas da área
              farmacêutica e aeroespacial ao dia a dia da produção industrial.
            </p>
          </div>
        </div>

        <div className="areas-grid">
          {AREAS.map((area) => (
            <div className="area-card" key={area.label}>
              <span className="area-icon" aria-hidden="true">
                {ICONS[area.icon]}
              </span>
              <span className="area-label">{area.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
