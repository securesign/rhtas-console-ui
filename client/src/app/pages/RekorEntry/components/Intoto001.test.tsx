/* eslint-disable @typescript-eslint/no-explicit-any */

import atobMock from "../__mocks__/atobMock";
import decodex509Mock from "../__mocks__/decodex509Mock";

import { render, screen } from "@testing-library/react";
import { IntotoViewer001 } from "./Intoto001";

vi.mock("react-router-dom", () => ({ Link: ({ children }: any) => <a>{children}</a> }));

vi.mock("../x509/decode", () => ({
  decodex509: decodex509Mock,
}));

describe("IntotoViewer001", () => {
  beforeAll(() => {
    atobMock();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("should render the payload hash and provide a link to the hash page", () => {
    const intoto = {
      content: {
        payloadHash: {
          algorithm: "sha256",
          value: "abc123",
        },
      },
      publicKey: "123",
    };

    // @ts-expect-error allowed
    render(<IntotoViewer001 intoto={intoto} />);

    const hashLink = screen.getByText("Hash");
    expect(hashLink).toBeInTheDocument();

    const hashValue = screen.getByText("sha256:abc123");
    expect(hashValue).toBeInTheDocument();
  });
});
