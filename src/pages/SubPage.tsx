import { useEffect, useRef, type FC, type ReactNode, type RefObject } from 'react';
import { navigate, goToSection, goToService } from '../lib/router';
import { gsap, withFontsReady, titleReveal, fadeUp, getLenis } from '../lib/animations';
import './Page.css';

/* ------------------------------------------------------------------ */
/* Shared Evostel-style building blocks                                */
/* ------------------------------------------------------------------ */

function PageHero({
  label,
  title,
  sub,
  photo,
}: {
  label: string;
  title: string;
  sub?: string;
  photo: string;
}) {
  return (
    <section className="page-hero">
      <div className="page-hero-bg" style={{ backgroundImage: `url(${photo})` }} />
      <div className="page-hero-overlay" />
      <div className="container page-hero-inner">
        <span className="sec-label page-label">{label}</span>
        <h1>{title}</h1>
        {sub && <p className="page-hero-sub">{sub}</p>}
      </div>
      <div className="page-scroll" aria-hidden="true">
        Role para baixo
        <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
          <path d="M6 1v11M1 8l5 4 5-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}

/** Framed photo + overlapping dark panel — the Evostel service "overview". */
function Overview({
  label,
  title,
  photo,
  photoAlt,
  iso,
  children,
}: {
  label: string;
  title: string;
  photo: string;
  photoAlt: string;
  iso?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="page-section page-overview">
      <div className="page-overview-media">
        <img src={photo} alt={photoAlt} loading="lazy" />
      </div>
      <div className="page-overview-panel">
        {iso && (
          <div className="page-overview-iso">
            <img src="/assets/iso-9001.svg" alt="Certificação ISO 9001:2015" />
          </div>
        )}
        <span className="sec-label">{label}</span>
        <h2>{title}</h2>
        {children}
      </div>
    </section>
  );
}

const EXPLORE = [
  { label: 'Institucional', route: '/institucional', photo: '/assets/fotos/sobre-paineis.jpg' },
  { label: 'Compliance', route: '/compliance', photo: '/assets/fotos/porque-painel-interno.jpg' },
  { label: 'LGPD', route: '/lgpd', photo: '/assets/fotos/servico-instrumentacao.jpg' },
  { label: 'Qualidade', route: '/qualidade', photo: '/assets/fotos/pagina-qualidade.jpg' },
];

function ExploreMore({ current }: { current: string }) {
  const items = EXPLORE.filter((e) => e.route !== current).slice(0, 3);
  return (
    <section className="page-section page-explore">
      <h2>Explore mais</h2>
      <div className="page-explore-grid">
        {items.map((item) => (
          <button key={item.route} className="page-explore-card" onClick={() => navigate(item.route)}>
            <div className="page-explore-media">
              <img src={item.photo} alt={item.label} loading="lazy" />
            </div>
            <h3>
              {item.label} <span className="arrow">→</span>
            </h3>
          </button>
        ))}
      </div>
    </section>
  );
}

function PageCta() {
  return (
    <section className="page-section">
      <div className="page-cta">
        <h2>Você tem um projeto para discutir?</h2>
        <button className="btn btn-white" onClick={() => goToSection('#contato')}>
          Fale conosco <span className="arrow">→</span>
        </button>
      </div>
    </section>
  );
}

/** Runs the section reveals once fonts are ready, scoped to the page root. */
function usePageReveal(rootRef: RefObject<HTMLElement | null>, route: string) {
  useEffect(() => {
    // pages render below the fold of a scrolled home — always start at top
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);

    if (!rootRef.current) return;
    const root = rootRef.current;
    return withFontsReady(root, () => {
      const h1 = root.querySelector('.page-hero h1');
      if (h1) titleReveal(h1);
      const sub = root.querySelector('.page-hero-sub');
      if (sub) fadeUp(sub, { delay: 0.15 });

      root.querySelectorAll('.page-section > h2').forEach((el) => titleReveal(el));
      root.querySelectorAll<HTMLElement>('.page-overview-media').forEach((el) => fadeUp(el, { y: 50 }));
      root.querySelectorAll<HTMLElement>('.page-overview-panel').forEach((el) => fadeUp(el, { y: 70, delay: 0.1 }));
      root.querySelectorAll<HTMLElement>('.page-statement, .page-quote, .page-include-list, .page-list, .page-cta').forEach((el) => fadeUp(el, { y: 40 }));

      root.querySelectorAll<HTMLElement>('.page-cards, .page-explore-grid').forEach((grid) => {
        const items = grid.querySelectorAll<HTMLElement>(':scope > *');
        gsap.from(items, {
          y: 40,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.09,
          ease: 'power2.out',
          scrollTrigger: { trigger: grid, start: 'top 85%', once: true },
        });
      });

      // prose paragraphs not inside the dark panel
      root.querySelectorAll<HTMLElement>('.page-prose > p').forEach((el, i) => fadeUp(el, { y: 30, delay: i * 0.05 }));
    });
  }, [rootRef, route]);
}

/* ------------------------------------------------------------------ */
/* Pages                                                               */
/* ------------------------------------------------------------------ */

const FAZEMOS = [
  { title: 'Painéis Elétricos', text: 'Força, comando e automação — montagem com padrão e rastreabilidade.' },
  { title: 'Projetos Industriais', text: 'Desenvolvimento de projetos elétricos aplicados à realidade da indústria.' },
  { title: 'Integração de Sistemas', text: 'Automação, instrumentação e sistemas conversando de ponta a ponta.' },
  { title: 'Montagens e Comissionamento', text: 'Execução, testes e energização com segurança e conformidade.' },
];

const DIFERENCIAIS = [
  { title: 'Engenharia certificada ISO 9001', text: 'Processos padronizados, documentados e rastreáveis.' },
  { title: 'Equipe técnica especializada', text: 'Time próprio, qualificado e alinhado ao seu projeto.' },
  { title: 'Segurança e qualidade', text: 'Comprometimento com normas técnicas em cada entrega.' },
  { title: 'Parcerias com líderes de mercado', text: 'Rittal · ABB · Siemens · WEG · Eaton · Schneider · Rockwell' },
];

function Institucional() {
  return (
    <>
      <PageHero
        label="Institucional"
        title="A EMEA Solutions"
        sub="Energia, tecnologia e pessoas movendo a indústria."
        photo="/assets/fotos/pagina-institucional.jpg"
      />
      <div className="page-body container">
        <Overview
          label="Quem somos"
          title="Soluções completas em engenharia"
          photo="/assets/fotos/sobre-paineis.jpg"
          photoAlt="Painéis fabricados pela EMEA Solutions"
        >
          <p>
            A EMEA Solutions é uma empresa que, junto de seus parceiros e fornecedores, oferece
            soluções completas em engenharia elétrica, automação e instrumentação. Nossa equipe
            altamente qualificada desenvolve e executa projetos industriais com tecnologia,
            segurança e eficiência, impulsionando a produtividade e a confiabilidade de nossos
            clientes.
          </p>
          <p>
            Atuamos como parceiros técnicos estratégicos, inclusive em aplicações críticas que
            exigem alto rigor técnico e total conformidade normativa.
          </p>
        </Overview>

        <section className="page-section">
          <div className="page-statement">
            <span className="sec-label">Nosso propósito</span>
            <p>
              Fornecer soluções de qualidade em instalações elétricas, instrumentação e automação,
              prezando pela excelência na execução e no atendimento. Nosso compromisso é
              transformar tecnologia em resultado.
            </p>
          </div>
        </section>

        <section className="page-section">
          <h2>O que fazemos</h2>
          <div className="page-cards">
            {FAZEMOS.map((item) => (
              <div className="page-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
          <div className="page-cta-row">
            <button className="btn btn-red" onClick={() => goToService(0)}>
              Ver todos os serviços <span className="arrow">→</span>
            </button>
          </div>
        </section>

        <section className="page-section page-prose">
          <h2>Evolução contínua</h2>
          <p className="page-narrow">
            A EMEA Solutions implementa soluções elétricas de alta qualidade e eficiência. Mantemos
            nosso compromisso de acompanhar a evolução do mercado, entregando soluções integradas e
            rentáveis em engenharia, alinhadas às novas tecnologias e às demandas da indústria
            moderna.
          </p>
        </section>

        <section className="page-section">
          <h2>Diferenciais</h2>
          <div className="page-cards">
            {DIFERENCIAIS.map((item) => (
              <div className="page-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <ExploreMore current="/institucional" />
        <PageCta />
      </div>
    </>
  );
}

function Compliance() {
  return (
    <>
      <PageHero
        label="Compliance"
        title="Compromisso com a Ética e Integridade"
        sub="Fazer o certo, mesmo quando ninguém está olhando."
        photo="/assets/fotos/porque-painel-interno.jpg"
      />
      <div className="page-body container">
        <Overview
          label="Ética e integridade"
          title="Tolerância zero a fraude e corrupção"
          photo="/assets/fotos/servico-eletrica.jpg"
          photoAlt="Painel de força e comando EMEA Solutions"
        >
          <p>
            Na EMEA Solutions, atuamos com base em valores sólidos e princípios éticos que norteiam
            todas as nossas decisões. Nosso programa de Compliance garante a conformidade com as
            leis, regulamentos e políticas internas, promovendo transparência e integridade em
            todas as operações.
          </p>
          <p>
            Mantemos nossos processos sob constante monitoramento e promovemos treinamentos
            periódicos para que cada decisão esteja em conformidade com nossos valores e com a
            legislação vigente.
          </p>
        </Overview>

        <section className="page-section page-prose">
          <p className="page-narrow">
            Acreditamos que agir com ética é um valor inegociável. Por isso, incentivamos nossos
            colaboradores, fornecedores e parceiros a manterem uma conduta íntegra e responsável,
            reforçando diariamente nossa cultura de conformidade.
          </p>
          <blockquote className="page-quote page-narrow">
            "Fazer o certo, mesmo quando ninguém está olhando — esse é o nosso jeito de fazer
            negócios."
          </blockquote>
        </section>

        <ExploreMore current="/compliance" />
        <PageCta />
      </div>
    </>
  );
}

function Lgpd() {
  return (
    <>
      <PageHero
        label="LGPD"
        title="Privacidade e Proteção de Dados"
        sub="Segurança e governança da informação em conformidade com a Lei nº 13.709/2018."
        photo="/assets/fotos/servico-instrumentacao.jpg"
      />
      <div className="page-body container">
        <Overview
          label="Proteção de dados"
          title="Transparência e finalidade legítima"
          photo="/assets/fotos/servico-automacao.jpg"
          photoAlt="Bornes identificados em painel EMEA Solutions"
        >
          <p>
            A EMEA Solutions respeita e protege a privacidade de todas as pessoas com as quais se
            relaciona — clientes, fornecedores, colaboradores ou parceiros.
          </p>
          <p>
            Em conformidade com a Lei Geral de Proteção de Dados Pessoais, adotamos práticas
            rigorosas de segurança e governança da informação para garantir que todos os dados
            sejam tratados com transparência, finalidade legítima e respeito aos direitos de seus
            titulares.
          </p>
        </Overview>

        <section className="page-section page-prose">
          <p className="page-narrow">
            Todos os dados coletados são utilizados exclusivamente para finalidades relacionadas à
            execução de nossos serviços e obrigações legais, com acesso restrito e monitorado.
          </p>
          <p className="page-narrow">
            Possuímos políticas internas de segurança da informação, controle de acesso e gestão de
            incidentes, reforçando nosso compromisso com a <strong>confidencialidade, integridade e
            disponibilidade das informações.</strong>
          </p>
        </section>

        <ExploreMore current="/lgpd" />
        <PageCta />
      </div>
    </>
  );
}

const QUALIDADE_BULLETS = [
  'Projetos mais seguros e eficientes',
  'Rastreabilidade total dos processos',
  'Padronização de práticas e documentação técnica',
  'Melhoria contínua em todos os níveis da operação',
  'Excelência técnica em cada entrega',
  'Satisfação total do cliente',
];

function Qualidade() {
  return (
    <>
      <PageHero
        label="Qualidade"
        title="Gestão da Qualidade"
        sub="Excelência como cultura — reconhecida pela certificação ISO 9001."
        photo="/assets/fotos/pagina-qualidade.jpg"
      />
      <div className="page-body container">
        <Overview
          label="ISO 9001"
          title="Excelência como cultura"
          photo="/assets/fotos/porque-barramento.jpg"
          photoAlt="Barramento de cobre com controle de torque"
          iso
        >
          <p>
            Na EMEA Solutions, qualidade não é apenas uma etapa do processo — é o DNA da empresa.
            Cada projeto, cada painel, cada entrega carregam o nosso compromisso com a excelência
            técnica e a satisfação total do cliente.
          </p>
          <p>
            Esse padrão foi reconhecido internacionalmente pela nossa certificação ISO 9001, um
            marco que consolida a maturidade da EMEA e reforça nossa busca permanente por
            qualidade, eficiência e melhoria contínua.
          </p>
        </Overview>

        <section className="page-section">
          <h2>Resultados concretos</h2>
          <ul className="page-include-list">
            {QUALIDADE_BULLETS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="page-section">
          <blockquote className="page-quote page-narrow">
            "A ISO 9001 é a prova de que o nosso jeito de fazer engenharia alcançou padrão mundial —
            e isso nos move a ir ainda mais longe."
          </blockquote>
        </section>

        <ExploreMore current="/qualidade" />
        <PageCta />
      </div>
    </>
  );
}

const PAGES: Record<string, FC> = {
  '/institucional': Institucional,
  '/compliance': Compliance,
  '/lgpd': Lgpd,
  '/qualidade': Qualidade,
};

export default function SubPage({ route }: { route: string }) {
  const rootRef = useRef<HTMLElement>(null);
  const Page = PAGES[route];

  usePageReveal(rootRef, route);

  useEffect(() => {
    if (!Page) navigate('/');
  }, [Page]);

  if (!Page) return null;
  return (
    <main className="page" ref={rootRef}>
      <Page />
    </main>
  );
}
