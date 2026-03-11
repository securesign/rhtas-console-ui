import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Hash } from "./Hash";
import type { DSSEV001Schema, IntotoV001Schema, IntotoV002Schema, RekorSchema } from "rekor";

vi.mock("./HashedRekord", () => ({
  HashedRekordHash: () => <div data-testid="hashedrekord-hash">HashedRekord Hash</div>,
}));

vi.mock("./Intoto001", () => ({
  IntotoViewer001Hash: () => <div data-testid="intoto001-hash">Intoto v0.0.1 Hash</div>,
}));

vi.mock("./Intoto002", () => ({
  IntotoViewer002Hash: () => <div data-testid="intoto002-hash">Intoto v0.0.2 Hash</div>,
}));

vi.mock("./DSSE", () => ({
  DSSEHash: () => <div data-testid="dsse-hash">DSSE Hash</div>,
}));

describe("Hash Component", () => {
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

  it("renders HashedRekordHash for hashedrekord type", () => {
    render(<Hash type="hashedrekord" spec={mockSpec} apiVersion="0.0.1" />);
    expect(screen.getByTestId("hashedrekord-hash")).toBeInTheDocument();
  });

  it("renders HashedRekordHash for rekord type", () => {
    render(<Hash type="rekord" spec={mockSpec} apiVersion="0.0.1" />);
    expect(screen.getByTestId("hashedrekord-hash")).toBeInTheDocument();
  });

  it("renders IntotoViewer001Hash for intoto v0.0.1", () => {
    const intotoSpec: IntotoV001Schema = {
      content: {
        payloadHash: {
          algorithm: "sha256",
          value: "abc123",
        },
      },
      publicKey: "publicKey",
    };
    render(<Hash type="intoto" spec={intotoSpec} apiVersion="0.0.1" />);
    expect(screen.getByTestId("intoto001-hash")).toBeInTheDocument();
  });

  it("renders IntotoViewer002Hash for intoto v0.0.2", () => {
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
    render(<Hash type="intoto" spec={intotoSpec} apiVersion="0.0.2" />);
    expect(screen.getByTestId("intoto002-hash")).toBeInTheDocument();
  });

  it("renders DSSEHash for dsse type", () => {
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
    render(<Hash type="dsse" spec={dsseSpec} apiVersion="0.0.1" />);
    expect(screen.getByTestId("dsse-hash")).toBeInTheDocument();
  });

  it("renders unsupported message for unknown type", () => {
    render(<Hash type="unknown" spec={{}} apiVersion="0.0.1" />);
    expect(screen.getByText("Unsupported type: unknown")).toBeInTheDocument();
  });
});
