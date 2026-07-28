import { useEffect, useRef } from 'react';
import { gsap, SplitText, withFontsReady, titleReveal, fadeUp, scrollToTarget } from '../lib/animations';
import './Sobre.css';

const CARDS = [
  {
    img: '/assets/fotos/porque-eletrocalhas.jpg',
    title: 'Onde a inovação move a indústria',
    text: 'A EMEA Solutions implementa soluções de alta qualidade e eficiência, acompanhando cada nova tecnologia que chega ao mercado para atender às necessidades de cada cliente.',
  },
  {
    img: '/assets/fotos/porque-painel-interno.jpg',
    title: 'Tecnologia que transforma',
    text: 'Soluções integradas de engenharia em Elétrica, Controle & Automação e Instrumentação, implementadas de forma segura e rentável.',
  },
  {
    img: '/assets/fotos/porque-barramento.jpg',
    title: 'Novos padrões de engenharia',
    text: 'Equipe especializada e processos certificados ISO 9001, com as melhores ferramentas e tecnologias para projetar, executar, testar e energizar soluções para a indústria.',
  },
];

export default function Sobre() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;

    return withFontsReady(root, () => {
      // Scroll-scrubbed word color reveal (Evostel's About headline)
      const intro = root.querySelector('.sobre-intro-text')!;
      const split = SplitText.create(intro, { type: 'words' });
      gsap.fromTo(
        split.words,
        { color: 'var(--gray-3)' },
        {
          color: 'var(--ink)',
          stagger: 0.04,
          ease: 'none',
          scrollTrigger: {
            trigger: intro,
            start: 'top 78%',
            end: 'bottom 45%',
            scrub: true,
          },
        },
      );

      titleReveal(root.querySelector('.porque-head h2')!);
      fadeUp(root.querySelector('.porque-head .sub')!, { delay: 0.15 });
      fadeUp(root.querySelector('.sobre-media')!);
      fadeUp(root.querySelector('.sobre-intro-cta')!);

      // Pinned card sequence (Evostel "Why Us"): the card grid pins while
      // the three cards enter one after another, scrubbed by scroll.
      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px)', () => {
        const grid = root.querySelector<HTMLElement>('.porque-grid')!;
        const cards = gsap.utils.toArray<HTMLElement>('.porque-card', root);
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: grid,
            start: 'top 24%',
            end: '+=110%',
            pin: true,
            pinSpacing: true,
            scrub: 0.6,
          },
        });
        cards.forEach((card, i) => {
          tl.from(card, { yPercent: 42, autoAlpha: 0, duration: 1, ease: 'power2.out' }, i * 0.85);
        });
      });
      mm.add('(max-width: 899px)', () => {
        gsap.utils.toArray<HTMLElement>('.porque-card', root).forEach((card) => fadeUp(card));
      });
    });
  }, []);

  return (
    <section className="section sobre" id="sobre" ref={rootRef}>
      <div className="container">
        <div className="sec-head sobre-head">
          <span className="sec-label">Sobre</span>
          <div className="sobre-intro">
            <p className="sobre-intro-text">
              A EMEA Solutions implementa soluções de alta qualidade e eficiência, mantendo-se
              atualizada com a evolução do mercado e entregando soluções integradas de engenharia
              de forma segura e rentável.
            </p>
            <div className="sobre-intro-cta">
              <button className="btn btn-red" onClick={() => scrollToTarget('#contato')}>
                Fale conosco <span className="arrow">→</span>
              </button>
              <div className="sobre-iso">
                <img src="/assets/iso-9001.svg" alt="Selo de certificação ISO 9001:2015" loading="lazy" />
                <p>
                  <strong>Certificada ISO 9001</strong>
                  Sistema de Gestão da Qualidade auditado e certificado.
                </p>
              </div>
            </div>
          </div>
          <div className="sobre-media">
            <img
              src="/assets/fotos/sobre-paineis.jpg"
              alt="Painéis de passagem fabricados pela EMEA Solutions"
              loading="lazy"
            />
          </div>
        </div>

        <div className="porque-pin">
          <div className="sec-head porque-head">
            <span className="sec-label">Por que a EMEA</span>
            <div className="sec-title-block">
              <h2>Engenharia que impulsiona a indústria</h2>
              <p className="sub">
                Tecnologias de ponta, soluções sob medida e serviços especializados que elevam a
                excelência, a inovação e a confiabilidade de cada operação.
              </p>
            </div>
          </div>

          <div className="porque-grid">
            {CARDS.map((card) => (
              <article className="porque-card" key={card.title}>
                <div className="porque-card-media">
                  <img src={card.img} alt={card.title} loading="lazy" />
                </div>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
