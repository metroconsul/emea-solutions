import { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { withFontsReady, titleReveal, fadeUp, scrollToTarget } from '../lib/animations';
import 'swiper/css';
import 'swiper/css/scrollbar';
import './Servicos.css';

type ServiceCard = {
  kind: 'card';
  id: string;
  tone: 'red' | 'soft' | 'ink';
  title: string;
  intro: string;
  items: string[];
};

type ServiceImage = { kind: 'image'; id: string; img: string; alt: string };

const SLIDES: (ServiceCard | ServiceImage)[] = [
  {
    kind: 'card',
    id: 'eletrica',
    tone: 'red',
    title: 'Elétrica',
    intro:
      'Instalações elétricas industriais completas — do projeto e montagem de painéis à energização — com segurança e conformidade normativa.',
    items: [
      'Desenvolvimento de projetos elétricos industriais',
      'Painéis de força (convencional e TTA) e de comando',
      'CCM, QGBT, QTA e bancos de capacitores',
      'Retrofit de painéis elétricos',
      'Infraestrutura elétrica e cabeamento industrial',
      'Iluminação industrial e áreas classificadas',
      'Laudos e adequações NR-10, NR-12 e SPDA (NBR-5419)',
      'Análise de risco de SPDA',
      'Análise de energia',
      'Termografia de instalações elétricas',
      'Manutenção elétrica industrial',
      'Instalação e manutenção de ar-condicionado',
    ],
  },
  {
    kind: 'image',
    id: 'img-eletrica',
    img: '/assets/fotos/servico-eletrica.jpg',
    alt: 'Painel de força e comando fabricado pela EMEA Solutions',
  },
  {
    kind: 'card',
    id: 'automacao',
    tone: 'soft',
    title: 'Automação',
    intro:
      'Engenharia de automação que aumenta a produtividade e leva sua operação à Indústria 4.0.',
    items: [
      'Projetos e soluções de automação industrial',
      'Painéis de automação e CLPs',
      'Projeto de máquinas',
      'Machine vision',
      'Robótica industrial',
      'Sistemas de manufatura',
      'Segurança de máquinas NR-12',
      'Implementação da Indústria 4.0',
    ],
  },
  {
    kind: 'image',
    id: 'img-automacao',
    img: '/assets/fotos/servico-automacao.jpg',
    alt: 'Painel de passagem com bornes identificados — EMEA Solutions',
  },
  {
    kind: 'card',
    id: 'instrumentacao',
    tone: 'ink',
    title: 'Instrumentação',
    intro:
      'Medição e controle de precisão para processos industriais críticos, da calibração à interligação.',
    items: [
      'Instalação, montagem e comissionamento de instrumentos de campo',
      'Interligação elétrica, pneumática e lógica de instrumentos',
      'Calibração, aferição e validação de instrumentos industriais',
      'Detecção de fluxo, nível e vazão mássica',
      'Medição de sólidos',
    ],
  },
  {
    kind: 'image',
    id: 'img-instrumentacao',
    img: '/assets/fotos/servico-instrumentacao.jpg',
    alt: 'Bornes de interligação identificados em detalhe',
  },
];

export default function Servicos() {
  const rootRef = useRef<HTMLElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;

    const onGotoService = (e: Event) => {
      const index = (e as CustomEvent<number>).detail;
      swiperRef.current?.slideTo(index, 800);
    };
    window.addEventListener('goto-service', onGotoService);

    const cleanup = withFontsReady(root, () => {
      titleReveal(root.querySelector('h2')!);
      fadeUp(root.querySelector('.sub')!, { delay: 0.15 });
      fadeUp(root.querySelector('.servicos-slider')!, { y: 60 });
    });

    return () => {
      window.removeEventListener('goto-service', onGotoService);
      cleanup();
    };
  }, []);

  return (
    <section className="section servicos" id="servicos" ref={rootRef}>
      <div className="container">
        <div className="sec-head">
          <span className="sec-label">Serviços</span>
          <div className="sec-title-block">
            <h2>Nossos serviços</h2>
            <p className="sub">
              Soluções em Elétrica, Automação e Instrumentação que elevam a eficiência e a
              segurança da sua operação.
            </p>
          </div>
        </div>
      </div>

      <div className="servicos-slider container">
        <Swiper
          modules={[Navigation, Scrollbar]}
          slidesPerView="auto"
          spaceBetween={20}
          grabCursor
          scrollbar={{ el: '.servicos-scrollbar', draggable: true }}
          navigation={{ prevEl: '.servicos-prev', nextEl: '.servicos-next' }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {SLIDES.map((slide) =>
            slide.kind === 'card' ? (
              <SwiperSlide key={slide.id} className="servico-slide servico-slide-card">
                <article className={`servico-card tone-${slide.tone}`} id={slide.id}>
                  <h3>{slide.title}</h3>
                  <p className="servico-intro">{slide.intro}</p>
                  <ul className="servico-items">
                    {slide.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <button
                    className="btn servico-btn"
                    onClick={() => scrollToTarget('#contato')}
                    aria-label={`Saiba mais sobre ${slide.title}`}
                  >
                    Saiba mais <span className="arrow">→</span>
                  </button>
                </article>
              </SwiperSlide>
            ) : (
              <SwiperSlide key={slide.id} className="servico-slide servico-slide-image">
                <img src={slide.img} alt={slide.alt} loading="lazy" />
              </SwiperSlide>
            ),
          )}
        </Swiper>

        <div className="servicos-controls">
          <div className="servicos-scrollbar" />
          <div className="servicos-arrows">
            <button className="servicos-prev" aria-label="Serviço anterior">←</button>
            <button className="servicos-next" aria-label="Próximo serviço">→</button>
          </div>
        </div>
      </div>
    </section>
  );
}
