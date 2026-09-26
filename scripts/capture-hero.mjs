import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const base = "http://127.0.0.1:5173";
const outDir = "C:/Users/miche/Desktop/volt-landing/screenshots";

async function waitReady(page) {
  await page.goto(base, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
  await page.waitForFunction(() => {
    const line = document.querySelector(".hero-title .line");
    if (!line) return false;
    if (!(parseFloat(getComputedStyle(line).fontSize) > 30)) return false;
    const images = Array.from(document.querySelectorAll(".bean-slot img"));
    return images.length > 0 && images.every((img) => img.complete && img.naturalWidth > 0);
  });
  await page.waitForTimeout(1400);
}

async function measure(page) {
  return page.evaluate(() => {
    const lines = [...document.querySelectorAll(".hero-title .line")].map((line) => {
      const inner = line.querySelector(".line-inner");
      const text = inner?.textContent ?? "";
      return {
        text,
        size: getComputedStyle(line).fontSize,
        textWidth: inner?.scrollWidth ?? 0,
        box: line.clientWidth,
        overflow: (inner?.scrollWidth ?? 0) - line.clientWidth,
      };
    });
    const title = document.querySelector(".hero-title")?.getBoundingClientRect();
    const copy = document.querySelector(".hero-c-copy")?.getBoundingClientRect();
    return {
      lines,
      titleTop: title ? Math.round(title.top) : null,
      titleBottom: title ? Math.round(title.bottom) : null,
      copyBottom: copy ? Math.round(copy.bottom) : null,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      eCheck: document.fonts.check('500 120px "Clash Display"', "è"),
      beans: [...document.querySelectorAll(".bean-slot")].filter((el) => getComputedStyle(el).display !== "none").length,
      toggle: Boolean(document.querySelector(".hero-switch")),
    };
  });
}

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();

for (const width of [1440, 1280]) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  await waitReady(page);
  const metrics = await measure(page);
  console.log(width, JSON.stringify(metrics));
  if (width === 1440) {
    await page.screenshot({ path: `${outDir}/hero-final-desktop.png` });
  }
  await page.close();
}

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
await waitReady(mobile);
console.log(390, JSON.stringify(await measure(mobile)));
await mobile.screenshot({ path: `${outDir}/hero-final-mobile.png` });
await mobile.close();

await browser.close();
console.log("hero final screenshots saved");
