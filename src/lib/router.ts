import { useEffect, useState } from 'react';
import { scrollToTarget } from './animations';

/** Hash-based routes: '#/institucional' → '/institucional'. Plain hash-less URL → '/'. */
const getRoute = () => (location.hash.startsWith('#/') ? location.hash.slice(1).replace(/\/$/, '') || '/' : '/');

export function useRoute(): string {
  const [route, setRoute] = useState(getRoute);
  useEffect(() => {
    const onChange = () => setRoute(getRoute());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export function navigate(route: string) {
  location.hash = `/${route.replace(/^\//, '')}`;
}

/** Scrolls to a home-page section, navigating back home first if needed. */
export function goToSection(target: string) {
  if (getRoute() !== '/') {
    navigate('/');
    setTimeout(() => scrollToTarget(target), 300);
  } else {
    scrollToTarget(target);
  }
}

/** Scrolls to the services slider and slides to a specific card (0 = Elétrica, 2 = Automação, 4 = Instrumentação). */
export function goToService(slide: number) {
  const delay = getRoute() !== '/' ? 350 : 50;
  goToSection('#servicos');
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('goto-service', { detail: slide }));
  }, delay);
}
