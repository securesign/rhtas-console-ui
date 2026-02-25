import type { AttestationView, ParsedCertificate, SignatureView } from "@app/client";

export function createLeafCertificate(overrides: Partial<ParsedCertificate> = {}): ParsedCertificate {
  return {
    subject: "CN=test@example.com",
    isCa: false,
    issuer: "CN=Fulcio Root CA",
    notBefore: "2024-01-01T00:00:00Z",
    notAfter: "2025-01-01T00:00:00Z",
    pem: "",
    role: "intermediate",
    serialNumber: "123456",
    sans: ["test@example.com"],
    ...overrides,
  };
}

export function createSignatureView(overrides: Partial<SignatureView> = {}): SignatureView {
  return {
    id: 1,
    digest: "sha256:abc123",
    signingCertificate: createLeafCertificate(),
    certificateChain: [],
    rawBundleJson: "{}",
    timestamp: "2024-06-15T10:30:00Z",
    signatureStatus: { signature: "verified", chain: "verified", rekor: "verified" },
    ...overrides,
  };
}

export function createAttestationView(overrides: Partial<AttestationView> = {}): AttestationView {
  return {
    id: 1,
    digest: "sha256:def456",
    signingCertificate: createLeafCertificate(),
    certificateChain: [],
    type: "intoto",
    rawBundleJson: "{}",
    rawStatementJson: "{}",
    predicateType: "https://slsa.dev/provenance/v1",
    timestamp: "2024-06-15T10:30:00Z",
    attestationStatus: { attestation: "verified", chain: "verified", rekor: "verified" },
    ...overrides,
  };
}
