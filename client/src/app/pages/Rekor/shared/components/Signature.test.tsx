import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Signature } from "./Signature";
import type { DSSEV001Schema, IntotoV002Schema, RekorSchema } from "rekor";

describe("Signature Component", () => {
  it("renders signature for hashedrekord type", () => {
    const spec: RekorSchema = {
      data: { hash: { algorithm: "sha256", value: "abc123" } },
      signature: { content: "my-signature", publicKey: { content: "pk" } },
    };
    render(<Signature type="hashedrekord" spec={spec} apiVersion="0.0.1" />);
    expect(screen.getByText("my-signature")).toBeInTheDocument();
  });

  it("renders signature for rekord type", () => {
    const spec: RekorSchema = {
      data: { hash: { algorithm: "sha256", value: "abc123" } },
      signature: { content: "rekord-sig", publicKey: { content: "pk" } },
    };
    render(<Signature type="rekord" spec={spec} apiVersion="0.0.1" />);
    expect(screen.getByText("rekord-sig")).toBeInTheDocument();
  });

  it("renders missing message for intoto v0.0.1", () => {
    render(<Signature type="intoto" spec={{}} apiVersion="0.0.1" />);
    expect(screen.getByText("Missing for intoto v0.0.1 entries")).toBeInTheDocument();
  });

  it("renders signature for intoto v0.0.2", () => {
    const spec: IntotoV002Schema = {
      content: {
        payloadHash: { algorithm: "sha256", value: "abc123" },
        envelope: {
          payload: "p",
          payloadType: "pt",
          signatures: [{ sig: window.btoa("decoded-sig"), publicKey: "pk" }],
        },
      },
    };
    render(<Signature type="intoto" spec={spec} apiVersion="0.0.2" />);
    expect(screen.getByText("decoded-sig")).toBeInTheDocument();
  });

  it("renders signature for dsse type", () => {
    const spec: DSSEV001Schema = {
      payloadHash: { algorithm: "sha256", value: "abc123" },
      signatures: [{ signature: "dsse-sig", verifier: "v" }],
    };
    render(<Signature type="dsse" spec={spec} apiVersion="0.0.1" />);
    expect(screen.getByText("dsse-sig")).toBeInTheDocument();
  });

  it("renders unsupported message for unknown type", () => {
    render(<Signature type="unknown" spec={{}} apiVersion="0.0.1" />);
    expect(screen.getByText("Unsupported type: unknown")).toBeInTheDocument();
  });
});
