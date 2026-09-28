import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { roastSteps } from "../content";
import { gsap, Observer, ScrollTrigger } from "../lib/gsap";
import { SectionLabel } from "./SectionLabel";

const beans = [
  "/media/roast/bean-1-verde",
  "/media/roast/bean-2-chiara",
  "/media/roast/bean-3-media",
  "/media/roast/bean-4-scura",
] as const;

const beanSrcSet = (base: string) => `${base}-480.webp 480w, ${base}-960.webp 960w`;

const panel =
  "roast-panel flex h-full w-[100cqi] shrink-0 items-center pt-20 pb-24 motion-reduce:h-auto motion-reduce:w-auto motion-reduce:py-16 md:pt-24 md:pb-28";

export function Roast() {
  const root = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

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
      let wheelAt = 0;
      let touchAt = 0;
      let arrowAt = 0;
      let bypassUntil = 0;
      let gestureArrived = false;
      let startedInPin = false;
      let touchActive = false;
      let touchStartX = 0;
      let touchStartY = 0;
      let lastTop = 0;
      let jumpAt = 0;
      let lastScrollY = window.scrollY;

      const setPinned = (on: boolean) => {
        document.documentElement.toggleAttribute("data-roast-pinned", on);
      };

      const userStepped = () => {
        const now = performance.now();
        if (now < bypassUntil) return false;
        return now - wheelAt < 1400 || now - touchAt < 700 || now - arrowAt < 400;
      };

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
        setPinned(false);
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

      const step = (direction: 1 | -1, force = false) => {
        if (!locked || passing) return;
        if (!force && cool && direction === travel) return;
        const next = index + direction;
        if (next < 0 || next >= count()) {
          if (!force && cool) return;
          leave(direction);
          return;
        }
        travel = direction;
        cool = true;
        place(next, true);
      };

      const observer = Observer.create({
        target: window,
        type: "wheel",
        tolerance: 8,
        debounce: false,
        preventDefault: true,
        onDown: () => step(1),
        onUp: () => step(-1),
      });
      observer.disable();

      const engage = (trigger: ScrollTrigger, panel: number) => {
        if (passing || locked || window.__scrollPass) return;
        if (performance.now() < bypassUntil) return;
        locked = true;
        cool = true;
        travel = 0;
        if (touchActive && !startedInPin) gestureArrived = true;
        observer.enable();
        setPinned(true);
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
        if (window.__scrollPass) {
          locked = false;
          cool = false;
          observer.disable();
          setPinned(false);
          return;
        }
        if (passing) return;
        locked = false;
        cool = false;
        observer.disable();
        setPinned(false);
        window.__lenis?.start();
      };

      const releaseForPass = () => {
        locked = false;
        cool = false;
        glide += 1;
        gsap.killTweensOf([track, fill]);
        observer.disable();
        setPinned(false);
      };

      const releaseForKey = () => {
        bypassUntil = performance.now() + 160;
        if (!locked && !passing) return;
        passing = false;
        locked = false;
        cool = false;
        observer.disable();
        setPinned(false);
        window.__lenis?.start();
      };

      const onWheel = () => {
        wheelAt = performance.now();
      };

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        const target = event.target;
        if (target instanceof HTMLElement && target.closest("input, textarea, select, [contenteditable='true']")) return;

        if (event.key === "Home" || event.key === "End") {
          releaseForKey();
          const lenis = window.__lenis;
          const y = event.key === "Home" ? 0 : (lenis?.limit ?? Math.max(0, document.documentElement.scrollHeight - window.innerHeight));
          event.preventDefault();
          if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
          else window.scrollTo(0, y);
          return;
        }

        if (event.key === "PageDown" || event.key === "PageUp" || event.key === " ") {
          if (event.key === " " && target instanceof HTMLElement && target.closest("a, button")) return;
          releaseForKey();
          return;
        }

        const direction = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : 0;
        if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
          if (!locked) return;
          event.preventDefault();
          bypassUntil = performance.now() + 800;
          leave(-1);
          return;
        }
        if (!direction) return;
        bypassUntil = 0;
        arrowAt = performance.now();
        if (!locked) return;
        event.preventDefault();
        step(direction);
      };

      const onTouchStart = (event: TouchEvent) => {
        if (event.touches.length !== 1) return;
        const touch = event.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchAt = performance.now();
        touchActive = true;
        gestureArrived = false;
        const trigger = ScrollTrigger.getById("roast-steps");
        startedInPin = !!trigger && window.scrollY >= trigger.start - 2 && window.scrollY <= trigger.end + 2;
        lastTop = pin.getBoundingClientRect().top;
      };

      const onTouchMove = (event: TouchEvent) => {
        if (event.touches.length !== 1) return;
        if (window.__scrollPass || performance.now() < bypassUntil) return;
        const trigger = ScrollTrigger.getById("roast-steps");
        if (!trigger) return;
        const touch = event.touches[0];
        const dy = touchStartY - touch.clientY;
        const top = pin.getBoundingClientRect().top;
        touchAt = performance.now();

        if (locked) {
          if (event.cancelable) event.preventDefault();
          const drift = window.scrollY < trigger.start - 2 || window.scrollY > trigger.end + 2;
          if (drift) {
            const lenis = window.__lenis;
            const y = trigger.start + 1;
            if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
            else window.scrollTo(0, y);
          }
          lastTop = top;
          return;
        }

        const movingDown = dy > 10;
        const movingUp = dy < -10;
        const crossedDown = movingDown && lastTop > 2 && top <= 2;
        const crossedUp = movingUp && lastTop < -2 && top >= -2;
        if (crossedDown || crossedUp || (startedInPin && Math.abs(dy) > 10)) {
          if (event.cancelable) event.preventDefault();
          engage(trigger, movingUp && !movingDown ? count() - 1 : 0);
          if (locked && !startedInPin) gestureArrived = true;
        }
        lastTop = top;
      };

      const onTouchEnd = (event: TouchEvent) => {
        const touch = event.changedTouches[0];
        touchActive = false;
        if (!touch || gestureArrived || !locked || passing) return;
        const dy = touchStartY - touch.clientY;
        const dx = touchStartX - touch.clientX;
        if (Math.abs(dy) < 28 || Math.abs(dy) <= Math.abs(dx)) return;
        step(dy > 0 ? 1 : -1, true);
      };

      const onScroll = () => {
        const y = window.scrollY;
        const delta = Math.abs(y - lastScrollY);
        lastScrollY = y;
        const now = performance.now();
        const fromGesture = now - wheelAt < 50 || now - touchAt < 50 || now - arrowAt < 50;
        if (delta > 320 && !fromGesture) jumpAt = now;
      };

      const resumeAfterPass = () => {
        const trigger = ScrollTrigger.getById("roast-steps");
        if (!trigger || locked || passing || window.__scrollPass) return;
        const y = window.scrollY;
        if (y < trigger.start || y > trigger.end) return;
        const span = Math.max(1, trigger.end - trigger.start);
        const panel = y > trigger.start + span * 0.5 ? count() - 1 : 0;
        engage(trigger, panel);
      };

      window.addEventListener("scroll-pass-start", releaseForPass);
      window.addEventListener("scroll-pass-end", resumeAfterPass);
      window.addEventListener("scroll", onScroll, { passive: true, capture: true });
      window.addEventListener("wheel", onWheel, { passive: true, capture: true });
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("touchstart", onTouchStart, { capture: true, passive: true });
      window.addEventListener("touchmove", onTouchMove, { capture: true, passive: false });
      window.addEventListener("touchend", onTouchEnd, { capture: true });
      window.addEventListener("touchcancel", onTouchEnd, { capture: true });

      ScrollTrigger.create({
        id: "roast-steps",
        trigger: pin,
        pin: true,
        start: "top top",
        end: () => `+=${Math.round(Math.min(140, window.innerHeight * 0.16))}`,
        invalidateOnRefresh: true,
        onEnter: (self) => {
          if (performance.now() < bypassUntil) return;
          if (performance.now() - jumpAt < 80) return;
          if (!userStepped()) return;
          engage(self, 0);
        },
        onEnterBack: (self) => {
          if (performance.now() < bypassUntil) return;
          if (performance.now() - jumpAt < 80) return;
          if (!userStepped()) return;
          engage(self, count() - 1);
        },
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
        setPinned(false);
        window.removeEventListener("scroll-pass-start", releaseForPass);
        window.removeEventListener("scroll-pass-end", resumeAfterPass);
        window.removeEventListener("scroll", onScroll, { capture: true });
        window.removeEventListener("wheel", onWheel, { capture: true });
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("touchstart", onTouchStart, { capture: true });
        window.removeEventListener("touchmove", onTouchMove, { capture: true });
        window.removeEventListener("touchend", onTouchEnd, { capture: true });
        window.removeEventListener("touchcancel", onTouchEnd, { capture: true });
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
        data-roast-pin
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
                          <source srcSet={beanSrcSet(bean)} sizes="(max-width: 767px) 240px, 480px" type="image/webp" />
                          <img
                            src={`${bean}.png`}
                            alt=""
                            width="960"
                            height="720"
                            loading="lazy"
                            decoding="async"
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
