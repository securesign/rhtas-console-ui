/// <reference types="vitest/globals" />
/// <reference lib="dom" />

import "reflect-metadata";
import { expect } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";

// // add jest-dom matchers to Vitest's expect
expect.extend(matchers);

if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = () => ({
    matches: false,
    media: "",
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

if (typeof window !== "undefined" && !window.matchMedia) {
  throw new Error("matchMedia polyfill failed to initialize");
}
