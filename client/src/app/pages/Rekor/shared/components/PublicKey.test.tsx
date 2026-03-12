import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PublicKey } from "./PublicKey";
import type { DSSEV001Schema, IntotoV001Schema, IntotoV002Schema, RekorSchema } from "rekor";

vi.mock("./HashedRekord", () => ({
  HashedRekordPublicKey: () => <div data-testid="hashedrekord-publickey">HashedRekord PublicKey</div>,
}));

vi.mock("./Intoto001", () => ({
  IntotoViewer001PublicKey: () => <div data-testid="intoto001-publickey">Intoto v0.0.1 PublicKey</div>,
}));

vi.mock("./Intoto002", () => ({
  IntotoViewer002Publickey: () => <div data-testid="intoto002-publickey">Intoto v0.0.2 PublicKey</div>,
}));

vi.mock("./DSSE", () => ({
  DSSEPublicKey: () => <div data-testid="dsse-publickey">DSSE PublicKey</div>,
}));

describe("PublicKey Component", () => {
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

  it("renders HashedRekordPublicKey for hashedrekord type", () => {
    render(<PublicKey type="hashedrekord" spec={mockSpec} apiVersion="0.0.1" />);
    expect(screen.getByTestId("hashedrekord-publickey")).toBeInTheDocument();
  });

  it("renders HashedRekordPublicKey for rekord type", () => {
    render(<PublicKey type="rekord" spec={mockSpec} apiVersion="0.0.1" />);
    expect(screen.getByTestId("hashedrekord-publickey")).toBeInTheDocument();
  });

  it("renders IntotoViewer001PublicKey for intoto v0.0.1", () => {
    const intotoSpec: IntotoV001Schema = {
      content: {
        payloadHash: {
          algorithm: "sha256",
          value: "abc123",
        },
      },
      publicKey: "publicKey",
    };
    render(<PublicKey type="intoto" spec={intotoSpec} apiVersion="0.0.1" />);
    expect(screen.getByTestId("intoto001-publickey")).toBeInTheDocument();
  });

  it("renders IntotoViewer002Publickey for intoto v0.0.2", () => {
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
    render(<PublicKey type="intoto" spec={intotoSpec} apiVersion="0.0.2" />);
    expect(screen.getByTestId("intoto002-publickey")).toBeInTheDocument();
  });

  it("renders DSSEPublicKey for dsse type", () => {
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
    render(<PublicKey type="dsse" spec={dsseSpec} apiVersion="0.0.1" />);
    expect(screen.getByTestId("dsse-publickey")).toBeInTheDocument();
  });

  it("renders unsupported message for unknown type", () => {
    render(<PublicKey type="unknown" spec={{}} apiVersion="0.0.1" />);
    expect(screen.getByText("Unsupported type: unknown")).toBeInTheDocument();
  });

  it("wraps content in a styled div", () => {
    const { container } = render(<PublicKey type="hashedrekord" spec={mockSpec} apiVersion="0.0.1" />);
    const wrapper = container.querySelector('div[style*="white-space"]');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveStyle({ whiteSpace: "pre-wrap", wordBreak: "break-all" });
  });
});
