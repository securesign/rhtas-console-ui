import { expect, Page, test } from "@playwright/test";

import { RekorSearchPage } from "./RekorSearchPage";

const verify_search_page_has_main_sections = async (page: Page) => {
  // Verify main sections were rendered
  await expect(page.getByRole("heading", { name: "Hash" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Signature" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Public Key Certificate" }).first()).toBeVisible();
};

test.describe("Rekor Search UI", () => {
  test("Search by email", async ({ page }) => {
    const rekorSearchPage = await RekorSearchPage.build(page);
    await rekorSearchPage.applySearch("Email", "carlosthe19916@gmail.com");

    await verify_search_page_has_main_sections(page);
  });

  test("Search by hash", async ({ page }) => {
    const rekorSearchPage = await RekorSearchPage.build(page);
    await rekorSearchPage.applySearch(
      "Hash",
      "sha256:1174c40f437d2cbd0d7d14fba2b030bf5595d63e66c26e784b764ba4a0bd6780"
    );

    await verify_search_page_has_main_sections(page);
  });

  test("Search by entry uuid", async ({ page }) => {
    const rekorSearchPage = await RekorSearchPage.build(page);
    await rekorSearchPage.applySearch(
      "Entry UUID",
      "108e9186e8c5677a023bef8fb7d3eb499b3df47f26592175c2fd51442d6e14a45591b1e5d4dcff24"
    );

    await verify_search_page_has_main_sections(page);
  });

  test("Search by log index", async ({ page }) => {
    const rekorSearchPage = await RekorSearchPage.build(page);
    await rekorSearchPage.applySearch("Log Index", "380502080");

    await verify_search_page_has_main_sections(page);
  });
});
