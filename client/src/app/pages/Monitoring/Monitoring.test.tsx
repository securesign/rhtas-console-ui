import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Monitoring } from "./Monitoring";

describe("Monitoring", () => {
  test("renders empty state with heading and description", () => {
    render(<Monitoring />);

    expect(screen.getByRole("heading", { name: "Monitoring & Alerting" })).toBeInTheDocument();
    expect(screen.getByText("Monitoring and alerting features will be available here.")).toBeInTheDocument();
  });
});
