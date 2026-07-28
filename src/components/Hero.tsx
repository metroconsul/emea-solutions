import { useEffect, useRef, useState } from 'react';
import { gsap, SplitText, countUp, prefersReducedMotion } from '../lib/animations';
import './Hero.css';

const STATS = [
  { value: 600, suffix: '+', label: 'Projetos industriais' },
  { value: 40, suffix: '+', label: 'Grandes clientes' },
  { value: 8, suffix: '', label: 'Anos no mercado' },
  { value: 500, suffix: '+', label: 'Painéis montados' },
  { value: 20000, suffix: '+', label: 'Horas de engenharia' },
];

const CERTIFICATIONS = [
  'ISO 9001 Certificada',
  'CREA',
  'NR-10',
  'NR-12',
  'NBR 5410',
  'NBR 14039',
  'NBR 5419',
];

// fotografias autoriais da EMEA (slideshow)
const SLIDES = [
  '/assets/fotos/porque-eletrocalhas.jpg',
  '/assets/fotos/servico-automacao.jpg',
  '/assets/fotos/setor-saneamento.jpg',
  '/assets/fotos/setor-automotivo.jpg',
];

export default function Hero({ started }: { started: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const playedRef = useRef(false);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      setSlide((s) => (s + 1) % SLIDES.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!started || playedRef.current || !rootRef.current) return;
    playedRef.current = true;

    const root = rootRef.current;
    const title = root.querySelector('h1')!;
    const numbers = root.querySelectorAll<HTMLElement>('.hero-stat-number');

    if (prefersReducedMotion()) {
      numbers.forEach((el, i) => {
        el.textContent = `${STATS[i].value}${STATS[i].suffix}`;
      });
      return;
    }

    const ctx = gsap.context(() => {
      document.fonts.ready.then(() => {
        const split = SplitText.create(title, {
          type: 'lines,words',
          mask: 'lines',
          linesClass: 'st-line',
        });
        gsap.from(split.words, {
          yPercent: 115,
          duration: 1.1,
          stagger: 0.06,
          ease: 'power3.out',
          delay: 0.15,
        });
      });
      gsap.from('.hero-sub, .hero-stats, .hero-certs', {
        y: 30,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.15,
        delay: 0.55,
        ease: 'power2.out',
      });
      gsap.fromTo(
        '.hero-bgs',
        { scale: 1.12 },
        { scale: 1, duration: 2.2, ease: 'power2.out' },
      );
      numbers.forEach((el, i) => countUp(el, STATS[i].value, STATS[i].suffix, 2.2));
    }, root);

    return () => ctx.revert();
  }, [started]);

  return (
    <section className="hero" id="home" ref={rootRef}>
      <div className="hero-bgs" role="img" aria-label="Projetos executados pela EMEA Solutions">
        {SLIDES.map((src, i) => (
          <div
            key={src}
            className={`hero-bg${i === slide ? ' is-active' : ''}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>
      <div className="hero-overlay" />
      <div className="container hero-content">
        <div className="hero-copy">
          <h1>Experiência que entrega soluções</h1>
          <p className="hero-sub">
            Engenharia integrada em Elétrica, Instrumentação e Automação — de forma segura e
            rentável.
          </p>
          <ul className="hero-certs">
            {CERTIFICATIONS.map((cert) => (
              <li key={cert} className="hero-cert">
                <svg className="hero-cert-check" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                {cert}
              </li>
            ))}
          </ul>
        </div>
        <div className="hero-stats">
          {STATS.map((stat) => (
            <div className="hero-stat" key={stat.label}>
              <span className="hero-stat-number">0{stat.suffix}</span>
              <span className="hero-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
