import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ServiceStatusCard } from "./ServiceStatusCard";

describe("ServiceStatusCard", () => {
  test("renders service name and status", () => {
    render(<ServiceStatusCard name="Fulcio" status="healthy" detail="All good" />);

    expect(screen.getByText("Fulcio")).toBeInTheDocument();
    expect(screen.getByText("healthy")).toBeInTheDocument();
    expect(screen.getByText("All good")).toBeInTheDocument();
  });

  test("renders unhealthy status", () => {
    render(<ServiceStatusCard name="Rekor" status="unhealthy" detail="Service down" />);

    expect(screen.getByText("Rekor")).toBeInTheDocument();
    expect(screen.getByText("unhealthy")).toBeInTheDocument();
  });

  test("renders unknown status", () => {
    render(<ServiceStatusCard name="TUF" status="unknown" detail="No data" />);

    expect(screen.getByText("TUF")).toBeInTheDocument();
    expect(screen.getByText("unknown")).toBeInTheDocument();
  });
});
