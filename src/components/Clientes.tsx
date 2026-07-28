import { useEffect, useRef, useState } from 'react';
import { withFontsReady, titleReveal, fadeUp } from '../lib/animations';
import { goToSection } from '../lib/router';
import './Clientes.css';

// Logos oficiais podem substituir os arquivos em /assets/clients/ mantendo os nomes.
// Se uma imagem falhar, o card exibe o nome estilizado.
const CLIENTES: { name: string; file: string }[] = [
  { name: 'Cargill', file: 'cargill.svg' },
  { name: 'Bayer', file: 'bayer.svg' },
  { name: 'Gerdau', file: 'gerdau.svg' },
  { name: 'Pilkington', file: 'pilkington.svg' },
  { name: 'Embraer', file: 'embraer.svg' },
  { name: 'Cimed', file: 'cimed.svg' },
  { name: 'Gates', file: 'gates.png' },
  { name: 'Sabesp', file: 'sabesp.svg' },
  { name: 'ICL', file: 'icl.svg' },
  { name: 'Adium', file: 'adium.png' },
  { name: 'Valmet', file: 'valmet.svg' },
  { name: 'Parker', file: 'parker.svg' },
  { name: 'J.Macêdo', file: 'jmacedo.svg' },
  { name: 'Tarkett', file: 'tarkett.svg' },
  { name: 'Althaia', file: 'althaia.png' },
  { name: 'Instituto Butantan', file: 'butantan.png' },
  { name: 'Vibrantz', file: 'vibrantz.png' },
  { name: 'Zuiko', file: 'zuiko.png' },
  { name: 'Wana Química', file: 'wana.png' },
  { name: 'Cibal Guaranitá', file: 'guaranita.png' },
  { name: 'Cebrace', file: 'cebrace.png' },
  { name: 'Rede D\'Or São Luiz', file: 'saoluiz.png' },
  { name: 'JPaulin Construtora', file: 'jpa.png' },
  { name: 'A.V.A. Engenharia', file: 'ava.png' },
  { name: 'APVE Embraer', file: 'apve.png' },
];

const half = Math.ceil(CLIENTES.length / 2);
const ROW_A = CLIENTES.slice(0, half);
const ROW_B = CLIENTES.slice(half);

function ClienteCard({ name, file }: { name: string; file: string }) {
  const [imgOk, setImgOk] = useState(true);
  return (
    <div className={`cliente-card${imgOk ? '' : ' is-text'}`}>
      {imgOk ? (
        <img
          src={`/assets/clients/${file}`}
          alt={name}
          title={name}
          loading="lazy"
          onError={() => setImgOk(false)}
        />
      ) : (
        <span className="cliente-name">{name}</span>
      )}
    </div>
  );
}

/** Continuous logo marquee: the track holds the list 4x and slides by -50%,
 *  so the loop is seamless. Hover pauses (CSS animation-play-state). */
function MarqueeRow({ clientes, reverse }: { clientes: typeof CLIENTES; reverse?: boolean }) {
  const quadrupled = [...clientes, ...clientes, ...clientes, ...clientes];
  return (
    <div className={`marquee${reverse ? ' marquee-reverse' : ''}`}>
      <div className="marquee-track">
        {quadrupled.map((cliente, i) => (
          <div key={`${cliente.file}-${i}`} aria-hidden={i >= clientes.length}>
            <ClienteCard {...cliente} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Clientes() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;
    return withFontsReady(root, () => {
      titleReveal(root.querySelector('h2')!);
      fadeUp(root.querySelector('.clientes-aside')!, { delay: 0.1 });
      fadeUp(root.querySelector('.clientes-rows')!, { y: 50 });
    });
  }, []);

  return (
    <section className="section clientes" id="clientes" ref={rootRef}>
      <div className="container">
        <div className="sec-head clientes-head">
          <span className="sec-label">Clientes</span>
          <h2>Alguns de nossos clientes</h2>
          <div className="clientes-aside">
            <p>
              Atendemos indústrias líderes de diferentes segmentos — entregando impacto em escala
              desde 2018.
            </p>
            <button className="btn btn-red" onClick={() => goToSection('#contato')}>
              Seja um cliente <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </div>

      <div className="clientes-rows">
        <MarqueeRow clientes={ROW_A} />
        <MarqueeRow clientes={ROW_B} reverse />
      </div>
    </section>
  );
}
