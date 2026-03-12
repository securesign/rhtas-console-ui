import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Signature } from "./Signature";
import type { DSSEV001Schema, IntotoV002Schema, RekorSchema } from "rekor";

vi.mock("./HashedRekord", () => ({
  HashedRekordSignature: () => <div data-testid="hashedrekord-signature">HashedRekord Signature</div>,
}));

vi.mock("./Intoto001", () => ({
  IntotoViewer001Signature: () => <div data-testid="intoto001-signature">Intoto v0.0.1 Signature</div>,
}));

vi.mock("./Intoto002", () => ({
  IntotoViewer002Signature: () => <div data-testid="intoto002-signature">Intoto v0.0.2 Signature</div>,
}));

vi.mock("./DSSE", () => ({
  DSSESignature: () => <div data-testid="dsse-signature">DSSE Signature</div>,
}));

describe("Signature Component", () => {
  const mockSpec: RekorSchema = {
    data: {
      hash: {
        algorithm: "sha256",
        value: "abc123",
      },
    },
    signature: {
      content: "signature",
      publicKey: {
        content: "publicKey",
      },
    },
  };

  it("renders HashedRekordSignature for hashedrekord type", () => {
    render(<Signature type="hashedrekord" spec={mockSpec} apiVersion="0.0.1" />);
    expect(screen.getByTestId("hashedrekord-signature")).toBeInTheDocument();
  });

  it("renders HashedRekordSignature for rekord type", () => {
    render(<Signature type="rekord" spec={mockSpec} apiVersion="0.0.1" />);
    expect(screen.getByTestId("hashedrekord-signature")).toBeInTheDocument();
  });

  it("renders IntotoViewer001Signature for intoto v0.0.1", () => {
    render(<Signature type="intoto" spec={{}} apiVersion="0.0.1" />);
    expect(screen.getByTestId("intoto001-signature")).toBeInTheDocument();
  });

  it("renders IntotoViewer002Signature for intoto v0.0.2", () => {
    const intotoSpec: IntotoV002Schema = {
      content: {
        payloadHash: {
          algorithm: "sha256",
          value: "abc123",
        },
        envelope: {
          payload: "payload",
          payloadType: "payloadType",
          signatures: [
            {
              sig: "signature",
              publicKey: "publicKey",
            },
          ],
        },
      },
    };
    render(<Signature type="intoto" spec={intotoSpec} apiVersion="0.0.2" />);
    expect(screen.getByTestId("intoto002-signature")).toBeInTheDocument();
  });

  it("renders DSSESignature for dsse type", () => {
    const dsseSpec: DSSEV001Schema = {
      payloadHash: {
        algorithm: "sha256",
        value: "abc123",
      },
      signatures: [
        {
          signature: "signature",
          verifier: "verifier",
        },
      ],
    };
    render(<Signature type="dsse" spec={dsseSpec} apiVersion="0.0.1" />);
    expect(screen.getByTestId("dsse-signature")).toBeInTheDocument();
  });

  it("renders unsupported message for unknown type", () => {
    render(<Signature type="unknown" spec={{}} apiVersion="0.0.1" />);
    expect(screen.getByText("Unsupported type: unknown")).toBeInTheDocument();
  });
});
