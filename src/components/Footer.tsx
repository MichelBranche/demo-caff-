import { Magnetic } from "./Magnetic";
import { useAnchorScroll } from "./SmoothScroll";

const links = [
  { href: "#origini", label: "Origini" },
  { href: "#tostatura", label: "Tostatura" },
  { href: "#selezione", label: "Selezione" },
  { href: "#capsule", label: "Capsule" },
  { href: "#visita", label: "Visita" },
];

export function Footer() {
  const scrollTo = useAnchorScroll();

  return (
    <footer className="border-t border-line bg-paper">
      <div className="wrap pt-14 md:pt-16">
        <div className="mx-auto grid max-w-5xl gap-12 text-center md:grid-cols-3">
          <div>
            <p className="eyebrow text-muted">Orma</p>
            <p className="mx-auto mt-4 max-w-[32ch]">
              Microtorrefazione indipendente.
              <br />
              Caffè di specialità tostati in piccoli lotti in Valle d’Aosta.
            </p>
          </div>
          <div>
            <p className="eyebrow text-muted">Pagine</p>
            <ul className="mt-4 space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Magnetic pull={0.4}>
                    <a
                      href={link.href}
                      className="link-draw"
                    onClick={(event) => {
                      event.preventDefault();
                      scrollTo(link.href);
                    }}
                  >
                      {link.label}
                    </a>
                  </Magnetic>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-muted">Contatti</p>
            <p className="mt-4">Località Pian di Lenta, Valle d’Aosta</p>
            <p className="mt-3">
              <a className="link-draw tap-link" href="mailto:visita@orma.coffee">
                visita@orma.coffee
              </a>
              <br />
              <a className="link-draw tap-link" href="tel:+390165440218">
                +39 0165 440 218
              </a>
            </p>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t border-line pt-6 text-xs tracking-wide text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>Marchio di fantasia. Esercizio di design, 2026.</p>
          <a
            href="https://www.michelbranche.it"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4"
          >
            design & website by michel branche
          </a>
          <p>Fotografie: Unsplash.</p>
        </div>
      </div>
      <div className="wordmark-clip" aria-hidden="true">
        <p className="wordmark">Orma</p>
      </div>
    </footer>
  );
}
