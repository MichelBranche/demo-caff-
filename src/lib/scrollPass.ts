let sequence = 0;

export function beginScrollPass() {
  const id = ++sequence;
  window.__scrollPass = id;
  window.dispatchEvent(new Event("scroll-pass-start"));
  return id;
}

export function endScrollPass(id: number) {
  if (window.__scrollPass !== id) return;
  window.__scrollPass = 0;
  requestAnimationFrame(() => {
    if (window.__scrollPass) return;
    window.dispatchEvent(new Event("scroll-pass-end"));
  });
}
