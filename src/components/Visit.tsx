import { useRef } from "react";
import { useSectionMotion } from "../hooks/useSectionMotion";
import { Magnetic } from "./Magnetic";
import { SectionLabel } from "./SectionLabel";
import { useAnchorScroll } from "./SmoothScroll";

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M3 9h12M11 4.5 15.5 9 11 13.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function Visit() {
  const root = useRef<HTMLElement>(null);
  const scrollTo = useAnchorScroll();
  useSectionMotion(root);

  return (
    <section ref={root} id="visita" className="scroll-mt-16 border-t border-line">
      <div className="wrap py-20 md:py-32">
        <div className="flex justify-center">
          <SectionLabel index="07" label="Visita" />
        </div>
        <h2 data-reveal-block className="headline display mt-8 text-center" aria-label="La torrefazione è aperta a chi vuole conoscerla.">
          <span className="line">
            <span className="line-inner" data-reveal>
              La torrefazione è aperta
            </span>
          </span>
          <span className="line">
            <span className="line-inner" data-reveal>
              a chi vuole conoscerla.
            </span>
          </span>
        </h2>

        <div className="mx-auto mt-12 max-w-[46ch] space-y-5 text-center text-muted md:mt-16">
          <p>Orma nasce in Valle d’Aosta, dove selezioniamo, tostiamo e confezioniamo i nostri caffè.</p>
          <p>
            È possibile visitare la torrefazione su appuntamento e assistere al lavoro durante una giornata di
            tostatura, conoscere le origini disponibili e assaggiare i caffè della selezione.
          </p>
          <p>Se vuoi venire a trovarci, scrivici per concordare una visita.</p>
        </div>
        <div className="mt-10 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
            <Magnetic>
              <a className="btn btn-fill" href="mailto:visita@orma.coffee">
                Prenota una visita
                <Arrow />
              </a>
            </Magnetic>
            <Magnetic pull={0.4}>
              <a
                className="btn btn-quiet"
                href="#selezione"
              onClick={(event) => {
                event.preventDefault();
                scrollTo("#selezione");
              }}
            >
                Scopri l’abbonamento
              </a>
            </Magnetic>
        </div>

        <div className="mt-16 grid gap-8 border-t border-line pt-8 text-center text-sm sm:grid-cols-3">
          <p>Località Pian di Lenta, Valle d’Aosta</p>
          <p>
            <a className="link-draw tap-link" href="mailto:visita@orma.coffee">
              visita@orma.coffee
            </a>
            <br />
            <a className="link-draw tap-link" href="tel:+390165440218">
              +39 0165 440 218
            </a>
          </p>
          <p className="text-muted">Dal martedì al sabato, su appuntamento.</p>
        </div>
        <p className="mx-auto mt-10 max-w-[42ch] text-center text-sm text-muted">
          Microtorrefazione indipendente. Caffè di specialità tostati in piccoli lotti in Valle d’Aosta.
        </p>
      </div>
    </section>
  );
}
