import type {
  ArtifactIdentity,
  ArtifactSummaryView,
  ImageMetadataResponse,
  ParsedCertificate,
  RekorEntry,
} from "@app/client";

/**
 * View-model types to extend the raw API types generated from
 * the OpenAPI spec. Usually for enforcing a particular type,
 * or temporarily while the backend implements changes.
 */
export interface ArtifactIdentityUI extends ArtifactIdentity {
  type: "email" | "oidc-issuer" | "other";
  source: "san" | "issuer" | "other";
}

export type ArtifactOverallStatusUI = "verified" | "partially-verified" | "failed" | "unsigned" | "error" | "unknown";

export interface ArtifactSummaryViewUI extends ArtifactSummaryView {
  identities: ArtifactIdentityUI[];
  overallStatus: ArtifactOverallStatusUI;
}

export type CertificateRoleUI = "leaf" | "intermediate" | "root";

export type SignatureVerificationStatusUI = "verified" | "invalid" | "unverifiable" | "unknown";

export interface SignatureStatusUI {
  signature: SignatureVerificationStatusUI;
  rekor: "present" | "missing" | "unknown";
  chain: "valid" | "invalid" | "partial" | "unknown";
}

export interface SignatureViewUI {
  id: number;
  digest: string;
  signingCertificate: ParsedCertificate;
  // eslint-disable-next-line @typescript-eslint/array-type
  certificateChain: Array<ParsedCertificate>;
  rawBundleJson: string;
  signatureStatus: string;
  timestamp?: string;

  kind?: "hashedrekord" | "other";
  status: SignatureStatusUI;

  // temporary while backend renames to rekorEntry
  rekorEntry: RekorEntry;
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  tlogEntry: { [key: string]: unknown };
}

export interface AttestationStatusUI {
  verified: boolean;
  rekor: "present" | "missing" | "unknown";
}

export interface AttestationViewUI {
  kind?: "intoto" | "other";
  digest: string;
  id: number;
  status: AttestationStatusUI;
  // subject isn't in the backend type yet, but we use it in the UI
  subject?: string;

  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  rekorEntry: { [key: string]: unknown };
  predicateType: string;

  // temporary while backend renames to rekorEntry
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  tlogEntry: { [key: string]: unknown };
  timestamp?: string;
  signingCertificate?: ParsedCertificate;
  // eslint-disable-next-line @typescript-eslint/array-type
  certificateChain?: Array<ParsedCertificate>;
  rawBundleJson: string;
}

// high-level view model returned by the verification endpoint once it
// is extended to include structured signature/attestation/rekor data.
export interface ArtifactVerificationUI {
  artifact: ImageMetadataResponse;
  summary: ArtifactSummaryViewUI;
  signatures: SignatureViewUI[];
  attestations: AttestationViewUI[];
}
