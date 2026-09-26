import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../lib/gsap";

export function useSectionMotion(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const lines = root.querySelectorAll<HTMLElement>("[data-reveal]");
      if (lines.length) {
        gsap.set(lines, { yPercent: 110 });
        lines.forEach((line, index) => {
          const trigger = line.closest("[data-reveal-block]") ?? line;
          gsap.to(line, {
            yPercent: 0,
            duration: 1.05,
            delay: index * 0.06,
            ease: "power3.out",
            scrollTrigger: {
              trigger,
              start: "top 86%",
              once: true,
            },
          });
        });
      }

      root.querySelectorAll<HTMLElement>("[data-frame]").forEach((frame) => {
        const image = frame.querySelector("img");
        gsap.fromTo(
          frame,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.15,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: frame,
              start: "top 82%",
              once: true,
            },
          },
        );
        if (image && !frame.querySelector("[data-pack], [data-plant], [data-capsule]")) {
          gsap.fromTo(
            image,
            { scale: 1.18, yPercent: 8 },
            {
              scale: 1,
              yPercent: 0,
              duration: 1.35,
              ease: "power3.out",
              scrollTrigger: {
                trigger: frame,
                start: "top 82%",
                once: true,
              },
            },
          );
        }
      });
    },
    { scope },
  );
}
