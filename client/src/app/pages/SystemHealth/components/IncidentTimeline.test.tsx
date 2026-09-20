import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { IncidentTimeline } from "./IncidentTimeline";

describe("IncidentTimeline", () => {
  test("renders incident entries", () => {
    render(<IncidentTimeline />);

    expect(screen.getByText("TUF root metadata expired")).toBeInTheDocument();
    expect(screen.getByText("Fulcio probes started failing")).toBeInTheDocument();
    expect(screen.getByText("Rekor latency exceeded threshold")).toBeInTheDocument();
    expect(screen.getByText("On-call paged via PagerDuty")).toBeInTheDocument();
  });
});
