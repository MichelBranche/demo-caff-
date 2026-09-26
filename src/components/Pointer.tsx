import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";

const finePointer = "(hover: hover) and (pointer: fine)";

export function Pointer() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const fine = window.matchMedia(finePointer).matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce || !dot.current || !ring.current) return;

    root.classList.add("has-pointer");
    const dotX = gsap.quickTo(dot.current, "x", { duration: 0.16, ease: "power3.out" });
    const dotY = gsap.quickTo(dot.current, "y", { duration: 0.16, ease: "power3.out" });
    const ringX = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3.out" });

    let media: HTMLElement | null = null;

    const release = (el: HTMLElement | null) => {
      if (!el) return;
      const pack = el.querySelector("[data-pack], [data-capsule]");
      if (pack) {
        gsap.to(pack, { y: 0, duration: 0.8, ease: "power3.out", overwrite: "auto" });
        return;
      }
      const images = el.querySelectorAll("img");
      if (images.length && !el.classList.contains("bean-frame") && !el.classList.contains("wordmark")) {
        gsap.to(images, { x: 0, y: 0, duration: 0.8, ease: "power3.out", overwrite: "auto" });
        return;
      }
      gsap.to(el, {
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const followMedia = (event: PointerEvent, next: HTMLElement) => {
      const box = next.getBoundingClientRect();
      const px = (event.clientX - box.left) / box.width - 0.5;
      const py = (event.clientY - box.top) / box.height - 0.5;

      if (next.classList.contains("bean-frame")) {
        gsap.to(next, {
          rotateY: px * 12,
          rotateX: py * -8,
          transformPerspective: 900,
          duration: 0.7,
          ease: "power2.out",
          overwrite: "auto",
        });
        return;
      }

      if (next.classList.contains("wordmark")) {
        gsap.to(next, {
          x: px * 56,
          y: py * 10,
          duration: 0.9,
          ease: "power3.out",
          overwrite: "auto",
        });
        return;
      }

      const pack = next.querySelector("[data-pack], [data-capsule]");
      if (pack) {
        gsap.to(pack, {
          y: py * -22,
          duration: 0.7,
          ease: "power2.out",
          overwrite: "auto",
        });
        return;
      }

      const images = next.querySelectorAll("img");
      if (images.length) {
        gsap.to(images, {
          x: px * 26,
          y: py * 18,
          duration: 0.7,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    const mediaFrom = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return null;
      const frame = target.closest("[data-frame]");
      if (frame instanceof HTMLElement) return frame;
      const bean = target.closest(".bean-frame");
      if (bean instanceof HTMLElement) return bean;
      const word = target.closest(".wordmark");
      if (word instanceof HTMLElement) return word;
      return null;
    };

    const onMove = (event: PointerEvent) => {
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
      root.classList.add("pointer-on");

      const nearBar = event.clientX > window.innerWidth - 18;
      root.classList.toggle("pointer-native", nearBar);

      const target = event.target;
      const link = target instanceof Element && target.closest("a, button");
      const next = mediaFrom(target);
      root.dataset.cursor = next ? "media" : link ? "link" : "";

      if (next !== media) {
        release(media);
        media = next;
      }
      if (next) followMedia(event, next);
    };

    const onLeave = () => {
      root.classList.remove("pointer-on");
      root.dataset.cursor = "";
      release(media);
      media = null;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      root.classList.remove("has-pointer", "pointer-on", "pointer-native");
      delete root.dataset.cursor;
      release(media);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="pointer pointer-ring" aria-hidden="true">
        <span className="pointer-ring-core" />
      </div>
      <div ref={dot} className="pointer pointer-dot" aria-hidden="true">
        <span className="pointer-dot-core" />
      </div>
    </>
  );
}
