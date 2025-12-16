import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { CertificateChain } from "./CertificateChain";

test("renders certificate chain heading", () => {
  render(<CertificateChain certificateChain={[]} />);

  expect(screen.getByText("Certificate Chain")).toBeInTheDocument();
});
