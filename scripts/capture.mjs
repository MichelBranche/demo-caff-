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
    const images = Array.from(document.images);
    return images.length >= 3 && images.every((img) => img.complete && img.naturalWidth > 0);
  });
  await page.waitForTimeout(1700);
}

async function scrollThrough(page) {
  await page.evaluate(async () => {
    const lenis = window.__lenis;
    const max = document.documentElement.scrollHeight;
    const step = Math.max(280, Math.round(window.innerHeight * 0.45));
    for (let y = 0; y <= max; y += step) {
      if (lenis) lenis.scrollTo(y, { immediate: true });
      else window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 70));
    }
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1300);
}

async function scrollToRoast(page) {
  const target = await page.evaluate(() => {
    const steps = document.querySelector("#tostatura article")?.parentElement;
    if (!steps) return 0;
    const top = steps.getBoundingClientRect().top + window.scrollY;
    const height = steps.getBoundingClientRect().height;
    const vh = window.innerHeight;
    const start = top - vh * 0.55;
    const end = top + height - vh * 0.55;
    return start + (end - start) * 0.42;
  });
  await page.evaluate((y) => {
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(y, { immediate: true });
    else window.scrollTo(0, y);
  }, target);
  await page.waitForTimeout(500);
  return target;
}

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();

const desktop = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
await waitReady(desktop);
await scrollThrough(desktop);
await desktop.screenshot({ path: `${outDir}/desktop.png`, fullPage: true });
await scrollToRoast(desktop);
await desktop.screenshot({ path: `${outDir}/scroll.png` });
await desktop.close();

const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
});
await waitReady(mobile);
await scrollThrough(mobile);
await mobile.screenshot({ path: `${outDir}/mobile.png`, fullPage: true });
await mobile.close();

await browser.close();
console.log("screenshots saved");
