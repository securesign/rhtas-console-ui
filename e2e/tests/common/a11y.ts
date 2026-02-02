import AxeBuilder from "@axe-core/playwright";
import type { Page, TestInfo } from "@playwright/test";

interface A11yOptions {
  /**
   * Optional label used for attachment/annotation names.
   */
  label?: string;
}

interface Violation {
  id: string;
  impact?: string | null;
  help: string;
  nodes: { target: string[] }[];
}

function formatViolations(violations: Violation[]) {
  return violations
    .map((v, i) => {
      const targets = v.nodes
        .flatMap((n) => n.target ?? [])
        .slice(0, 10)
        .map((t) => `- ${t}`)
        .join("\n");
      const more = v.nodes.length > 10 ? `\n- ... +${v.nodes.length - 10} more` : "";
      return [`${i + 1}. ${v.id}${v.impact ? ` (${v.impact})` : ""}: ${v.help}`, targets + more]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");
}

export async function runA11yAudit(page: Page, testInfo: TestInfo, opts?: A11yOptions) {
  const label = opts?.label ? `-${opts.label}` : "";
  const results = await new AxeBuilder({ page }).analyze();
  const violations = results.violations ?? [];

  if (!violations.length) return;

  const summary = `A11y: ${violations.length} axe violation(s)`;
  testInfo.annotations.push({ type: "a11y", description: summary });

  await testInfo.attach(`a11y-violations${label}.json`, {
    body: Buffer.from(JSON.stringify(results, null, 2), "utf8"),
    contentType: "application/json",
  });

  const formatted = formatViolations(violations as Violation[]);
  await testInfo.attach(`a11y-violations${label}.txt`, {
    body: Buffer.from(`${summary}\n\n${formatted}\n`, "utf8"),
    contentType: "text/plain",
  });

  // Always surface in terminal logs, but don't fail.
  // (Playwright doesn't have a "warning" status — this is the closest behavior.)
  console.warn(`${summary}\n${formatted}`);
}
