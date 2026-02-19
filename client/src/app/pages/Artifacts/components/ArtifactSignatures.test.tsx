import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { ArtifactSignatures } from "./ArtifactSignatures";
import { createLeafCertificate, createSignatureView } from "@app/test/factories/certificates";

// Mock the row component to avoid rendering complexity (dayjs plugins, etc.)
vi.mock("./ArtifactSignature", () => ({
  ArtifactSignature: ({ signature }: { signature: { digest: string } }) => (
    <tr data-testid={`signature-row-${signature.digest}`}>
      <td>{signature.digest}</td>
    </tr>
  ),
}));

describe("ArtifactSignatures toolbar", () => {
  test("renders the toolbar with search input and pagination", () => {
    const signatures = [createSignatureView()];
    render(<ArtifactSignatures signatures={signatures} />);

    const toolbar = screen.getByLabelText("Signatures toolbar");
    expect(toolbar).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Find by identity")).toBeInTheDocument();
  });

  test("renders all table column headers", () => {
    render(<ArtifactSignatures signatures={[]} />);

    for (const header of ["Identity", "Digest", "Signed On", "Signed", "Chain", "Rekor"]) {
      expect(screen.getByRole("columnheader", { name: header })).toBeInTheDocument();
    }
  });

  test("renders a row for each signature", () => {
    const signatures = [
      createSignatureView({ id: 1, digest: "sha256:aaa" }),
      createSignatureView({ id: 2, digest: "sha256:bbb" }),
    ];
    render(<ArtifactSignatures signatures={signatures} />);

    expect(screen.getByTestId("signature-row-sha256:aaa")).toBeInTheDocument();
    expect(screen.getByTestId("signature-row-sha256:bbb")).toBeInTheDocument();
  });

  test("filters signatures by identity (first SAN)", async () => {
    const user = userEvent.setup();

    const signatures = [
      createSignatureView({
        id: 1,
        digest: "sha256:aaa",
        signingCertificate: createLeafCertificate({ sans: ["alice@example.com"] }),
      }),
      createSignatureView({
        id: 2,
        digest: "sha256:bbb",
        signingCertificate: createLeafCertificate({ sans: ["bob@example.com"] }),
      }),
      createSignatureView({
        id: 3,
        digest: "sha256:ccc",
        signingCertificate: createLeafCertificate({ sans: ["alice@corp.com"] }),
      }),
    ];

    render(<ArtifactSignatures signatures={signatures} />);

    // All three rows visible initially
    expect(screen.getByTestId("signature-row-sha256:aaa")).toBeInTheDocument();
    expect(screen.getByTestId("signature-row-sha256:bbb")).toBeInTheDocument();
    expect(screen.getByTestId("signature-row-sha256:ccc")).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText("Find by identity");
    await user.type(searchInput, "alice{Enter}");

    // Only alice rows remain
    expect(screen.getByTestId("signature-row-sha256:aaa")).toBeInTheDocument();
    expect(screen.queryByTestId("signature-row-sha256:bbb")).not.toBeInTheDocument();
    expect(screen.getByTestId("signature-row-sha256:ccc")).toBeInTheDocument();
  });

  test("filters signatures case-insensitively", async () => {
    const user = userEvent.setup();

    const signatures = [
      createSignatureView({
        id: 1,
        digest: "sha256:aaa",
        signingCertificate: createLeafCertificate({ sans: ["Alice@Example.com"] }),
      }),
      createSignatureView({
        id: 2,
        digest: "sha256:bbb",
        signingCertificate: createLeafCertificate({ sans: ["bob@example.com"] }),
      }),
    ];

    render(<ArtifactSignatures signatures={signatures} />);

    const searchInput = screen.getByPlaceholderText("Find by identity");
    await user.type(searchInput, "alice{Enter}");

    expect(screen.getByTestId("signature-row-sha256:aaa")).toBeInTheDocument();
    expect(screen.queryByTestId("signature-row-sha256:bbb")).not.toBeInTheDocument();
  });

  test("shows no rows when filter matches nothing", async () => {
    const user = userEvent.setup();

    const signatures = [
      createSignatureView({
        id: 1,
        digest: "sha256:aaa",
        signingCertificate: createLeafCertificate({ sans: ["alice@example.com"] }),
      }),
    ];

    render(<ArtifactSignatures signatures={signatures} />);

    const searchInput = screen.getByPlaceholderText("Find by identity");
    await user.type(searchInput, "nomatch{Enter}");

    expect(screen.queryByTestId("signature-row-sha256:aaa")).not.toBeInTheDocument();
  });

  test("renders empty table when no signatures provided", () => {
    render(<ArtifactSignatures signatures={[]} />);

    expect(screen.getByLabelText("Signatures toolbar")).toBeInTheDocument();
    expect(screen.getByLabelText("Signatures Table")).toBeInTheDocument();
  });
});
