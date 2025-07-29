import { RENDER_DATE_FORMAT } from "@app/Constants";
import dayjs from "dayjs";

export const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

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
