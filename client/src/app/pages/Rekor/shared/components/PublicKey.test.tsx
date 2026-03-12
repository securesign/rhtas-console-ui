import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PublicKey } from "./PublicKey";
import type { RekorSchema } from "rekor";

vi.mock("../utils/spec", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../utils/spec")>();
  return {
    ...actual,
    getPublicKeyContent: vi.fn().mockReturnValue("decoded-public-key-content"),
    isPublicKeyValid: vi.fn().mockReturnValue(true),
  };
});

describe("PublicKey Component", () => {
  const mockSpec: RekorSchema = {
    data: { hash: { algorithm: "sha256", value: "abc123" } },
    signature: { content: "sig", publicKey: { content: window.btoa("pk-content") } },
  };

  it("renders public key content", () => {
    render(<PublicKey type="hashedrekord" spec={mockSpec} apiVersion="0.0.1" />);
    expect(screen.getByText("decoded-public-key-content")).toBeInTheDocument();
  });

  it("renders validity indicator when variant is validity", () => {
    render(<PublicKey type="hashedrekord" spec={mockSpec} apiVersion="0.0.1" variant="validity" />);
    expect(screen.getByText("Valid")).toBeInTheDocument();
  });

  it("wraps content in a styled div", () => {
    const { container } = render(<PublicKey type="hashedrekord" spec={mockSpec} apiVersion="0.0.1" />);
    const wrapper = container.querySelector('div[style*="white-space"]');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveStyle({ whiteSpace: "pre-wrap", wordBreak: "break-all" });
  });

  it("renders unsupported message for unknown type", async () => {
    const { getPublicKeyContent } = await import("../utils/spec");
    vi.mocked(getPublicKeyContent).mockReturnValueOnce(null);
    render(<PublicKey type="unknown" spec={{}} apiVersion="0.0.1" />);
    expect(screen.getByText("Unsupported type: unknown")).toBeInTheDocument();
  });
});
