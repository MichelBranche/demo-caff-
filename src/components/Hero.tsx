import { useLayoutEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { Magnetic } from "./Magnetic";
import { useAnchorScroll } from "./SmoothScroll";

const deck =
  "Microtorrefazione indipendente in Valle d’Aosta. Selezioniamo caffè di specialità, lavoriamo piccoli lotti e tostiamo ogni origine per valorizzarne il carattere.";

const beans = [
  { src: "/media/roast/bean-1-verde", top: "10px", left: "16px", width: 170, scale: 1, rot: -16, deskRot: -6, blur: 0, depth: 10, dx: -28, dy: -16, deskDx: -10, deskDy: -6, opacity: 1, front: false, mobile: true, spot: "left" },
  { src: "/media/roast/bean-4-scura", top: "78%", left: "46%", width: 230, scale: 1, rot: 12, deskRot: 5, blur: 0, depth: 12, dx: 32, dy: -18, deskDx: 8, deskDy: 10, opacity: 1, front: false, mobile: true, spot: "bottom" },
  { src: "/media/roast/bean-3-media", top: "46%", left: "68%", width: 200, scale: 1, rot: -3, deskRot: -3, blur: 0, depth: 8, dx: 10, dy: -4, deskDx: 10, deskDy: -4, opacity: 1, front: false, mobile: true, spot: "band" },
  { src: "/media/roast/bean-2-chiara", top: "12px", left: "46%", width: 130, scale: 1, rot: 6, deskRot: 6, blur: 0, depth: 8, dx: -6, dy: -6, deskDx: -6, deskDy: -6, opacity: 1, front: false, mobile: true, spot: "center" },
] as const;

const beanInk: Record<string, { l: number; t: number; r: number; b: number }> = {
  "/media/roast/bean-1-verde": { l: 206 / 1600, t: 171 / 1200, r: 1457 / 1600, b: 1112 / 1200 },
  "/media/roast/bean-2-chiara": { l: 250 / 1600, t: 172 / 1200, r: 1416 / 1600, b: 1097 / 1200 },
  "/media/roast/bean-3-media": { l: 165 / 1600, t: 209 / 1200, r: 1493 / 1600, b: 1063 / 1200 },
  "/media/roast/bean-4-scura": { l: 200 / 1600, t: 177 / 1200, r: 1462 / 1600, b: 1095 / 1200 },
};

type Box = { x: number; y: number; w: number; h: number };

function box(x: number, y: number, w: number, h: number): Box {
  return { x, y, w: Math.max(0, w), h: Math.max(0, h) };
}

function measureLine(line: HTMLElement) {
  const inner = line.querySelector<HTMLElement>(".line-inner");
  if (!inner) return null;
  const text = inner.textContent ?? "";
  const size = parseFloat(getComputedStyle(line).fontSize);
  if (!Number.isFinite(size) || size < 8) return null;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.font = `500 ${size}px "Clash Display"`;
  (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = getComputedStyle(inner).letterSpacing;
  const probe = document.createElement("span");
  probe.textContent = "\u200b";
  probe.style.cssText = "display:inline-block;width:0;height:0;vertical-align:baseline;overflow:hidden";
  inner.appendChild(probe);
  const baseline = probe.getBoundingClientRect().top;
  probe.remove();
  if (!baseline) return null;
  const origin = inner.getBoundingClientRect().left;
  const glyphs = [...text].map((ch, index) => {
    const metrics = ctx.measureText(ch);
    const pen = origin + ctx.measureText(text.slice(0, index)).width;
    return {
      ch,
      left: pen + Math.min(0, metrics.actualBoundingBoxLeft),
      right: pen + metrics.actualBoundingBoxRight,
      top: baseline - metrics.actualBoundingBoxAscent,
      bottom: baseline + metrics.actualBoundingBoxDescent,
    };
  });
  if (!glyphs.length || glyphs.every((glyph) => glyph.top === glyph.bottom)) return null;
  return { glyphs };
}

function placeDesktopBeans(section: HTMLElement) {
  const slots = [...section.querySelectorAll<HTMLElement>(".bean-slot")];
  const desktop = window.matchMedia("(min-width: 768px)").matches;
  if (!desktop) {
    slots.forEach((slot) => {
      slot.style.top = "";
      slot.style.left = "";
      slot.style.width = "";
      slot.style.visibility = "";
    });
    return;
  }

  const hero = section.getBoundingClientRect();
  const inners = [...section.querySelectorAll<HTMLElement>("[data-hero-line]")];
  const saved = inners.map((inner) => inner.style.transform);
  inners.forEach((inner) => {
    inner.style.transform = "none";
  });
  let line1: ReturnType<typeof measureLine> = null;
  let line2: ReturnType<typeof measureLine> = null;
  try {
    const lines = [...section.querySelectorAll<HTMLElement>(".hero-title .line")];
    line1 = lines[0] ? measureLine(lines[0]) : null;
    line2 = lines[1] ? measureLine(lines[1]) : null;
  } finally {
    inners.forEach((inner, index) => {
      inner.style.transform = saved[index];
    });
  }
  if (!line1 || !line2) return;

  const header = document.querySelector("header")?.getBoundingClientRect().bottom ?? hero.top;
  const ell = line1.glyphs.find((glyph) => glyph.ch === "l");
  const cee = line1.glyphs.find((glyph) => glyph.ch === "c");
  const ay = line1.glyphs.find((glyph) => glyph.ch === "a");
  const comma = line1.glyphs.find((glyph) => glyph.ch === ",");
  if (!ell || !cee || !ay || !comma) return;

  const line1Base = Math.max(...line1.glyphs.filter((glyph) => glyph.ch !== "," && glyph.ch !== " ").map((glyph) => glyph.bottom));
  const line2Top = Math.min(
    ...line2.glyphs.filter((glyph) => glyph.ch !== "i" && glyph.ch !== "." && glyph.ch !== " ").map((glyph) => glyph.top),
  );
  const skyTop = header + 14;
  const skyBottom = Math.min(cee.top, ay.top) - 36;
  const skyH = skyBottom - skyTop;
  const bandTop = line1Base + 18;
  const bandH = line2Top - bandTop - 16;
  const skyW = Math.min(skyH * 1.2, (ay.left - ell.right) * 0.46);
  const bandW = Math.min(Math.max(bandH, 0) * 1.35, 250);

  const spots: Record<string, Box | null> = {
    left: skyH > 56 && skyW > 72 ? box(ell.right + 16, skyTop, skyW, skyH) : null,
    center: skyH > 56 && skyW > 72 ? box(cee.right - skyW * 0.2, skyTop, skyW * 0.92, skyH) : null,
    bottom: bandH > 64 && bandW > 80 ? box(Math.max(24, ell.left - 8), bandTop, bandW, bandH) : null,
    band: bandH > 64 && bandW > 80 ? box(comma.left - bandW - 36, bandTop, bandW, bandH) : null,
  };

  slots.forEach((slot, index) => {
    const bean = beans[index];
    const ink = bean ? beanInk[bean.src] : undefined;
    const spot = bean?.spot;
    const target = spot ? spots[spot] : null;
    if (!bean || !ink || !target) {
      slot.style.visibility = "hidden";
      return;
    }
    const fw = ink.r - ink.l;
    const fh = ink.b - ink.t;
    const aspect = fw / (0.75 * fh);
    let opaqueW = target.w;
    let opaqueH = opaqueW / aspect;
    if (opaqueH > target.h) {
      opaqueH = target.h;
      opaqueW = opaqueH * aspect;
    }
    const opaqueX = target.x + (target.w - opaqueW) / 2;
    const opaqueY = target.y + (target.h - opaqueH) / 2;
    const slotW = opaqueW / fw;
    const slotH = slotW * 0.75;
    slot.style.visibility = "";
    slot.style.width = `${slotW}px`;
    slot.style.left = `${opaqueX - slotW * ink.l - hero.left}px`;
    slot.style.top = `${opaqueY - slotH * ink.t - hero.top}px`;
  });
}

function fitHeroLines(lines: HTMLElement[], max: number) {
  if (!lines.length) return;

  const apply = (line: HTMLElement, size: number) => {
    line.style.fontSize = `${Math.round(size * 10) / 10}px`;
  };
  const textWidth = (line: HTMLElement) => line.querySelector<HTMLElement>(".line-inner")?.scrollWidth ?? 0;

  lines.forEach((line) => {
    const target = line.clientWidth - 2;
    if (target < 8) return;
    let lo = 28;
    let hi = max;
    for (let step = 0; step < 18; step += 1) {
      const mid = (lo + hi) / 2;
      apply(line, mid);
      if (textWidth(line) > target) hi = mid;
      else lo = mid;
    }
    apply(line, lo);
  });
}

function useFitTitle(root: RefObject<HTMLElement | null>, max: number, afterRef: RefObject<(() => void) | null>) {
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const lines = [...el.querySelectorAll<HTMLElement>("[data-fit-line]")];
    const fit = () => {
      fitHeroLines(lines, max);
      afterRef.current?.();
    };
    fit();
    const observer = new ResizeObserver(fit);
    const title = el.querySelector("[data-hero-title]");
    if (title) observer.observe(title);
    observer.observe(el);
    let cancel = false;
    document.fonts.ready.then(() => {
      if (cancel) return;
      fit();
      ScrollTrigger.refresh();
    });
    return () => {
      cancel = true;
      observer.disconnect();
    };
  }, [root, max, afterRef]);
}

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M3 9h12M11 4.5 15.5 9 11 13.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function HeroActions() {
  const scrollTo = useAnchorScroll();

  return (
    <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
      <Magnetic>
        <a
          className="btn btn-fill"
          href="#origini"
          onClick={(event) => {
            event.preventDefault();
            scrollTo("#origini");
          }}
        >
          Scopri le origini
          <Arrow />
        </a>
      </Magnetic>
      <Magnetic pull={0.4}>
        <a
          className="btn btn-quiet"
          href="#visita"
        onClick={(event) => {
          event.preventDefault();
          scrollTo("#visita");
        }}
      >
          Visita la torrefazione
        </a>
      </Magnetic>
    </div>
  );
}

function HeroTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="headline hero-title" data-hero-title>
      {children}
    </h1>
  );
}

function TitleLine({
  children,
  underline = false,
  roast,
}: {
  children: string;
  underline?: boolean;
  roast?: string;
}) {
  const at = roast ? children.indexOf(roast) : -1;
  const letters = at >= 0 && roast ? [...roast] : null;

  return (
    <span className="line" data-fit-line>
      <span className="line-inner" data-hero-line>
        {letters && roast ? (
          <>
            {children.slice(0, at)}
            {letters.map((letter, index) => (
              <span key={`${letter}-${index}`} className="hero-roast" data-hero-roast>
                {letter}
              </span>
            ))}
            {children.slice(at + roast.length)}
          </>
        ) : (
          children
        )}
        {underline ? <span className="hero-rule" aria-hidden="true" /> : null}
      </span>
    </span>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const placeRef = useRef<(() => void) | null>(null);
  placeRef.current = () => {
    const section = root.current;
    if (section) placeDesktopBeans(section);
  };
  useFitTitle(root, 640, placeRef);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const mm = gsap.matchMedia();

      const play = (desktop: boolean) => {
        const slots = [...section.querySelectorAll<HTMLElement>(".bean-slot")].filter((slot) => {
          if (!desktop && slot.dataset.show === "desk") return false;
          return true;
        });
        const visuals = slots.map((slot) => slot.querySelector<HTMLElement>(".bean-visual")).filter((el): el is HTMLElement => el instanceof HTMLElement);
        const movers = slots.map((slot) => slot.querySelector<HTMLElement>(".bean-mouse")).filter((el): el is HTMLElement => el instanceof HTMLElement);
        const title = section.querySelector<HTMLElement>("[data-hero-title]");
        const lines = section.querySelectorAll<HTMLElement>("[data-hero-line]");

        visuals.forEach((visual, index) => {
          const rot = Number(desktop ? visual.dataset.deskRot : visual.dataset.rot);
          const scale = Number(visual.dataset.scale);
          const wobble = desktop ? 2.5 : 5;
          gsap.set(visual, { rotation: rot, scale, y: 0 });
          gsap.to(visual, {
            rotation: rot + (rot >= 0 ? wobble : -wobble),
            y: 4,
            duration: 5.2 + Math.abs(rot) * 0.08,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          });
        });

        const rule = section.querySelector<HTMLElement>(".hero-rule");
        if (lines.length) {
          const intro = gsap.timeline({ delay: 0.05 });
          intro.fromTo(
            lines,
            { yPercent: 110 },
            { yPercent: 0, duration: 1.05, stagger: 0.08, ease: "power3.out" },
          );
          if (rule) {
            gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
            intro.to(rule, { scaleX: 1, duration: 1.15, ease: "power3.inOut" }, ">");
          }
          const roastLetters = [...section.querySelectorAll<HTMLElement>("[data-hero-roast]")];
          if (roastLetters.length) {
            const coffee = getComputedStyle(document.documentElement).getPropertyValue("--color-coffee").trim();
            const ink = getComputedStyle(document.documentElement).getPropertyValue("--color-ink").trim();
            gsap.set(roastLetters, { color: ink });
            const colorLoop = gsap.timeline({ paused: true, repeat: -1, yoyo: true, repeatDelay: 1.15 });
            colorLoop.to(roastLetters, {
              color: coffee,
              duration: 0.42,
              stagger: 0.28,
              ease: "power2.inOut",
            });
            intro.call(() => colorLoop.play(), undefined, ">");
          }
        }
        gsap.from(visuals, { autoAlpha: 0, duration: 1.15, stagger: 0.05, delay: 0.08, ease: "power2.out" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 4.5rem",
            end: "bottom top",
            scrub: true,
          },
        });
        slots.forEach((slot) => {
          tl.to(
            slot,
            {
              x: Number(desktop ? slot.dataset.deskDx : slot.dataset.dx),
              y: Number(desktop ? slot.dataset.deskDy : slot.dataset.dy),
              opacity: 0.15,
              ease: "none",
              duration: 1,
            },
            0,
          );
        });
        if (title) {
          tl.fromTo(title, { scale: 1 }, { scale: 1.035, ease: "none", duration: 1, transformOrigin: "50% 46%" }, 0);
        }

        if (!desktop) return;
        const xs = movers.map((el) => gsap.quickTo(el, "x", { duration: 0.8, ease: "power2.out" }));
        const ys = movers.map((el) => gsap.quickTo(el, "y", { duration: 0.8, ease: "power2.out" }));
        const onMove = (event: MouseEvent) => {
          const nx = event.clientX / window.innerWidth - 0.5;
          const ny = event.clientY / window.innerHeight - 0.5;
          movers.forEach((el, i) => {
            const depth = Number(el.dataset.depth);
            xs[i](nx * depth);
            ys[i](ny * depth * 0.72);
          });
        };
        section.addEventListener("mousemove", onMove);
        return () => section.removeEventListener("mousemove", onMove);
      };

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => play(true));
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => play(false));

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="contenuto" className="hero-c">
      <div className="hero-beans" aria-hidden="true">
        {beans.map((bean, index) => (
          <div
            key={`${bean.src}-${index}`}
            className="bean-slot"
            data-show={bean.mobile ? "all" : "desk"}
            data-dx={bean.dx}
            data-dy={bean.dy}
            data-desk-dx={bean.deskDx}
            data-desk-dy={bean.deskDy}
            style={
              {
                zIndex: bean.front ? 4 : 1,
                opacity: bean.opacity,
                "--bean-w": `${bean.width}px`,
                "--bean-top": bean.top,
                "--bean-left": bean.left,
              } as CSSProperties
            }
          >
            <div className="bean-mouse" data-depth={bean.depth}>
              <div
                className="bean-visual"
                data-rot={bean.rot}
                data-desk-rot={bean.deskRot}
                data-scale={bean.scale}
                style={
                  {
                    "--rot": `${bean.deskRot}deg`,
                    "--scale": String(bean.scale),
                    filter: bean.blur ? `blur(${bean.blur}px)` : undefined,
                  } as CSSProperties
                }
              >
                <picture>
                  <source srcSet={`${bean.src}.webp`} type="image/webp" />
                  <img src={`${bean.src}.png`} alt="" width={1600} height={1200} draggable={false} />
                </picture>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hero-c-copy">
        <HeroTitle>
          <TitleLine roast="caffè">Il caffè,</TitleLine>
          <TitleLine underline>senza compromessi.</TitleLine>
        </HeroTitle>
        <div className="wrap mt-8 flex flex-col items-start gap-6 md:mt-10 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[34ch] text-muted">{deck}</p>
          <HeroActions />
        </div>
      </div>
    </section>
  );
}
