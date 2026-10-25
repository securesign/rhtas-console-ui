import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { PipelineStatusBanner } from "./PipelineStatusBanner";

describe("PipelineStatusBanner", () => {
  test("renders danger alert with pipeline status", () => {
    render(<PipelineStatusBanner />);

    expect(screen.getByText(/signing pipeline unavailable/)).toBeInTheDocument();
    expect(screen.getByText("View incident")).toBeInTheDocument();
    expect(screen.getByText("Open runbook")).toBeInTheDocument();
  });
});
