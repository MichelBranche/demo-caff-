import { useEffect, useState } from "react";
import { Magnetic } from "./Magnetic";
import { useAnchorScroll } from "./SmoothScroll";

const links = [
  { href: "#origini", label: "Origini" },
  { href: "#tostatura", label: "Tostatura" },
  { href: "#selezione", label: "Selezione" },
  { href: "#capsule", label: "Capsule" },
  { href: "#visita", label: "Visita" },
];

export function Header() {
  const scrollTo = useAnchorScroll();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled ? "border-line bg-paper" : "border-transparent bg-paper"
      }`}
    >
      <div className="wrap flex h-16 items-center justify-between md:h-[4.5rem]">
        <Magnetic pull={0.42}>
          <a
            href="#contenuto"
            className="inline-flex items-center text-ink"
            onClick={(event) => {
              event.preventDefault();
              scrollTo("#contenuto");
            }}
          >
            <span className="headline text-[1.7rem] leading-none tracking-[-0.03em]">Orma</span>
          </a>
        </Magnetic>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Sezioni">
          {links.map((link) => (
            <Magnetic key={link.href} pull={0.45}>
              <a
                href={link.href}
                className="nav-link"
                onClick={(event) => {
                  event.preventDefault();
                  scrollTo(link.href);
                }}
              >
                {link.label}
              </a>
            </Magnetic>
          ))}
        </nav>
        <a
          href="#visita"
          className="eyebrow text-ink md:hidden"
          onClick={(event) => {
            event.preventDefault();
            scrollTo("#visita");
          }}
        >
          Visita
        </a>
      </div>
    </header>
  );
}
