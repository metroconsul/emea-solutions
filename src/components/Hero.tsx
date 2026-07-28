import { useEffect, useRef, useState } from 'react';
import { gsap, SplitText, countUp, prefersReducedMotion } from '../lib/animations';
import './Hero.css';

// TODO: preencher com os números reais da EMEA antes de publicar
const STATS = [
  { value: 7, suffix: '+', label: 'Anos de experiência' }, // desde 2019
  { value: 150, suffix: '+', label: 'Projetos entregues' }, // placeholder
  { value: 40, suffix: '+', label: 'Clientes atendidos' }, // placeholder
];

// fotografias autoriais da EMEA (slideshow, pedido do cliente: ao menos 4 slides)
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
      gsap.from('.hero-sub, .hero-stats', {
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
