import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/animations';
import './Preloader.css';

/** Fullscreen preloader: counts 0 → 100% then slides away. */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    if (prefersReducedMotion()) {
      document.body.style.overflow = '';
      onDone();
      return;
    }

    const proxy = { value: 0 };
    const tl = gsap.timeline();
    tl.to(proxy, {
      value: 100,
      duration: 2.2,
      ease: 'power1.inOut',
      onUpdate: () => {
        if (countRef.current) {
          countRef.current.textContent = `${Math.round(proxy.value)}%`;
        }
      },
    });
    tl.to(rootRef.current, {
      yPercent: -100,
      duration: 0.95,
      ease: 'power4.inOut',
      delay: 0.25,
      onComplete: () => {
        document.body.style.overflow = '';
        onDone();
      },
    });

    return () => {
      tl.kill();
      document.body.style.overflow = '';
    };
  }, [onDone]);

  return (
    <div className="preloader" ref={rootRef} aria-hidden="true">
      <img className="preloader-logo" src="/assets/logo.png" alt="" />
      <div className="preloader-bottom">
        <span>Carregando...</span>
        <span className="preloader-count" ref={countRef}>
          0%
        </span>
      </div>
    </div>
  );
}
