import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ErrorRateCard } from "./ErrorRateCard";

describe("ErrorRateCard", () => {
  test("renders error totals and breakdown", () => {
    render(<ErrorRateCard />);

    expect(screen.getByText("2,184")).toBeInTheDocument();
    expect(screen.getByText("42.7%")).toBeInTheDocument();
    expect(screen.getByText("5xx server errors")).toBeInTheDocument();
    expect(screen.getByText("Timeouts")).toBeInTheDocument();
    expect(screen.getByText("Signature verify failures")).toBeInTheDocument();
    expect(screen.getByText("4xx client errors")).toBeInTheDocument();
  });
});
