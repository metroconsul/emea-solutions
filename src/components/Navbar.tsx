import { useEffect, useRef, useState } from 'react';
import { useRoute, navigate, goToSection, goToService } from '../lib/router';
import './Navbar.css';

const SERVICE_ITEMS: { label: string; slide: number }[] = [
  { label: 'Elétrica', slide: 0 },
  { label: 'Automação', slide: 2 },
  { label: 'Instrumentação', slide: 4 },
];

const PAGE_LINKS = [
  { label: 'Compliance', route: '/compliance' },
  { label: 'LGPD', route: '/lgpd' },
  { label: 'Qualidade', route: '/qualidade' },
];

export default function Navbar() {
  const route = useRoute();
  const [activeSection, setActiveSection] = useState('#home');
  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    if (route !== '/') return;
    const sections = ['#home', '#setores', '#servicos', '#clientes', '#contato'];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(`#${entry.target.id}`);
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    sections.forEach((s) => {
      const el = document.querySelector(s);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [route]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDropOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const closeMenus = () => {
    setOpen(false);
    setDropOpen(false);
  };

  const goHome = () => {
    closeMenus();
    goToSection('#home');
  };

  const goPage = (to: string) => {
    closeMenus();
    navigate(to);
  };

  const goSection = (target: string) => {
    closeMenus();
    goToSection(target);
  };

  const goService = (slide: number) => {
    closeMenus();
    goToService(slide);
  };

  const dropEnter = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setDropOpen(true);
  };

  const dropLeave = () => {
    closeTimer.current = window.setTimeout(() => setDropOpen(false), 180);
  };

  const isHome = route === '/';

  return (
    <header className="nav">
      <button className="nav-logo" onClick={goHome} aria-label="EMEA Solutions — voltar ao início">
        <img src="/assets/logo.png" alt="EMEA Solutions" />
      </button>

      <nav className="nav-pill" aria-label="Navegação principal">
        <button
          className={`nav-link${isHome && activeSection === '#home' ? ' is-active' : ''}`}
          onClick={goHome}
        >
          Home
        </button>
        <button
          className={`nav-link${route === '/institucional' ? ' is-active' : ''}`}
          onClick={() => goPage('/institucional')}
        >
          Institucional
        </button>

        <div className="nav-drop" onMouseEnter={dropEnter} onMouseLeave={dropLeave}>
          <button
            className={`nav-link nav-drop-toggle${(isHome && activeSection === '#servicos') || dropOpen ? ' is-active' : ''}`}
            aria-expanded={dropOpen}
            aria-haspopup="true"
            onClick={() => (dropOpen ? goSection('#servicos') : setDropOpen(true))}
          >
            Serviços
            <svg
              className={`nav-caret${dropOpen ? ' is-open' : ''}`}
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              aria-hidden="true"
            >
              <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <div className={`nav-drop-panel${dropOpen ? ' is-open' : ''}`} role="menu">
            {SERVICE_ITEMS.map((item) => (
              <button key={item.label} role="menuitem" className="nav-drop-item" onClick={() => goService(item.slide)}>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <button
          className={`nav-link${isHome && activeSection === '#clientes' ? ' is-active' : ''}`}
          onClick={() => goSection('#clientes')}
        >
          Clientes
        </button>
      </nav>

      <div className="nav-right">
        <button className="btn btn-red nav-cta" onClick={() => goSection('#contato')}>
          Fazer Contato
        </button>
        <button
          className={`nav-burger${open ? ' is-open' : ''}`}
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
        >
          <span />
          <span />
        </button>
      </div>

      <div className={`nav-overlay${open ? ' is-open' : ''}`}>
        <button className="nav-overlay-link" onClick={goHome}>Home</button>
        <button className="nav-overlay-link" onClick={() => goPage('/institucional')}>Institucional</button>
        <button className="nav-overlay-link" onClick={() => goSection('#servicos')}>Serviços</button>
        <div className="nav-overlay-sub">
          {SERVICE_ITEMS.map((item) => (
            <button key={item.label} className="nav-overlay-sublink" onClick={() => goService(item.slide)}>
              {item.label}
            </button>
          ))}
        </div>
        <button className="nav-overlay-link" onClick={() => goSection('#clientes')}>Clientes</button>
        <button className="nav-overlay-link" onClick={() => goSection('#contato')}>Contato</button>
        <div className="nav-overlay-pages">
          {PAGE_LINKS.map((p) => (
            <button key={p.route} className="nav-overlay-sublink" onClick={() => goPage(p.route)}>
              {p.label}
            </button>
          ))}
        </div>
        <div className="nav-overlay-info">
          <a href="mailto:comercial@emeasolutions.com.br">comercial@emeasolutions.com.br</a>
          <a href="tel:+551239511623">(12) 3951-1623</a>
        </div>
      </div>
    </header>
  );
}
