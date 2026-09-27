import { useEffect, useState } from "react";
import { beginScrollPass, endScrollPass } from "../lib/scrollPass";
import { Magnetic } from "./Magnetic";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sync = () => {
      const pin = document.querySelector("[data-roast-pin]");
      let pinned = false;
      if (pin) {
        const rect = pin.getBoundingClientRect();
        pinned = rect.top < 8 && rect.bottom > window.innerHeight * 0.7;
      }
      document.documentElement.toggleAttribute("data-roast-pinned", pinned);
      setVisible(window.scrollY > window.innerHeight * 0.65 && !pinned);
    };
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      document.documentElement.removeAttribute("data-roast-pinned");
    };
  }, []);

  const go = () => {
    const lenis = window.__lenis;
    if (lenis) {
      const pass = beginScrollPass();
      lenis.start();
      lenis.scrollTo(0, {
        force: true,
        onComplete: () => endScrollPass(pass),
      });
      return;
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <Magnetic className={`to-top-slot${visible ? " is-in" : ""}`} pull={0.42}>
      <button
        type="button"
        className="to-top"
        aria-label="Torna su"
        tabIndex={visible ? 0 : -1}
        onClick={go}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M9 15V3M4.5 7.5 9 3l4.5 4.5" stroke="currentColor" strokeWidth="1" />
        </svg>
      </button>
    </Magnetic>
  );
}
