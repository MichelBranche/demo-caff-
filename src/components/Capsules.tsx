import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { capsules } from "../content";
import { useSectionMotion } from "../hooks/useSectionMotion";
import { gsap } from "../lib/gsap";
import { SectionLabel } from "./SectionLabel";
import { SpecRows } from "./SpecRows";

export function Capsules() {
  const root = useRef<HTMLElement>(null);
  useSectionMotion(root);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      section.querySelectorAll<HTMLElement>("[data-capsule]").forEach((capsule) => {
        const frame = capsule.parentElement;
        if (!frame) return;
        gsap.fromTo(
          capsule,
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
    <section ref={root} id="capsule" className="scroll-mt-20 border-t border-line py-20 md:py-28">
      <div className="wrap">
        <SectionLabel index="06" label="Capsule" />
        <h2 data-reveal-block className="headline display mt-8 text-center">
          <span className="line">
            <span className="line-inner" data-reveal>
              Le stesse origini, in capsula.
            </span>
          </span>
        </h2>
        <div className="mx-auto mt-8 max-w-[46ch] space-y-5 text-center text-muted">
          <p>
            Gli stessi tre caffè della selezione, confezionati in capsule. Per chi vuole l’espresso di Orma
            senza macinare.
          </p>
          <p>Ogni capsula contiene il caffè tostato in torrefazione, dopo il riposo.</p>
        </div>

        <div className="mt-6 md:mt-10">
          {capsules.map((capsule) => (
            <article
              key={capsule.name}
              className="price-row grid items-center gap-8 border-t border-line py-12 md:grid-cols-12 md:gap-16 md:py-16"
            >
              <div className="relative aspect-square overflow-hidden bg-[#efe6dc] md:col-span-5" data-frame>
                <img
                  data-capsule
                  src={capsule.image}
                  alt={capsule.alt}
                  className="absolute top-0 left-1/2 h-[112%] w-auto max-w-none"
                  width="1280"
                  height="720"
                />
              </div>
              <div className="md:col-span-6 md:col-start-7">
                <h3 className="headline text-[clamp(2.4rem,4vw,3.6rem)]">{capsule.measure}</h3>
                <p className="mt-2 text-lg">{capsule.name}</p>
                <p className="mt-4 flex items-baseline gap-3">
                  <span className="numeral numeral-price text-[clamp(1.7rem,2.4vw,2.35rem)]">{capsule.price}</span>
                  <span className="text-muted">· {capsule.weight}</span>
                </p>
                <p className="mt-3 max-w-[36ch] text-muted">{capsule.line}</p>
                <div className="mt-8 border-b border-line">
                  <SpecRows
                    rows={[
                      { label: "Note", value: capsule.notes },
                      { label: "Tostatura", value: capsule.roast },
                      { label: "Formato", value: capsule.format },
                    ]}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="pt-8 text-sm text-muted">Prezzi indicativi. Capsule compatibili con i sistemi più diffusi.</p>
      </div>
    </section>
  );
}
