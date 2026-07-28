import { useEffect, useRef, useState } from 'react';
import './Whatsapp.css';

const CONTACTS = [
  { label: 'Comercial 01', phone: '(12) 97402-0869', wa: '5512974020869' },
  { label: 'Comercial 02', phone: '(12) 99213-8686', wa: '5512992138686' },
];

export default function Whatsapp() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <div className="wa" ref={rootRef}>
      <div className={`wa-pop${open ? ' is-open' : ''}`} role="dialog" aria-label="Fale conosco no WhatsApp">
        <span className="wa-pop-title">Fale com nosso especialista</span>
        {CONTACTS.map((c) => (
          <a
            key={c.wa}
            className="wa-option"
            href={`https://wa.me/${c.wa}?text=${encodeURIComponent('Olá! Vim pelo site da EMEA Solutions e gostaria de falar com um especialista.')}`}
            target="_blank"
            rel="noreferrer"
          >
            <span className="wa-option-label">{c.label}</span>
            <span className="wa-option-phone">{c.phone}</span>
          </a>
        ))}
      </div>
      <button
        className="wa-fab"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Falar no WhatsApp com nosso especialista"
      >
        <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
          <path d="M16 3C9.4 3 4 8.3 4 14.9c0 2.6.8 5 2.3 7L4 29l7.3-2.3c1.5.8 3 1.2 4.7 1.2 6.6 0 12-5.3 12-11.9S22.6 3 16 3zm0 21.8c-1.5 0-3-.4-4.3-1.1l-.3-.2-4.4 1.4 1.4-4.2-.2-.3a9.8 9.8 0 0 1-1.9-5.5c0-5.4 4.4-9.8 9.7-9.8s9.7 4.4 9.7 9.8-4.4 9.9-9.7 9.9zm5.4-7.3c-.3-.2-1.7-.9-2-1s-.5-.2-.7.1-.8 1-.9 1.1-.3.2-.6.1a8 8 0 0 1-2.4-1.5 8.8 8.8 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5s0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.3 5.1 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.7-.4z" />
        </svg>
      </button>
    </div>
  );
}
