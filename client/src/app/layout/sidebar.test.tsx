import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";
import { SidebarApp } from "./sidebar";

const mockFeatures = { monitoringAlerting: false };

vi.mock("@app/hooks/useFeatureFlags", () => ({
  useFeatureFlags: () => ({ features: mockFeatures }),
}));

function renderSidebar() {
  return render(
    <MemoryRouter>
      <SidebarApp />
    </MemoryRouter>
  );
}

describe("SidebarApp", () => {
  test("renders core navigation links", () => {
    renderSidebar();

    expect(screen.getByRole("link", { name: "Trust Root" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Artifacts" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Rekor Search" })).toBeInTheDocument();
  });

  test("hides TrustCoverage link when feature flag is off", () => {
    mockFeatures.monitoringAlerting = false;
    renderSidebar();

    expect(screen.queryByRole("link", { name: "Trust Coverage" })).not.toBeInTheDocument();
  });

  test("shows TrustCoverage link when feature flag is on", () => {
    mockFeatures.monitoringAlerting = true;
    renderSidebar();

    expect(screen.getByRole("link", { name: "Trust Coverage" })).toBeInTheDocument();
  });
});
