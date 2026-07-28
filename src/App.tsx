import { useEffect, useState } from 'react';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Setores from './components/Setores';
import Servicos from './components/Servicos';
import Clientes from './components/Clientes';
import InfoBoxes from './components/InfoBoxes';
import Contato from './components/Contato';
import Footer from './components/Footer';
import Whatsapp from './components/Whatsapp';
import SubPage from './pages/SubPage';
import { initSmoothScroll, getLenis, ScrollTrigger } from './lib/animations';
import { useRoute } from './lib/router';

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const route = useRoute();

  useEffect(() => {
    window.scrollTo(0, 0);
    const lenis = initSmoothScroll();
    // dev hook (same convention as the other recreations)
    (window as unknown as { lenis: unknown }).lenis = lenis;
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }, []);

  useEffect(() => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [route]);

  return (
    <>
      {!loaded && <Preloader onDone={() => setLoaded(true)} />}
      <Navbar />
      {route === '/' ? (
        <main>
          <Hero started={loaded} />
          <Setores />
          <Servicos />
          <Clientes />
          <InfoBoxes />
          <Contato />
        </main>
      ) : (
        <SubPage route={route} />
      )}
      <Footer />
      <Whatsapp />
    </>
  );
}
