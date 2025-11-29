import { expect as baseExpect } from "@playwright/test";
import { MatcherResult } from "./types";

export interface HelperMatchers<T> {
  toBeSorted(sort: "ascending" | "descending", compareFn: (a: T, b: T) => number): MatcherResult;
}

type HelperMatcherDefinitions = {
  readonly [K in keyof HelperMatchers<unknown>]: <T>(
    receiver: T[],
    ...args: Parameters<HelperMatchers<T>[K]>
  ) => MatcherResult;
};

export const helperAssertions = baseExpect.extend<HelperMatcherDefinitions>({
  toBeSorted: <T>(arr: T[], sort: "ascending" | "descending", compareFn: (a: T, b: T) => number): MatcherResult => {
    let sorted = [...arr].sort(compareFn);
    if (sort === "descending") {
      sorted = sorted.reverse();
    }
    const isSorted = arr.every((val, i) => val === sorted[i]);

    return {
      pass: isSorted,
      message: () => `Received: ${arr.join(", ")} \nExpected: ${sorted.join(", ")}`,
    };
  },
});
