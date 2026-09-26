import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { beginScrollPass, endScrollPass } from "../lib/scrollPass";

const ScrollContext = createContext<(target: string) => void>(() => {});

export function useAnchorScroll() {
  return useContext(ScrollContext);
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.12,
      smoothWheel: true,
      touchMultiplier: 1.05,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);
    lenisRef.current = lenis;
    window.__lenis = lenis;
    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refresh);
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
      delete window.__lenis;
    };
  }, []);

  const scrollTo = (target: string) => {
    const node = document.querySelector(target);
    if (!(node instanceof HTMLElement)) return;
    const lenis = lenisRef.current;
    if (lenis) {
      const pass = beginScrollPass();
      lenis.start();
      lenis.scrollTo(node, {
        offset: -8,
        force: true,
        onComplete: () => endScrollPass(pass),
      });
      return;
    }
    node.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return <ScrollContext.Provider value={scrollTo}>{children}</ScrollContext.Provider>;
}
