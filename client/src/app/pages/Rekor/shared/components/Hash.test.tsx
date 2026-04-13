import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Hash } from "./Hash";
import type { DSSEV001Schema, IntotoV001Schema, IntotoV002Schema, RekorSchema } from "rekor";

describe("Hash Component", () => {
  it("renders hash for hashedrekord type", () => {
    const spec: RekorSchema = {
      data: { hash: { algorithm: "sha256", value: "abc123" } },
      signature: { content: "sig", publicKey: { content: "pk" } },
    };
    render(<Hash type="hashedrekord" spec={spec} />);
    expect(screen.getByText("sha256:abc123")).toBeInTheDocument();
  });

  it("renders hash for rekord type", () => {
    const spec: RekorSchema = {
      data: { hash: { algorithm: "sha256", value: "abc123" } },
      signature: { content: "sig", publicKey: { content: "pk" } },
    };
    render(<Hash type="rekord" spec={spec} />);
    expect(screen.getByText("sha256:abc123")).toBeInTheDocument();
  });

  it("renders hash for intoto v0.0.1", () => {
    const spec: IntotoV001Schema = {
      content: { payloadHash: { algorithm: "sha256", value: "def456" } },
      publicKey: "pk",
    };
    render(<Hash type="intoto" spec={spec} />);
    expect(screen.getByText("sha256:def456")).toBeInTheDocument();
  });

  it("renders hash for intoto v0.0.2", () => {
    const spec: IntotoV002Schema = {
      content: {
        payloadHash: { algorithm: "sha256", value: "ghi789" },
        envelope: {
          payload: "p",
          payloadType: "pt",
          signatures: [{ sig: "s", publicKey: "pk" }],
        },
      },
    };
    render(<Hash type="intoto" spec={spec} />);
    expect(screen.getByText("sha256:ghi789")).toBeInTheDocument();
  });

  it("renders hash for dsse type", () => {
    const spec: DSSEV001Schema = {
      payloadHash: { algorithm: "sha256", value: "jkl012" },
      signatures: [{ signature: "sig", verifier: "v" }],
    };
    render(<Hash type="dsse" spec={spec} />);
    expect(screen.getByText("sha256:jkl012")).toBeInTheDocument();
  });

  it("renders short hash variant", () => {
    const spec: RekorSchema = {
      data: { hash: { algorithm: "sha256", value: "abcdef1234567890" } },
      signature: { content: "sig", publicKey: { content: "pk" } },
    };
    render(<Hash type="hashedrekord" spec={spec} variant="short" />);
    expect(screen.getByText("abcdef1")).toBeInTheDocument();
  });

  it("renders unsupported message for unknown type", () => {
    render(<Hash type="unknown" spec={{}} />);
    expect(screen.getByText("Unsupported type")).toBeInTheDocument();
  });
});
