import { mergeTests } from "@playwright/test";

import { coverateTest } from "./coverage";

export const test = mergeTests(
  coverateTest
  // Add more custom fixtures here
);
