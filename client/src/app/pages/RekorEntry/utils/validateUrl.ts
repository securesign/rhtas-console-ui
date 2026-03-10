export function validateUrl(url?: string): boolean {
  if (!url) return false;
  return isAcceptedProtocol(url) && isValidUrl(url);
}

/**
 * Checks if the given URL is using an accepted protocol.
 * @param url The URL to validate.
 * @returns True if the URL is valid, false otherwise.
 */
export function isAcceptedProtocol(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return ["https:"].includes(parsedUrl.protocol);
  } catch (_error) {
    return false;
  }
}

/**
 * Checks if the given string is a valid URL, based on:
 * 1) http(s) protocol; 2) valid alphanumeric & special chars;
 * 3) combined length of subdomain & domain must be between 2 and 256
 * https://regex101.com/r/ecDRn6/1
 * @param url The URL to validate.
 * @returns True if the URL is valid, false otherwise.
 */
export const isValidUrl = (url: string): boolean => {
  /* eslint-disable no-useless-escape */
  const regexVal = /^(http(s)?:\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)$/gm;

  try {
    return regexVal.test(url);
  } catch (_error) {
    return false;
  }
};
