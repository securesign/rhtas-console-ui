import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, test } from "vitest";

import { TrustCoverage } from "./TrustCoverage";

describe("TrustCoverage", () => {
  test("renders Trust Coverage heading", () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <TrustCoverage />
      </QueryClientProvider>
    );

    expect(screen.getByRole("heading", { name: "Trust Coverage" })).toBeInTheDocument();
  });
});
