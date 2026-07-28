import { useEffect, useRef, useState, type FormEvent } from 'react';
import { withFontsReady, titleReveal, fadeUp } from '../lib/animations';
import './Contato.css';

const ASSUNTOS = ['Serviços', 'Parceria', 'Outro'];

export default function Contato() {
  const rootRef = useRef<HTMLElement>(null);
  const [assunto, setAssunto] = useState('Serviços');

  useEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;
    return withFontsReady(root, () => {
      titleReveal(root.querySelector('h2')!);
      fadeUp(root.querySelector('.sub')!, { delay: 0.15 });
      fadeUp(root.querySelector('.contato-info')!, { y: 50 });
      fadeUp(root.querySelector('.contato-form')!, { y: 50, delay: 0.1 });
    });
  }, []);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const body = [
      `Nome: ${data.get('nome')}`,
      `E-mail: ${data.get('email')}`,
      `Telefone: ${data.get('telefone')}`,
      `Empresa: ${data.get('empresa')}`,
      '',
      `${data.get('mensagem')}`,
    ].join('\n');
    const subject = `[Site] ${assunto} — ${data.get('nome')}`;
    window.location.href = `mailto:comercial@emeasolutions.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section className="section contato" id="contato" ref={rootRef}>
      <div className="container">
        <div className="sec-head">
          <span className="sec-label">Contato</span>
          <div className="sec-title-block">
            <h2>
              Vamos falar sobre o <em>seu projeto?</em>
            </h2>
            <p className="sub">Preencha o formulário ou fale conosco pelos canais ao lado.</p>
          </div>
        </div>

        <div className="contato-grid">
          <aside className="contato-info">
            <div className="contato-info-block">
              <span className="contato-info-label">E-mail</span>
              <a href="mailto:comercial@emeasolutions.com.br">comercial@emeasolutions.com.br</a>
            </div>
            <div className="contato-info-block">
              <span className="contato-info-label">Telefone</span>
              <a href="tel:+551239511623">(12) 3951-1623</a>
            </div>
            <div className="contato-info-block">
              <span className="contato-info-label">WhatsApp</span>
              <a href="https://wa.me/5512974020869" target="_blank" rel="noreferrer">
                (12) 97402-0869 · Comercial 01
              </a>
              <a href="https://wa.me/5512992138686" target="_blank" rel="noreferrer">
                (12) 99213-8686 · Comercial 02
              </a>
            </div>
            <div className="contato-info-block">
              <span className="contato-info-label">Endereço</span>
              <p>
                Av. Egídio Antônio Coimbra, 441
                <br />
                Parque dos Sinos
                <br />
                Jacareí – SP
              </p>
            </div>
            <div className="contato-info-block">
              <span className="contato-info-label">Horário</span>
              <p>Segunda a sexta, 8h–18h</p>
            </div>
            <a className="btn btn-red contato-info-btn" href="mailto:comercial@emeasolutions.com.br">
              Enviar e-mail <span className="arrow">→</span>
            </a>
          </aside>

          <form className="contato-form" onSubmit={onSubmit}>
            <div className="form-row">
              <label className="form-field">
                <span>Nome</span>
                <input name="nome" type="text" placeholder="Seu nome" required />
              </label>
              <label className="form-field">
                <span>E-mail</span>
                <input name="email" type="email" placeholder="seu@email.com" required />
              </label>
            </div>
            <div className="form-row">
              <label className="form-field">
                <span>Telefone</span>
                <input name="telefone" type="tel" placeholder="(12) 90000-0000" />
              </label>
              <label className="form-field">
                <span>Empresa</span>
                <input name="empresa" type="text" placeholder="Sua empresa" />
              </label>
            </div>
            <div className="form-field">
              <span>Assunto</span>
              <div className="form-pills" role="radiogroup" aria-label="Assunto">
                {ASSUNTOS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    role="radio"
                    aria-checked={assunto === item}
                    className={`form-pill${assunto === item ? ' is-active' : ''}`}
                    onClick={() => setAssunto(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <label className="form-field">
              <span>Mensagem</span>
              <textarea name="mensagem" rows={4} placeholder="Escreva sua mensagem" required />
            </label>
            <button type="submit" className="btn btn-red contato-submit">
              Enviar <span className="arrow">→</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
