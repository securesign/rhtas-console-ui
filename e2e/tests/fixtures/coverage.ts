import { test as baseTest } from "@playwright/test";
import { promises, writeFileSync } from "fs";
import path from "path";

// coverage directory path, relative to this file
const istanbulCLIOutput = path.join(__dirname, "../../.nyc_output");

export const coverateTest = baseTest.extend({
  context: async ({ context }, use, testInfo) => {
    await context.addInitScript(() =>
      window.addEventListener("beforeunload", () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        return (window as any).collectIstanbulCoverage(JSON.stringify((window as any).__coverage__));
      })
    );

    await promises.mkdir(istanbulCLIOutput, {
      recursive: true,
    });

    await context.exposeFunction("collectIstanbulCoverage", (coverageJSON: string) => {
      if (coverageJSON) {
        const timestamp = Date.now();
        const filePath = path.join(istanbulCLIOutput, `playwright_coverage_${testInfo.workerIndex}-${timestamp}.json`);
        writeFileSync(filePath, coverageJSON);
      }
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(context);

    for (const page of context.pages()) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      await page.evaluate(() => (window as any).collectIstanbulCoverage(JSON.stringify((window as any).__coverage__)));
    }

    // don't close the browser when interrupting the test
    // (during development)
    if (baseTest.info().status !== "interrupted") {
      await context.close();
    }
  },
});
