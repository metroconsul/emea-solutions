import { useEffect, useRef, type FormEvent } from 'react';
import { withFontsReady, titleReveal, fadeUp, getLenis } from '../lib/animations';
import { navigate, goToSection, goToService } from '../lib/router';
import './Footer.css';

const NAV = [
  { label: 'Home', target: '#home' },
  { label: 'Setores', target: '#setores' },
  { label: 'Serviços', target: '#servicos' },
  { label: 'Clientes', target: '#clientes' },
  { label: 'Contato', target: '#contato' },
];

const PAGES = [
  { label: 'Institucional', route: '/institucional' },
  { label: 'Compliance', route: '/compliance' },
  { label: 'LGPD', route: '/lgpd' },
  { label: 'Qualidade', route: '/qualidade' },
];

const SERVICOS = [
  { label: 'Elétrica', slide: 0 },
  { label: 'Automação', slide: 2 },
  { label: 'Instrumentação', slide: 4 },
];

export default function Footer() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;
    return withFontsReady(root, () => {
      titleReveal(root.querySelector('.newsletter h2')!);
      fadeUp(root.querySelector('.newsletter-form')!, { delay: 0.2 });
      fadeUp(root.querySelector('.footer-panel')!, { y: 60 });
    });
  }, []);

  const onNewsletter = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get('email');
    window.location.href = `mailto:comercial@emeasolutions.com.br?subject=${encodeURIComponent('Assinatura de newsletter')}&body=${encodeURIComponent(`Quero assinar a newsletter: ${email}`)}`;
  };

  const backToTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer" ref={rootRef}>
      <div className="newsletter">
        <div className="container">
          <span className="sec-label newsletter-label">Fique por dentro</span>
          <h2>Assine nossa newsletter.</h2>
          <form className="newsletter-form" onSubmit={onNewsletter}>
            <input
              type="email"
              name="email"
              placeholder="Seu melhor e-mail"
              aria-label="Seu e-mail para a newsletter"
              required
            />
            <button type="submit" className="btn btn-red">
              Assinar <span className="arrow">→</span>
            </button>
          </form>
        </div>
      </div>

      <div className="footer-panel-wrap">
        <div className="footer-panel">
          <img className="footer-watermark" src="/assets/logo.png" alt="" aria-hidden="true" />

          <div className="footer-grid">
            <div className="footer-brand">
              <img className="footer-logo" src="/assets/logo.png" alt="EMEA Solutions" />
              <p>
                Soluções em Engenharia de Projetos.
                <br />
                Elétrica · Instrumentação · Automação
              </p>
              <p className="footer-since">Desde 2018 — Jacareí, SP</p>
              <div className="footer-iso">
                <img src="/assets/iso-9001.svg" alt="Certificação ISO 9001:2015" loading="lazy" />
                <span>Sistema de Gestão da Qualidade certificado ISO 9001</span>
              </div>
            </div>

            <nav className="footer-col" aria-label="Navegação do rodapé">
              <span className="footer-col-title">Navegação</span>
              {NAV.map((item) => (
                <button key={item.label} onClick={() => goToSection(item.target)}>
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="footer-col">
              <span className="footer-col-title">A EMEA</span>
              {PAGES.map((item) => (
                <button key={item.route} onClick={() => navigate(item.route)}>
                  {item.label}
                </button>
              ))}
            </div>

            <div className="footer-col">
              <span className="footer-col-title">Serviços</span>
              {SERVICOS.map((item) => (
                <button key={item.label} onClick={() => goToService(item.slide)}>
                  {item.label}
                </button>
              ))}
            </div>

            <div className="footer-col">
              <span className="footer-col-title">Contato</span>
              <a href="mailto:comercial@emeasolutions.com.br">comercial@emeasolutions.com.br</a>
              <a href="tel:+551239511623">(12) 3951-1623</a>
              <a href="https://wa.me/5512974020869" target="_blank" rel="noreferrer">
                (12) 97402-0869
              </a>
              <a href="https://wa.me/5512992138686" target="_blank" rel="noreferrer">
                (12) 99213-8686
              </a>
              <a href="https://www.instagram.com/emeasolutions" target="_blank" rel="noreferrer">
                Instagram
              </a>
              <a href="https://br.linkedin.com/company/emeasolutions" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2018–2026 EMEA Solutions. Todos os direitos reservados.</span>
            <button className="footer-top" onClick={backToTop}>
              Voltar ao topo ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
