import { RENDER_DATE_FORMAT } from "@app/Constants";
import dayjs from "dayjs";
import type { LabelProps } from "@patternfly/react-core";
import type { ArtifactIdentity, ParsedCertificate } from "@app/client";

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
    let normalized = signedEntryTimestamp.replace(/-/g, "+").replace(/_/g, "/");
    const pad = normalized.length % 4;
    if (pad) {
      normalized = normalized.padEnd(normalized.length + (4 - pad), "=");
    }

    return Uint8Array.from(atob(normalized), (c) => c.charCodeAt(0));
  } catch (e) {
    console.warn("Invalid signedEntryTimestamp, could not decode:", e);
    return undefined;
  }
};

interface DownloadableSignature {
  rawBundleJson?: unknown;
  hash?: {
    value?: string | null;
  };
}

export const handleDownloadBundle = (signature: DownloadableSignature) => {
  const { rawBundleJson, hash } = signature;

  if (!rawBundleJson) {
    return;
  }

  const bundleString = typeof rawBundleJson === "string" ? rawBundleJson : JSON.stringify(rawBundleJson, null, 2);

  const blob = new Blob([bundleString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  const hashValue = typeof hash?.value === "string" ? hash.value : "";
  const hashPrefix = hashValue ? hashValue.slice(0, 12) : "bundle";
  link.download = `sigstore-bundle-${hashPrefix}.json`;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
};

/**
 * Best-effort categorization of certificate issuer for UI labels.
 * This is a convenience helper; backend may provide a richer field later.
 */
export function inferIssuerType(issuer?: string): string {
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
export function toIdentity(
  leaf?: ParsedCertificate
): { san: string | undefined; issuer: string | undefined; issuerType: string } | undefined {
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
  status: string
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
