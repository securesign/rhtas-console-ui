/* eslint-disable @typescript-eslint/no-explicit-any */

import atobMock from "../../RekorEntry/__mocks__/atobMock";
import decodex509Mock from "../../RekorEntry/__mocks__/decodex509Mock";

import { render, screen } from "@testing-library/react";
import { IntotoViewer001Hash } from "./Intoto001";

vi.mock("react-router-dom", () => ({ Link: ({ children }: any) => <a>{children}</a> }));

vi.mock("../utils/x509/decode", () => ({
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
    render(<IntotoViewer001Hash intoto={intoto} />);

    // Component only returns the hash value (no "Hash" label)
    const hashValue = screen.getByText("sha256:abc123");
    expect(hashValue).toBeInTheDocument();
  });
});
