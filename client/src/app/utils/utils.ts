import { RENDER_DATE_FORMAT } from "@app/Constants";
import dayjs from "dayjs";
import type { LabelProps } from "@patternfly/react-core";
import type {
  ArtifactOverallStatus,
  ArtifactIdentity,
  ParsedCertificate,
  SignatureIdentity,
} from "@app/queries/artifacts.view-model";

// minimal shape required for eslint, uses only we actually need
// from the verification view-model
interface MinimalArtifactVerificationViewModel {
  signatures: {
    status: {
      signature: "verified" | "invalid" | "unverifiable" | "unknown";
      rekor: "present" | "missing" | "unknown";
      chain: "valid" | "invalid" | "partial" | "unknown";
    };
  }[];
  attestations: {
    status: {
      verified: boolean;
      rekor: "present" | "missing" | "unknown";
    };
  }[];
  summary: {
    timeCoherence: {
      status: "ok" | "warning" | "error" | "unknown";
    };
  };
}

export const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const copyToClipboard = async (value: string) => {
  try {
    await navigator.clipboard.writeText(value);
  } catch (err) {
    console.error("Failed to copy to clipboard", err);
  }
};

/**
 * A post-processing utility function to remove duplicates
 * from a list of identities
 * @param identities List of identities
 * @returns Deduped list of identities
 */
export const dedupeIdentities = (identities: ArtifactIdentity[]): ArtifactIdentity[] => {
  const seen = new Set<string>();

  return identities.filter((identity) => {
    const key = [identity.type, identity.value, identity.source, identity.issuer ?? ""].join("|");

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

/**
 * Computes a verification status for an artifact
 * based on verification of signatures & attestations
 * @param vm ViewModel we use for extending API data shape
 * @returns A derived status
 */
export const deriveOverallVerificationStatus = (vm: MinimalArtifactVerificationViewModel): ArtifactOverallStatus => {
  const { signatures, attestations, summary } = vm;

  const hasSignatures = signatures.length > 0;
  const hasAttestations = attestations.length > 0;

  if (!hasSignatures && !hasAttestations) {
    return "unsigned";
  }

  const allSignaturesGood =
    hasSignatures &&
    signatures.every(
      (s) => s.status.signature === "verified" && s.status.chain === "valid" && s.status.rekor === "present"
    );

  const anySignatureBad = signatures.some(
    (s) => s.status.signature === "invalid" || s.status.chain === "invalid" || s.status.rekor === "missing"
  );

  const allAttestationsGood =
    hasAttestations && attestations.every((a) => a.status.verified && a.status.rekor === "present");

  const anyAttestationBad = attestations.some((a) => !a.status.verified || a.status.rekor === "missing");

  const timeStatus = summary.timeCoherence.status;

  // if time coherence is clearly broken, treat as error.
  if (timeStatus === "error") {
    return "error";
  }

  // fully verified: all evidence good, time is ok-ish.
  if (allSignaturesGood && (!hasAttestations || allAttestationsGood) && timeStatus !== "warning") {
    return "verified";
  }

  // completely failed: there is evidence, but every bit of it is bad.
  const noGoodSignatures = hasSignatures && !signatures.some((s) => s.status.signature === "verified");
  const noGoodAttestations = hasAttestations && !attestations.some((a) => a.status.verified);

  if ((hasSignatures && noGoodSignatures) || (hasAttestations && noGoodAttestations)) {
    return "failed";
  }

  if (anySignatureBad || anyAttestationBad || timeStatus === "warning") {
    return "partially-verified";
  }

  return "unknown";
};

export const formatDate = (value?: string | null) => {
  return value ? dayjs(value).format(RENDER_DATE_FORMAT) : null;
};

// mainly used for Rekor entries
export const formatIntegratedTime = (unixSeconds: number): string => {
  return new Date(unixSeconds * 1000).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export const getCertificateStatusColor = (validTo: string) => {
  if (!validTo) return "gray";

  const expiryDate = new Date(validTo);
  const now = new Date();
  const diffMs = expiryDate.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return "red"; // expired
  if (diffDays < 30) return "orange"; // expiring soon
  return "green"; // valid
};

export const getRekorEntryType = (bodyBase64: string): string | undefined => {
  try {
    const decoded = atob(bodyBase64);
    const parsed: unknown = JSON.parse(decoded);

    if (!parsed || typeof parsed !== "object") {
      return undefined;
    }

    const maybeBody = parsed as { kind?: unknown };

    return typeof maybeBody.kind === "string" ? maybeBody.kind : undefined;
  } catch {
    return undefined;
  }
};

export const getRekorSetBytes = (signedEntryTimestamp?: string): Uint8Array | undefined => {
  if (!signedEntryTimestamp) return undefined;

  try {
    // if Rekor ever sends URL-safe base64 (- and _), normalize it:
    const normalized = signedEntryTimestamp
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(signedEntryTimestamp.length / 4) * 4, "=");

    return Uint8Array.from(atob(normalized), (c) => c.charCodeAt(0));
  } catch (e) {
    // best-effort, don't kill the UI
    console.warn("Invalid signedEntryTimestamp, could not decode:", e);
    return undefined;
  }
};

/**
 * Best-effort categorization of certificate issuer for UI labels.
 * This is a convenience helper; backend may provide a richer field later.
 */
export function inferIssuerType(issuer?: string): SignatureIdentity["issuerType"] {
  if (!issuer) return "unknown";

  const lower = issuer.toLowerCase();

  // common Sigstore/Fulcio issuers
  if (lower.includes("sigstore") || lower.includes("fulcio")) {
    return "fulcio";
  }

  return "other";
}

/**
 * Uses native string localCompare method with numeric option enabled.
 *
 * @param locale to be used by string compareFn
 */
export const localeNumericCompare = (a: string, b: string, locale: string): number =>
  a.localeCompare(b, locale ?? "en", { numeric: true });

export function relativeDateString(date: Date) {
  return `${dayjs().to(date)}`;
}

/**
 * Derives the fingerprint for a leaf certificate from its PEM value.
 * (until it can be computed on the backend)
 * @param pem Certificate PEM
 * @returns An array of colon-separated hex pairs (common fingerprint style)
 */
export async function sha256FingerprintFromPem(pem: string): Promise<string> {
  // strip PEM armor
  const b64 = pem
    .replace(/-----BEGIN CERTIFICATE-----/g, "")
    .replace(/-----END CERTIFICATE-----/g, "")
    .replace(/\s+/g, "");

  // decode base64 to bytes
  const derBytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

  // sha256 hash the DER bytes
  const hashBuffer = await crypto.subtle.digest("SHA-256", derBytes);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // format as colon-separated hex pairs (common fingerprint style)
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join(":");
}

/**
 *
 * @returns false for any falsy value (regardless of the filter value), true if (coerced to string) lowercased value contains lowercased filter value.
 */
export const stringMatcher = (filterValue: string, value: string) => {
  if (!value) return false;
  const lowerCaseItemValue = value.toLowerCase();
  const lowerCaseFilterValue = filterValue.toLowerCase();
  return lowerCaseItemValue.includes(lowerCaseFilterValue);
};

/**
 * Takes one leaf/signing cert and turns it into a lightweight SignatureIdentity
 * for use in collapsed signature/attestation rows.
 * @param leaf Leaf/signing certificate
 * @returns Single signature identity
 */
export function toIdentity(leaf?: ParsedCertificate): SignatureIdentity | undefined {
  if (!leaf) return undefined;

  const san = Array.isArray(leaf.sans) && leaf.sans.length > 0 ? leaf.sans[0] : undefined;
  const issuer = leaf.issuer || undefined;

  return {
    san,
    issuer,
    issuerType: inferIssuerType(issuer),
  };
}

/**
 * Compares all types by converting them to string.
 * Nullish entities are converted to empty string.
 * @see localeNumericCompare
 * @param locale to be used by string compareFn
 */
export const universalComparator = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  a: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  b: any,
  locale: string
) => {
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }
  return localeNumericCompare(String(a ?? ""), String(b ?? ""), locale);
};

export const verificationStatusToLabelColor = (
  status: ArtifactOverallStatus
): {
  label: string;
  color: LabelProps["color"];
} => {
  switch (status) {
    case "verified":
      return { label: "Verified", color: "green" };
    case "partially-verified":
      return { label: "Partially verified", color: "orange" };
    case "failed":
      return { label: "Verification failed", color: "red" };
    case "unsigned":
      return { label: "Not signed", color: "grey" };
    case "error":
      return { label: "Verification error", color: "red" };
    default:
      return { label: "Unknown", color: "grey" };
  }
};
