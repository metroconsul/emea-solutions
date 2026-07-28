import { useEffect, useRef } from 'react';
import { gsap, withFontsReady } from '../lib/animations';
import { navigate } from '../lib/router';
import './InfoBoxes.css';

const BOXES = [
  {
    label: 'Institucional',
    route: '/institucional',
    img: '/assets/fotos/sobre-paineis.jpg',
    text: 'Quem somos, nosso propósito e nossos diferenciais.',
  },
  {
    label: 'Compliance',
    route: '/compliance',
    img: '/assets/fotos/porque-painel-interno.jpg',
    text: 'Compromisso com a ética e a integridade.',
  },
  {
    label: 'LGPD',
    route: '/lgpd',
    img: '/assets/fotos/servico-instrumentacao.jpg',
    text: 'Privacidade e proteção de dados pessoais.',
  },
  {
    label: 'Qualidade',
    route: '/qualidade',
    img: '/assets/fotos/porque-barramento.jpg',
    text: 'Gestão da qualidade certificada ISO 9001.',
  },
];

export default function InfoBoxes() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;
    return withFontsReady(root, () => {
      gsap.from('.infobox', {
        y: 40,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: root,
          start: 'top 82%',
          once: true,
        },
      });
    });
  }, []);

  return (
    <section className="infoboxes" ref={rootRef} aria-label="Institucional, Compliance, LGPD e Qualidade">
      <div className="container">
        <div className="infoboxes-grid">
          {BOXES.map((box) => (
            <button className="infobox" key={box.route} onClick={() => navigate(box.route)}>
              <img src={box.img} alt="" loading="lazy" />
              <span className="infobox-shade" />
              <span className="infobox-content">
                <span className="infobox-label">
                  {box.label} <span className="arrow">→</span>
                </span>
                <span className="infobox-text">{box.text}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
