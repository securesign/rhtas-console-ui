import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { ArtifactAttestations } from "./ArtifactAttestations";
import { createAttestationView, createLeafCertificate } from "@app/test/factories/certificates";

// Mock the row component to avoid rendering complexity (dayjs plugins, etc.)
vi.mock("./ArtifactAttestation", () => ({
  ArtifactAttestation: ({ attestation }: { attestation: { digest: string } }) => (
    <tr data-testid={`attestation-row-${attestation.digest}`}>
      <td>{attestation.digest}</td>
    </tr>
  ),
}));

describe("ArtifactAttestations toolbar", () => {
  test("renders the toolbar with search input and pagination", () => {
    const attestations = [createAttestationView()];
    render(<ArtifactAttestations attestations={attestations} />);

    const toolbar = screen.getByLabelText("Attestations toolbar");
    expect(toolbar).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Find by identity")).toBeInTheDocument();
  });

  test("renders all table column headers", () => {
    render(<ArtifactAttestations attestations={[]} />);

    for (const header of ["Identity", "Digest", "Attestation Type", "Timestamp", "Attestation", "Rekor"]) {
      expect(screen.getByRole("columnheader", { name: header })).toBeInTheDocument();
    }
  });

  test("renders a row for each attestation", () => {
    const attestations = [
      createAttestationView({ id: 1, digest: "sha256:aaa" }),
      createAttestationView({ id: 2, digest: "sha256:bbb" }),
    ];
    render(<ArtifactAttestations attestations={attestations} />);

    expect(screen.getByTestId("attestation-row-sha256:aaa")).toBeInTheDocument();
    expect(screen.getByTestId("attestation-row-sha256:bbb")).toBeInTheDocument();
  });

  test("filters attestations by identity", async () => {
    const user = userEvent.setup();

    const attestations = [
      createAttestationView({
        id: 1,
        digest: "sha256:aaa",
        signingCertificate: createLeafCertificate({ sans: ["alice@example.com"] }),
      }),
      createAttestationView({
        id: 2,
        digest: "sha256:bbb",
        signingCertificate: createLeafCertificate({ sans: ["bob@example.com"] }),
      }),
      createAttestationView({
        id: 3,
        digest: "sha256:ccc",
        signingCertificate: createLeafCertificate({ sans: ["alice@corp.com"] }),
      }),
    ];

    render(<ArtifactAttestations attestations={attestations} />);

    // All three rows visible initially
    expect(screen.getByTestId("attestation-row-sha256:aaa")).toBeInTheDocument();
    expect(screen.getByTestId("attestation-row-sha256:bbb")).toBeInTheDocument();
    expect(screen.getByTestId("attestation-row-sha256:ccc")).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText("Find by identity");
    await user.type(searchInput, "alice{Enter}");

    // Only alice rows remain
    expect(screen.getByTestId("attestation-row-sha256:aaa")).toBeInTheDocument();
    expect(screen.queryByTestId("attestation-row-sha256:bbb")).not.toBeInTheDocument();
    expect(screen.getByTestId("attestation-row-sha256:ccc")).toBeInTheDocument();
  });

  test("filters attestations case-insensitively", async () => {
    const user = userEvent.setup();

    const attestations = [
      createAttestationView({
        id: 1,
        digest: "sha256:aaa",
        signingCertificate: createLeafCertificate({ sans: ["Alice@Example.com"] }),
      }),
      createAttestationView({
        id: 2,
        digest: "sha256:bbb",
        signingCertificate: createLeafCertificate({ sans: ["bob@example.com"] }),
      }),
    ];

    render(<ArtifactAttestations attestations={attestations} />);

    const searchInput = screen.getByPlaceholderText("Find by identity");
    await user.type(searchInput, "alice{Enter}");

    expect(screen.getByTestId("attestation-row-sha256:aaa")).toBeInTheDocument();
    expect(screen.queryByTestId("attestation-row-sha256:bbb")).not.toBeInTheDocument();
  });

  test("shows no rows when filter matches nothing", async () => {
    const user = userEvent.setup();

    const attestations = [
      createAttestationView({
        id: 1,
        digest: "sha256:aaa",
        signingCertificate: createLeafCertificate({ sans: ["alice@example.com"] }),
      }),
    ];

    render(<ArtifactAttestations attestations={attestations} />);

    const searchInput = screen.getByPlaceholderText("Find by identity");
    await user.type(searchInput, "nomatch{Enter}");

    expect(screen.queryByTestId("attestation-row-sha256:aaa")).not.toBeInTheDocument();
  });

  test("handles attestations without signing certificate", async () => {
    const user = userEvent.setup();

    const attestations = [
      createAttestationView({
        id: 1,
        digest: "sha256:aaa",
        signingCertificate: undefined,
      }),
      createAttestationView({
        id: 2,
        digest: "sha256:bbb",
        signingCertificate: createLeafCertificate({ sans: ["bob@example.com"] }),
      }),
    ];

    render(<ArtifactAttestations attestations={attestations} />);

    // Filter should exclude the attestation without a certificate (empty string won't match "bob")
    const searchInput = screen.getByPlaceholderText("Find by identity");
    await user.type(searchInput, "bob{Enter}");

    expect(screen.queryByTestId("attestation-row-sha256:aaa")).not.toBeInTheDocument();
    expect(screen.getByTestId("attestation-row-sha256:bbb")).toBeInTheDocument();
  });

  test("renders empty table when no attestations provided", () => {
    render(<ArtifactAttestations attestations={[]} />);

    expect(screen.getByLabelText("Attestations toolbar")).toBeInTheDocument();
    expect(screen.getByLabelText("Artifact Attestation Table")).toBeInTheDocument();
  });
});
