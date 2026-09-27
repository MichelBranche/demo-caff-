import { useRef } from "react";
import { SectionLabel } from "./SectionLabel";
import { useSectionMotion } from "../hooks/useSectionMotion";

export function Manifesto() {
  const root = useRef<HTMLElement>(null);
  useSectionMotion(root);

  return (
    <section ref={root} id="metodo" className="py-20 md:py-32">
      <div className="wrap">
        <div className="flex justify-center">
          <SectionLabel index="02" label="Metodo" />
        </div>
        <h2 data-reveal-block className="headline display mt-8 text-center" aria-label="Ogni caffè richiede il suo approccio.">
          <span className="line">
            <span className="line-inner" data-reveal>
              Ogni caffè richiede
            </span>
          </span>
          <span className="line">
            <span className="line-inner" data-reveal>
              il suo approccio.
            </span>
          </span>
        </h2>
        <div className="mt-10 grid gap-x-8 gap-y-8 text-muted md:mt-14 md:grid-cols-2 md:gap-x-16 md:gap-y-10 lg:gap-x-24">
          <p>
            Non tutti i caffè hanno lo stesso carattere e non li trattiamo allo stesso modo.
          </p>
          <p>
            La scelta della tostatura parte dall’origine, dal processo e dal profilo che vogliamo ottenere in
            tazza.
          </p>
          <p>
            Lavoriamo con tre linee: caffè pensati per il consumo quotidiano, selezioni più morbide e versatili
            per la tavola e piccoli lotti provenienti da origini particolari.
          </p>
          <p>
            La tostatura avviene in piccoli batch, con il calore controllato durante tutto il processo.
            L’obiettivo è valorizzare ciò che rende ogni caffè riconoscibile, senza coprirlo con la tostatura.
          </p>
        </div>
      </div>
    </section>
  );
}
