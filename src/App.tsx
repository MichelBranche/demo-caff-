import { BackToTop } from "./components/BackToTop";
import { Capsules } from "./components/Capsules";
import { Footer } from "./components/Footer";
import { Pointer } from "./components/Pointer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Manifesto } from "./components/Manifesto";
import { Origins } from "./components/Origins";
import { Roast } from "./components/Roast";
import { Shop } from "./components/Shop";
import { SmoothScroll } from "./components/SmoothScroll";
import { Visit } from "./components/Visit";

export default function App() {
  return (
    <SmoothScroll>
      <div className="grain" aria-hidden="true" />
      <Pointer />
      <Header />
      <main>
        <Hero />
        <Manifesto />
        <Origins />
        <Roast />
        <Shop />
        <Capsules />
        <Visit />
      </main>
      <Footer />
      <BackToTop />
    </SmoothScroll>
  );
}
