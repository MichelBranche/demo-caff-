import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { coffees } from "../content";
import { useSectionMotion } from "../hooks/useSectionMotion";
import { gsap } from "../lib/gsap";
import { SectionLabel } from "./SectionLabel";
import { SpecRows } from "./SpecRows";

export function Shop() {
  const root = useRef<HTMLElement>(null);
  useSectionMotion(root);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      section.querySelectorAll<HTMLElement>("[data-pack]").forEach((pack) => {
        const frame = pack.parentElement;
        if (!frame) return;
        gsap.fromTo(
          pack,
          { xPercent: -49, yPercent: -2 },
          {
            xPercent: -49,
            yPercent: -10,
            ease: "none",
            scrollTrigger: {
              trigger: frame,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="selezione" className="scroll-mt-20 py-20 md:py-28">
      <div className="wrap">
        <SectionLabel index="05" label="Selezione" />
        <h2 data-reveal-block className="headline display mt-8 text-center">
          <span className="line">
            <span className="line-inner" data-reveal>
              La selezione di Orma.
            </span>
          </span>
        </h2>
        <div className="mx-auto mt-8 max-w-[46ch] space-y-5 text-center text-muted">
          <p>
            Tre caffè, tre profili diversi. Dalla nostra proposta quotidiana ai piccoli lotti disponibili solo
            per un periodo limitato.
          </p>
          <p>Tutti i caffè vengono tostati in torrefazione e confezionati dopo il periodo di riposo necessario.</p>
        </div>

        <div className="mt-6 md:mt-10">
          {coffees.map((coffee) => (
            <article
              key={coffee.name}
              className="price-row grid items-center gap-8 border-t border-line py-12 md:grid-cols-12 md:gap-16 md:py-16"
            >
              <div className="relative aspect-square overflow-hidden bg-[#efe6dc] md:col-span-5" data-frame>
                <img
                  data-pack
                  src={coffee.image}
                  alt={coffee.alt}
                  className="absolute top-0 left-1/2 h-[112%] w-auto max-w-none"
                  width="1280"
                  height="720"
                />
              </div>
              <div className="md:col-span-6 md:col-start-7">
                <h3 className="headline text-[clamp(2.4rem,4vw,3.6rem)]">{coffee.measure}</h3>
                <p className="mt-2 text-lg">{coffee.name}</p>
                <p className="mt-4 flex items-baseline gap-3">
                  <span className="numeral numeral-price text-[clamp(1.7rem,2.4vw,2.35rem)]">{coffee.price}</span>
                  <span className="text-muted">· {coffee.weight}</span>
                </p>
                <p className="mt-3 max-w-[36ch] text-muted">{coffee.line}</p>
                <div className="mt-8 border-b border-line">
                  <SpecRows
                    rows={[
                      { label: "Note", value: coffee.notes },
                      { label: "Tostatura", value: coffee.roast },
                      { label: "Processo", value: coffee.process },
                    ]}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="pt-8 text-sm text-muted">Prezzi indicativi.</p>
        <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-muted">
          È disponibile anche un abbonamento mensile con due confezioni da 250 g, spedite il giorno della
          tostatura.
        </p>
      </div>
    </section>
  );
}
