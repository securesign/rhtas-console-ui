import { expect } from "../../assertions";
import { test } from "../../fixtures";

import { CertificatesTab } from "./CertificatesTab";
import { TrustRootPage } from "./TrustRootPage";

test.describe("Trust Root - Certificates", () => {
  test.beforeEach(async ({ page }) => {
    const trustRootPage = await TrustRootPage.build(page);
    await trustRootPage.getTabs().select("Certificates");
  });

  test("Pagination", async ({ page }) => {
    const certificatesTab = CertificatesTab.build(page);

    // Verify we are in the first page
    const pagination = await certificatesTab.getPagination();
    await expect(pagination).toBeFirstPage();
  });

  test("Sorting", async ({ page }) => {
    const certificatesTab = CertificatesTab.build(page);

    const sortDates = (a: string, b: string) => {
      return new Date(a).getTime() - new Date(b).getTime();
    };

    // Verify default sorting
    const table = await certificatesTab.getTable();
    await expect(table).toBeSortedBy("Expiration", "descending");

    const descExpirationColumn = await table.getColumn("Expiration");
    const descDates: string[] = await descExpirationColumn.allInnerTexts();
    expect(descDates).toBeSorted("descending", sortDates);

    // Change sorting to descending
    await table.clickSortBy("Expiration");
    await expect(table).toBeSortedBy("Expiration", "ascending");

    const ascExpirationColumn = await table.getColumn("Expiration");
    const ascDates: string[] = await ascExpirationColumn.allInnerTexts();
    expect(ascDates).toBeSorted("ascending", sortDates);
  });

  test("Filtering", async ({ page }) => {
    const certificatesTab = CertificatesTab.build(page);

    const toolbar = await certificatesTab.getToolbar();
    const table = await certificatesTab.getTable();

    // Filter by Subject
    await toolbar.applyFilter({ Subject: "CN=sigstore-intermediate,O=sigstore.dev" });
    await expect(table).toHaveColumnWithValue("Subject", "CN=sigstore-intermediate,O=sigstore.dev");

    await toolbar.clearAllFilters();

    // Filter by Status
    await toolbar.applyFilter({ Status: ["Expired"] });
    await expect(table).toHaveColumnWithValue("Status", "Expired");
  });
});
