/// <reference types="vite/client" />

import type Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
    __scrollPass?: number;
  }
}

export {};
