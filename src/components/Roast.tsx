import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { roastSteps } from "../content";
import { gsap, Observer, ScrollTrigger } from "../lib/gsap";
import { SectionLabel } from "./SectionLabel";

const beans = [
  { webp: "/media/roast/bean-1-verde.webp", png: "/media/roast/bean-1-verde.png" },
  { webp: "/media/roast/bean-2-chiara.webp", png: "/media/roast/bean-2-chiara.png" },
  { webp: "/media/roast/bean-3-media.webp", png: "/media/roast/bean-3-media.png" },
  { webp: "/media/roast/bean-4-scura.webp", png: "/media/roast/bean-4-scura.png" },
] as const;

const panel =
  "roast-panel flex h-full w-[100cqi] shrink-0 items-center pt-20 pb-24 motion-reduce:h-auto motion-reduce:w-auto motion-reduce:py-16 md:pt-24 md:pb-28";

export function Roast() {
  const root = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    for (const bean of beans) {
      const img = new Image();
      img.src = bean.webp;
    }
  }, []);

  useGSAP(
    () => {
      const section = root.current;
      const pin = pinRef.current;
      const track = trackRef.current;
      const fill = fillRef.current;
      if (!section || !pin || !track || !fill) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const labels = section.querySelectorAll<HTMLElement>("[data-roast-label]");
      const count = () => track.children.length;
      const calls: gsap.core.Tween[] = [];
      let index = 0;
      let glide = 0;
      let travel = 0;
      let cool = false;
      let locked = false;
      let passing = false;

      const later = (delay: number, fn: () => void) => {
        const tween = gsap.delayedCall(delay, fn);
        calls.push(tween);
        return tween;
      };

      const setActive = (panel: number) => {
        labels.forEach((label, labelIndex) => {
          label.classList.toggle("is-active", labelIndex === panel - 1);
        });
      };

      const place = (panel: number, animate: boolean) => {
        index = panel;
        const progress = count() > 1 ? panel / (count() - 1) : 0;
        const x = () => -index * pin.clientWidth;
        setActive(panel);
        if (!animate) {
          glide += 1;
          gsap.killTweensOf([track, fill]);
          gsap.set(track, { x: x() });
          gsap.set(fill, { scaleX: progress, transformOrigin: "left center" });
          return;
        }
        const id = ++glide;
        gsap.to(track, {
          x,
          duration: 1.15,
          ease: "sine.inOut",
          overwrite: "auto",
          onComplete: () => {
            if (id === glide) cool = false;
          },
        });
        gsap.to(fill, {
          scaleX: progress,
          duration: 1.15,
          ease: "sine.inOut",
          overwrite: "auto",
          transformOrigin: "left center",
        });
      };

      gsap.set(fill, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(track, { x: 0 });
      setActive(0);

      const leave = (direction: 1 | -1) => {
        if (passing) return;
        passing = true;
        cool = false;
        locked = false;
        observer.disable();
        gsap.killTweensOf([track, fill]);
        const trigger = ScrollTrigger.getById("roast-steps");
        const lenis = window.__lenis;
        if (lenis && trigger) {
          const y = direction > 0 ? trigger.end + 12 : Math.max(0, trigger.start - 24);
          lenis.start();
          lenis.scrollTo(y, { immediate: true, force: true });
        } else {
          lenis?.start();
        }
        later(0.7, () => {
          passing = false;
        });
      };

      const step = (direction: 1 | -1) => {
        if (!locked || passing) return;
        if (cool && direction === travel) return;
        const next = index + direction;
        if (next < 0 || next >= count()) {
          if (cool) return;
          leave(direction);
          return;
        }
        travel = direction;
        cool = true;
        place(next, true);
      };

      const observer = Observer.create({
        target: window,
        type: "wheel,touch",
        tolerance: 8,
        debounce: false,
        preventDefault: true,
        onDown: () => step(1),
        onUp: () => step(-1),
      });
      observer.disable();

      const engage = (trigger: ScrollTrigger, panel: number) => {
        if (passing || locked) return;
        locked = true;
        cool = true;
        travel = 0;
        observer.enable();
        window.__lenis?.stop();
        place(panel, false);
        const lenis = window.__lenis;
        const y = trigger.start + 1;
        if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
        else window.scrollTo(0, y);
        later(0.4, () => {
          if (locked) cool = false;
        });
      };

      const disengage = () => {
        if (passing) return;
        locked = false;
        cool = false;
        observer.disable();
        window.__lenis?.start();
      };

      ScrollTrigger.create({
        id: "roast-steps",
        trigger: pin,
        pin: true,
        start: "top top",
        end: () => `+=${Math.round(Math.min(140, window.innerHeight * 0.16))}`,
        invalidateOnRefresh: true,
        onEnter: (self) => engage(self, 0),
        onEnterBack: (self) => engage(self, count() - 1),
        onLeave: disengage,
        onLeaveBack: disengage,
      });

      const sync = () => {
        gsap.set(track, { x: -index * pin.clientWidth });
      };
      ScrollTrigger.addEventListener("refresh", sync);

      return () => {
        calls.forEach((tween) => tween.kill());
        observer.kill();
        ScrollTrigger.removeEventListener("refresh", sync);
        window.__lenis?.start();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} id="tostatura" className="scroll-mt-16 border-t border-line">
      <div
        ref={pinRef}
        className="relative h-svh overflow-hidden [container-type:inline-size] motion-reduce:h-auto motion-reduce:overflow-visible"
      >
        <div ref={trackRef} className="flex h-full motion-reduce:block motion-reduce:h-auto">
          <div className={panel}>
            <div className="wrap">
              <SectionLabel index="04" label="Tostatura" />
              <h2 className="headline display mt-8 text-center">Dalla selezione alla tazza.</h2>
              <p className="mx-auto mt-6 max-w-[48ch] text-center text-muted">
                Ogni lotto viene controllato e tostato separatamente. Seguiamo il caffè durante tutte le fasi
                della lavorazione, dalla materia prima al riposo dopo la tostatura.
              </p>
            </div>
          </div>

          {roastSteps.map((step, index) => {
            const bean = beans[index];
            return (
              <article key={step.index} data-roast-step className={panel}>
                <div className="wrap grid items-center gap-8 md:grid-cols-12 md:gap-10">
                  <div className="md:col-span-6">
                    <p className="numeral text-sm text-muted">{step.index} —</p>
                    <h3 className="headline mt-3 text-[clamp(2.4rem,4.4vw,4.2rem)]">{step.title}</h3>
                    <p className="mt-5 max-w-[38ch] text-muted">{step.body}</p>
                  </div>
                  {bean ? (
                    <div className="md:col-span-5 md:col-start-8">
                      <div className="bean-frame">
                        <picture className="bean-shot">
                          <source srcSet={bean.webp} type="image/webp" />
                          <img
                            src={bean.png}
                            alt=""
                            width="1600"
                            height="1200"
                            decoding="async"
                            fetchPriority={index === 0 ? "high" : "low"}
                          />
                        </picture>
                      </div>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 pb-6 motion-reduce:hidden md:pb-8">
          <div className="wrap">
            <div className="h-px w-full bg-line">
              <span ref={fillRef} className="block h-px w-full origin-left scale-x-0 bg-ink" />
            </div>
            <ol className="mt-3 grid grid-cols-4 gap-2">
              {roastSteps.map((step) => (
                <li
                  key={step.index}
                  data-roast-label
                  className="text-[0.62rem] tracking-[0.04em] text-muted md:text-[0.68rem] [&.is-active]:text-ink"
                >
                  {step.index} — {step.title}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
