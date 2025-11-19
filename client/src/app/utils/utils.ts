import { RENDER_DATE_FORMAT } from "@app/Constants";
import dayjs from "dayjs";
import type { ArtifactVerificationViewModel, ArtifactOverallStatus } from "@app/queries/artifacts";

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

/**
 * Computes a verification status for an artifact
 * based on verification of signatures & attestations
 * @param vm ViewModel we use for extending API data shape
 * @returns A derived status
 */
export function deriveOverallVerificationStatus(vm: MinimalArtifactVerificationViewModel): ArtifactOverallStatus {
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
}

export const formatDate = (value?: string | null) => {
  return value ? dayjs(value).format(RENDER_DATE_FORMAT) : null;
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

/**
 * Uses native string localCompare method with numeric option enabled.
 *
 * @param locale to be used by string compareFn
 */
export const localeNumericCompare = (a: string, b: string, locale: string): number =>
  a.localeCompare(b, locale ?? "en", { numeric: true });

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
