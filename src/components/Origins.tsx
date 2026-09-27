import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { origins, plantPhotos } from "../content";
import { useSectionMotion } from "../hooks/useSectionMotion";
import { gsap } from "../lib/gsap";
import { SectionLabel } from "./SectionLabel";
import { SpecRows } from "./SpecRows";

export function Origins() {
  const root = useRef<HTMLElement>(null);
  useSectionMotion(root);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      section.querySelectorAll<HTMLElement>("[data-plant]").forEach((photo) => {
        const frame = photo.parentElement;
        if (!frame) return;
        gsap.fromTo(
          photo,
          { yPercent: -5 },
          {
            yPercent: -18,
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
    <section ref={root} id="origini" className="scroll-mt-20 border-t border-line py-20 md:py-28">
      <div className="wrap">
        <div className="flex justify-center">
          <SectionLabel index="03" label="Origini" />
        </div>
        <h2
          data-reveal-block
          className="headline mt-8 text-center text-[clamp(2.5rem,4.6vw,4.4rem)]"
          aria-label="Conosciamo da dove viene il nostro caffè."
        >
          <span className="line">
            <span className="line-inner" data-reveal>
              Conosciamo da dove
            </span>
          </span>
          <span className="line">
            <span className="line-inner" data-reveal>
              viene il nostro caffè.
            </span>
          </span>
        </h2>
        <div className="mt-10 grid gap-x-8 gap-y-8 text-muted md:mt-14 md:grid-cols-2 md:gap-x-16 md:gap-y-10 lg:gap-x-24">
          <p>
            Selezioniamo poche origini e lavoriamo su lotti che conosciamo e possiamo seguire nel tempo.
            Altitudine, varietà, processo e raccolto contribuiscono a definire il carattere di ogni caffè.
          </p>
          <p>
            Per questo raccontiamo ogni origine attraverso i suoi dati e le sue note di assaggio: per capire
            cosa c’è dentro ogni tazza, prima ancora di prepararla.
          </p>
        </div>

        <ol className="mt-16 md:mt-24">
          {origins.map((origin, index) => {
            const photo = plantPhotos[index];
            const photoOnRight = index % 2 === 1;
            return (
              <li
                key={origin.country}
                data-origin
                className="grid items-center gap-8 border-t border-line py-10 md:grid-cols-12 md:gap-x-16 md:py-16"
              >
                <figure className={photoOnRight ? "md:col-span-5 md:col-start-8" : "md:col-span-5"}>
                  <div className="relative aspect-[5/4] overflow-hidden bg-paper-deep" data-frame>
                    <picture>
                      <source srcSet={photo.avif} type="image/avif" />
                      <source srcSet={photo.webp} type="image/webp" />
                      <img
                        data-plant
                        src={photo.src}
                        alt={photo.alt}
                        className="absolute top-0 left-0 h-[132%] w-full max-w-none object-cover"
                        width={photo.width}
                        height={photo.height}
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                  </div>
                  <figcaption className="mt-3 text-sm text-muted">{photo.caption}</figcaption>
                </figure>
                <div
                  className={
                    photoOnRight
                      ? "md:col-span-6 md:col-start-1 md:row-start-1"
                      : "md:col-span-6 md:col-start-7"
                  }
                >
                  <div className="flex items-baseline gap-4">
                    <span className="numeral text-sm text-muted">{origin.index} —</span>
                    <h3 className="headline text-[clamp(2.2rem,3.6vw,3.4rem)]">{origin.country}</h3>
                  </div>
                  <p className="mt-2 text-muted">{origin.place}</p>
                  <div className="mt-6 border-b border-line">
                    <SpecRows
                      rows={[
                        { label: "Note", value: origin.notes },
                        { label: "Processo", value: origin.process },
                        { label: "Altitudine", value: origin.altitude },
                      ]}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
