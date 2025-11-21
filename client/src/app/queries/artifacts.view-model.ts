import type { ImageMetadataResponse } from "@app/client";

// View-model types for the Artifacts designs. These sit on top of the raw API types
// and represent exactly what the UI needs to render the artifact, signatures,
// certificate chain, attestations, and Rekor entries.

/**
 *
 */
export interface ArtifactIdentity {
  id: string;
  type: "email" | "oidc-issuer" | "other";
  value: string;
  source: "san" | "issuer" | "other";
  issuer?: string;
}

export interface TimeCoherenceSummary {
  status: "ok" | "warning" | "error" | "unknown";
  minIntegratedTime?: string; // ISO string
  maxIntegratedTime?: string; // ISO string
}

export type ArtifactOverallStatus = "verified" | "partially-verified" | "failed" | "unsigned" | "error" | "unknown";

export interface ArtifactSummaryView {
  identities: ArtifactIdentity[];
  signatureCount: number;
  attestationCount: number;
  rekorEntryCount: number;
  timeCoherence: TimeCoherenceSummary;
  overallStatus: ArtifactOverallStatus;
}

export type CertificateRole = "leaf" | "intermediate" | "root";

export interface ParsedCertificate {
  role: CertificateRole;
  subject: string;
  issuer: string;
  notBefore: string; // ISO string
  notAfter: string; // ISO string
  sans: string[];
  serialNumber?: string;
  isCa: boolean;
  pem: string;
}

export type SignatureVerificationStatus = "verified" | "invalid" | "unverifiable" | "unknown";

export interface SignatureStatus {
  signature: SignatureVerificationStatus;
  rekor: "present" | "missing" | "unknown";
  chain: "valid" | "invalid" | "partial" | "unknown";
}

export interface HashSummary {
  algorithm: string;
  value: string;
}

export interface SignatureView {
  id: string;
  kind: "hashedrekord" | "other";
  // identity: SignatureIdentity;
  hash: HashSummary;
  timestamp?: string; // ISO string for "x minutes ago" display
  status: SignatureStatus;

  /**
   * certificateChain is used to validate the signing/leaf certificate,
   * and includes the root + intermediate certificates
   */
  certificateChain: ParsedCertificate[];
  signingCertificate: ParsedCertificate; // leaf only

  // a single Rekor entry associated with this signature, once the backend
  // is updated to include it alongside the signature.
  rekorEntry?: import("@app/client").RekorEntry;
  rawBundleJson?: unknown; // or a typed SigstoreBundle
}

/**
 * small, local identity for a single signature
 */
export interface SignatureIdentity {
  san?: string;
  issuer?: string;
  issuerType?: "fulcio" | "other" | "unknown";
}

export interface AttestationStatus {
  verified: boolean;
  rekor: "present" | "missing" | "unknown";
}

export interface AttestationView {
  id: string;
  kind: "intoto" | "other";
  predicateType?: string;
  digest: HashSummary;
  subject?: string;
  issuer?: string;
  timestamp?: string; // ISO string
  signingCertificate?: ParsedCertificate; // leaf
  certificateChain?: ParsedCertificate[]; // intermediate + root
  status: AttestationStatus;
  rekorEntry?: import("@app/client").RekorEntry;
  rawStatementJson?: unknown;
  rawBundleJson?: unknown;
}

// high-level view model returned by the verification endpoint once it
// is extended to include structured signature/attestation/rekor data.
export interface ArtifactVerificationViewModel {
  artifact: ImageMetadataResponse;
  summary: ArtifactSummaryView;
  signatures: SignatureView[];
  attestations: AttestationView[];
}
