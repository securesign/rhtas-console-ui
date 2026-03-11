/* eslint-disable @typescript-eslint/no-explicit-any */

import atobMock from "../__mocks__/atobMock";
import decodex509Mock from "../__mocks__/decodex509Mock";

vi.mock("react-router-dom", () => ({ Link: ({ children }: any) => <a>{children}</a> }));

vi.mock("../utils/x509/decode", () => ({
  decodex509: decodex509Mock,
}));

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DSSEHash, DSSEPublicKey, DSSESignature } from "./DSSE";
import type { DSSEV001Schema } from "rekor";

describe("DSSEViewer Component", () => {
  beforeAll(() => {
    vi.clearAllMocks();
    atobMock();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  const mockDSSE: DSSEV001Schema = {
    payloadHash: {
      algorithm: "sha256",
      value: "exampleHashValue",
    },
    signatures: [
      {
        signature: "exampleSignature",
        verifier: "-----BEGIN CERTIFICATE-----\nexamplePublicKey\n-----END CERTIFICATE-----",
      },
    ],
  };

  it("displays the payload hash correctly", () => {
    render(<DSSEHash dsse={mockDSSE} />);
    expect(screen.getByText(`${mockDSSE.payloadHash?.algorithm}:${mockDSSE.payloadHash?.value}`)).toBeInTheDocument();
  });

  it("displays the signature correctly", () => {
    render(<DSSESignature dsse={mockDSSE} />);
    expect(screen.getByText(mockDSSE.signatures![0].signature)).toBeInTheDocument();
  });

  it("displays the public key certificate title and content correctly", () => {
    render(<DSSEPublicKey dsse={mockDSSE} />);
    // Component renders YAML dump of decoded certificate
    expect(screen.getByText(/publicKey:/)).toBeInTheDocument();
    expect(screen.getByText(/subject:/)).toBeInTheDocument();
  });
});
