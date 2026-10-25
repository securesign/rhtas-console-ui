import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ExpiringTrustAssets } from "./ExpiringTrustAssets";

describe("ExpiringTrustAssets", () => {
  test("renders asset names and expiry info", () => {
    render(<ExpiringTrustAssets />);

    expect(screen.getByText("TUF root metadata")).toBeInTheDocument();
    expect(screen.getByText("Fulcio intermediate CA")).toBeInTheDocument();
    expect(screen.getByText("CT log shard 2026")).toBeInTheDocument();
    expect(screen.getByText("Renewal runbook")).toBeInTheDocument();
  });

  test("renders expired label when assets are expired", () => {
    render(<ExpiringTrustAssets />);

    expect(screen.getByText("1 expired")).toBeInTheDocument();
  });
});
