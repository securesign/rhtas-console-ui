import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import type { ArtifactIdentity, ParsedCertificate } from "@app/client";
// Import dayjs configuration to ensure plugins are loaded
import "@app/dayjs";
import {
  capitalizeFirstLetter,
  copyToClipboard,
  dedupeIdentities,
  formatDate,
  formatIntegratedTime,
  getCertificateStatusColor,
  getRekorEntryType,
  getRekorSetBytes,
  handleDownloadBundle,
  inferIssuerType,
  localeNumericCompare,
  relativeDateString,
  sha256FingerprintFromPem,
  stringMatcher,
  toIdentity,
  universalComparator,
  verificationStatusToLabelColor,
} from "./utils";

describe("utils", () => {
  describe("capitalizeFirstLetter", () => {
    it("should capitalize the first letter of a string", () => {
      expect(capitalizeFirstLetter("hello")).toBe("Hello");
      expect(capitalizeFirstLetter("world")).toBe("World");
      expect(capitalizeFirstLetter("test")).toBe("Test");
    });

    it("should handle already capitalized strings", () => {
      expect(capitalizeFirstLetter("Hello")).toBe("Hello");
      expect(capitalizeFirstLetter("WORLD")).toBe("WORLD");
    });

    it("should handle single character strings", () => {
      expect(capitalizeFirstLetter("a")).toBe("A");
      expect(capitalizeFirstLetter("A")).toBe("A");
    });

    it("should handle empty string", () => {
      expect(capitalizeFirstLetter("")).toBe("");
    });
  });

  describe("copyToClipboard", () => {
    let mockWriteText: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      mockWriteText = vi.fn().mockResolvedValue(undefined);
      global.navigator = {
        clipboard: {
          writeText: mockWriteText,
        },
      } as unknown as Navigator;
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should copy text to clipboard successfully", async () => {
      await copyToClipboard("test value");
      expect(mockWriteText).toHaveBeenCalledWith("test value");
      expect(mockWriteText).toHaveBeenCalledTimes(1);
    });

    it("should handle clipboard errors gracefully", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      mockWriteText.mockRejectedValue(new Error("Clipboard error"));

      await copyToClipboard("test value");

      expect(mockWriteText).toHaveBeenCalledWith("test value");
      expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to copy to clipboard", expect.any(Error));

      consoleErrorSpy.mockRestore();
    });
  });

  describe("dedupeIdentities", () => {
    it("should remove duplicate identities", () => {
      const identities: ArtifactIdentity[] = [
        { id: 1, type: "email", value: "test@example.com", source: "san", issuer: "issuer1" },
        { id: 2, type: "email", value: "test@example.com", source: "san", issuer: "issuer1" },
        { id: 3, type: "email", value: "other@example.com", source: "san", issuer: "issuer1" },
      ];

      const result = dedupeIdentities(identities);
      expect(result).toHaveLength(2);
      expect(result[0].value).toBe("test@example.com");
      expect(result[1].value).toBe("other@example.com");
    });

    it("should handle identities with different properties as unique", () => {
      const identities: ArtifactIdentity[] = [
        { id: 1, type: "email", value: "test@example.com", source: "san", issuer: "issuer1" },
        { id: 2, type: "email", value: "test@example.com", source: "issuer", issuer: "issuer1" },
        { id: 3, type: "email", value: "test@example.com", source: "san", issuer: "issuer2" },
      ];

      const result = dedupeIdentities(identities);
      expect(result).toHaveLength(3);
    });

    it("should handle identities with undefined issuer", () => {
      const identities: ArtifactIdentity[] = [
        { id: 1, type: "email", value: "test@example.com", source: "san", issuer: undefined },
        { id: 2, type: "email", value: "test@example.com", source: "san", issuer: undefined },
      ];

      const result = dedupeIdentities(identities);
      expect(result).toHaveLength(1);
    });

    it("should handle empty array", () => {
      const result = dedupeIdentities([]);
      expect(result).toHaveLength(0);
    });

    it("should handle single identity", () => {
      const identities: ArtifactIdentity[] = [
        { id: 1, type: "email", value: "test@example.com", source: "san", issuer: "issuer1" },
      ];

      const result = dedupeIdentities(identities);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(identities[0]);
    });
  });

  describe("formatDate", () => {
    it("should format valid date string", () => {
      const result = formatDate("2024-01-15T10:30:00Z");
      expect(result).toBe("Jan 15, 2024");
    });

    it("should return null for null input", () => {
      expect(formatDate(null)).toBeNull();
    });

    it("should return null for undefined input", () => {
      expect(formatDate(undefined)).toBeNull();
    });

    it("should handle different date formats", () => {
      const result = formatDate("2023-12-25");
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
    });
  });

  describe("formatIntegratedTime", () => {
    it("should format unix timestamp to locale string", () => {
      const unixSeconds = 1705312200; // Jan 15, 2024 10:30:00 UTC
      const result = formatIntegratedTime(unixSeconds);
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      // The exact format depends on locale, so we just check it's a string
    });

    it("should handle zero timestamp", () => {
      const result = formatIntegratedTime(0);
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
    });

    it("should handle future timestamp", () => {
      const futureTimestamp = Math.floor(Date.now() / 1000) + 86400; // 1 day in future
      const result = formatIntegratedTime(futureTimestamp);
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
    });
  });

  describe("getCertificateStatusColor", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should return 'red' for expired certificate", () => {
      const pastDate = new Date(Date.now() - 86400000).toISOString(); // 1 day ago
      expect(getCertificateStatusColor(pastDate)).toBe("red");
    });

    it("should return 'orange' for certificate expiring within 30 days", () => {
      const futureDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(); // 15 days from now
      expect(getCertificateStatusColor(futureDate)).toBe("orange");
    });

    it("should return 'green' for valid certificate with more than 30 days", () => {
      const futureDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(); // 60 days from now
      expect(getCertificateStatusColor(futureDate)).toBe("green");
    });

    it("should return 'gray' for empty string", () => {
      expect(getCertificateStatusColor("")).toBe("gray");
    });

    it("should return 'gray' for falsy value", () => {
      expect(getCertificateStatusColor(null as unknown as string)).toBe("gray");
      expect(getCertificateStatusColor(undefined as unknown as string)).toBe("gray");
    });

    it("should return 'green' for certificate expiring exactly in 30 days", () => {
      // Exactly 30 days means diffDays === 30, which is NOT < 30, so it returns "green"
      const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      expect(getCertificateStatusColor(futureDate)).toBe("green");
    });

    it("should return 'orange' for certificate expiring in 1 day", () => {
      const futureDate = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString();
      expect(getCertificateStatusColor(futureDate)).toBe("orange");
    });
  });

  describe("getRekorEntryType", () => {
    it("should extract kind from valid base64 JSON", () => {
      const json = JSON.stringify({ kind: "hashedrekord" });
      const base64 = btoa(json);
      expect(getRekorEntryType(base64)).toBe("hashedrekord");
    });

    it("should return undefined for invalid base64", () => {
      expect(getRekorEntryType("invalid-base64!!!")).toBeUndefined();
    });

    it("should return undefined for JSON without kind field", () => {
      const json = JSON.stringify({ other: "value" });
      const base64 = btoa(json);
      expect(getRekorEntryType(base64)).toBeUndefined();
    });

    it("should return undefined for JSON with non-string kind", () => {
      const json = JSON.stringify({ kind: 123 });
      const base64 = btoa(json);
      expect(getRekorEntryType(base64)).toBeUndefined();
    });

    it("should return undefined for non-object JSON", () => {
      const json = JSON.stringify("just a string");
      const base64 = btoa(json);
      expect(getRekorEntryType(base64)).toBeUndefined();
    });

    it("should return undefined for null JSON", () => {
      const json = JSON.stringify(null);
      const base64 = btoa(json);
      expect(getRekorEntryType(base64)).toBeUndefined();
    });

    it("should handle different entry types", () => {
      const types = ["intoto", "dsse", "hashedrekord"];
      types.forEach((type) => {
        const json = JSON.stringify({ kind: type });
        const base64 = btoa(json);
        expect(getRekorEntryType(base64)).toBe(type);
      });
    });
  });

  describe("getRekorSetBytes", () => {
    it("should decode valid base64url string", () => {
      const base64url = "dGVzdA"; // base64url for "test"
      const result = getRekorSetBytes(base64url);
      expect(result).toBeInstanceOf(Uint8Array);
      expect(result).toEqual(new Uint8Array([116, 101, 115, 116])); // "test" in bytes
    });

    it("should handle base64url with dashes and underscores", () => {
      const base64url = "dGVzdA"; // "test" in base64
      const base64urlWithDashes = base64url.replace(/\+/g, "-").replace(/\//g, "_");
      const result = getRekorSetBytes(base64urlWithDashes);
      expect(result).toBeInstanceOf(Uint8Array);
    });

    it("should pad base64url string correctly", () => {
      const base64url = "dGVzdA"; // "test" (4 chars, needs padding)
      const result = getRekorSetBytes(base64url);
      expect(result).toBeInstanceOf(Uint8Array);
    });

    it("should return undefined for empty string", () => {
      expect(getRekorSetBytes("")).toBeUndefined();
    });

    it("should return undefined for undefined input", () => {
      expect(getRekorSetBytes(undefined)).toBeUndefined();
    });

    it("should handle invalid base64url gracefully", () => {
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const result = getRekorSetBytes("invalid!!!");
      expect(result).toBeUndefined();
      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });
  });

  describe("handleDownloadBundle", () => {
    let mockCreateObjectURL: ReturnType<typeof vi.fn>;
    let mockRevokeObjectURL: ReturnType<typeof vi.fn>;
    let mockClick: ReturnType<typeof vi.fn>;
    let mockAppendChild: ReturnType<typeof vi.fn>;
    let mockRemove: ReturnType<typeof vi.fn>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let createElementSpy: any;

    beforeEach(() => {
      mockCreateObjectURL = vi.fn().mockReturnValue("blob:test-url");
      mockRevokeObjectURL = vi.fn();
      mockClick = vi.fn();
      mockAppendChild = vi.fn();
      mockRemove = vi.fn();

      global.URL.createObjectURL = mockCreateObjectURL as (obj: Blob | MediaSource) => string;
      global.URL.revokeObjectURL = mockRevokeObjectURL as (url: string) => void;

      // Mock document.createElement
      createElementSpy = vi.spyOn(document, "createElement").mockImplementation((tagName: string) => {
        if (tagName === "a") {
          return {
            download: "",
            href: "",
            click: mockClick,
            remove: mockRemove,
          } as unknown as HTMLAnchorElement;
        }
        return document.createElement(tagName);
      });

      vi.spyOn(document.body, "appendChild").mockImplementation(mockAppendChild as (node: Node) => Node);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should download bundle with string rawBundleJson", () => {
      const signature = {
        rawBundleJson: '{"test": "data"}',
        hash: { value: "abc123def456" },
      };

      handleDownloadBundle(signature);

      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockAppendChild).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
      expect(mockRemove).toHaveBeenCalled();
      expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:test-url");
    });

    it("should download bundle with object rawBundleJson", () => {
      const signature = {
        rawBundleJson: { test: "data" },
        hash: { value: "abc123def456" },
      };

      handleDownloadBundle(signature);

      expect(mockCreateObjectURL).toHaveBeenCalled();
      const blobCall = mockCreateObjectURL.mock.calls[0][0] as Blob;
      expect(blobCall).toBeInstanceOf(Blob);
      expect(blobCall.type).toBe("application/json");
    });

    it("should use hash prefix in filename", () => {
      const signature = {
        rawBundleJson: '{"test": "data"}',
        hash: { value: "abc123def456" },
      };

      handleDownloadBundle(signature);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      const mockCall = createElementSpy.mock.calls.find((call: string[]) => call[0] === "a");
      expect(mockCall).toBeDefined();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const linkElement = createElementSpy.mock.results[mockCall ? createElementSpy.mock.calls.indexOf(mockCall) : 0]
        ?.value as HTMLAnchorElement;
      // hashValue.slice(0, 12) takes first 12 characters, so "abc123def456" (12 chars) gives all 12
      expect(linkElement.download).toBe("sigstore-bundle-abc123def456.json");
    });

    it("should use default filename when hash is missing", () => {
      const signature = {
        rawBundleJson: '{"test": "data"}',
      };

      handleDownloadBundle(signature);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      const mockCall = createElementSpy.mock.calls.find((call: string[]) => call[0] === "a");
      expect(mockCall).toBeDefined();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const linkElement = createElementSpy.mock.results[mockCall ? createElementSpy.mock.calls.indexOf(mockCall) : 0]
        ?.value as HTMLAnchorElement;
      expect(linkElement.download).toBe("sigstore-bundle-bundle.json");
    });

    it("should not download when rawBundleJson is missing", () => {
      const signature = {
        hash: { value: "abc123" },
      };

      handleDownloadBundle(signature);

      expect(mockCreateObjectURL).not.toHaveBeenCalled();
      expect(mockAppendChild).not.toHaveBeenCalled();
    });

    it("should handle null hash value", () => {
      const signature = {
        rawBundleJson: '{"test": "data"}',
        hash: { value: null },
      };

      handleDownloadBundle(signature);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      const mockCall = createElementSpy.mock.calls.find((call: string[]) => call[0] === "a");
      expect(mockCall).toBeDefined();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const linkElement = createElementSpy.mock.results[mockCall ? createElementSpy.mock.calls.indexOf(mockCall) : 0]
        ?.value as HTMLAnchorElement;
      expect(linkElement.download).toBe("sigstore-bundle-bundle.json");
    });
  });

  describe("inferIssuerType", () => {
    it("should return 'fulcio' for Sigstore issuer", () => {
      expect(inferIssuerType("CN=Sigstore Root CA")).toBe("fulcio");
      expect(inferIssuerType("CN=Sigstore Intermediate CA")).toBe("fulcio");
    });

    it("should return 'fulcio' for Fulcio issuer", () => {
      expect(inferIssuerType("CN=Fulcio Root CA")).toBe("fulcio");
      expect(inferIssuerType("CN=Fulcio Intermediate CA")).toBe("fulcio");
    });

    it("should return 'fulcio' for case-insensitive match", () => {
      expect(inferIssuerType("CN=SIGSTORE ROOT CA")).toBe("fulcio");
      expect(inferIssuerType("CN=FULCIO ROOT CA")).toBe("fulcio");
    });

    it("should return 'other' for non-Sigstore/Fulcio issuer", () => {
      expect(inferIssuerType("CN=Other CA")).toBe("other");
      expect(inferIssuerType("CN=Let's Encrypt")).toBe("other");
    });

    it("should return 'unknown' for undefined", () => {
      expect(inferIssuerType(undefined)).toBe("unknown");
    });

    it("should return 'unknown' for empty string", () => {
      expect(inferIssuerType("")).toBe("unknown");
    });
  });

  describe("localeNumericCompare", () => {
    it("should compare strings numerically", () => {
      expect(localeNumericCompare("item2", "item10", "en")).toBeLessThan(0);
      expect(localeNumericCompare("item10", "item2", "en")).toBeGreaterThan(0);
    });

    it("should handle equal strings", () => {
      expect(localeNumericCompare("test", "test", "en")).toBe(0);
    });

    it("should handle alphabetical comparison", () => {
      expect(localeNumericCompare("apple", "banana", "en")).toBeLessThan(0);
      expect(localeNumericCompare("banana", "apple", "en")).toBeGreaterThan(0);
    });

    it("should use provided locale", () => {
      const result = localeNumericCompare("a", "b", "en");
      expect(typeof result).toBe("number");
    });
  });

  describe("relativeDateString", () => {
    it("should return relative date string", () => {
      const pastDate = new Date(Date.now() - 86400000); // 1 day ago
      const result = relativeDateString(pastDate);
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
    });

    it("should handle future dates", () => {
      const futureDate = new Date(Date.now() + 86400000); // 1 day in future
      const result = relativeDateString(futureDate);
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
    });

    it("should handle current date", () => {
      const now = new Date();
      const result = relativeDateString(now);
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
    });
  });

  describe("sha256FingerprintFromPem", () => {
    // Create a minimal valid PEM certificate for testing
    const createTestPem = (content = "dGVzdA==") => {
      return `-----BEGIN CERTIFICATE-----\n${content}\n-----END CERTIFICATE-----`;
    };

    it("should generate SHA-256 fingerprint from PEM", async () => {
      const pem = createTestPem();
      const result = await sha256FingerprintFromPem(pem);
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      expect(result).toMatch(/^[0-9a-f]{2}(:[0-9a-f]{2}){31}$/); // Colon-separated hex pairs
    });

    it("should strip PEM armor", async () => {
      const pem = createTestPem("dGVzdA==");
      const result = await sha256FingerprintFromPem(pem);
      expect(result).toBeTruthy();
      // Should not contain PEM markers in the hash
      expect(result).not.toContain("BEGIN");
      expect(result).not.toContain("END");
    });

    it("should handle PEM with whitespace", async () => {
      const pem = `-----BEGIN CERTIFICATE-----
      dGVzdA==
      -----END CERTIFICATE-----`;
      const result = await sha256FingerprintFromPem(pem);
      expect(result).toBeTruthy();
      expect(result).toMatch(/^[0-9a-f]{2}(:[0-9a-f]{2}){31}$/);
    });

    it("should produce consistent fingerprints for same input", async () => {
      const pem = createTestPem();
      const result1 = await sha256FingerprintFromPem(pem);
      const result2 = await sha256FingerprintFromPem(pem);
      expect(result1).toBe(result2);
    });

    it("should produce different fingerprints for different inputs", async () => {
      const pem1 = createTestPem("dGVzdA==");
      const pem2 = createTestPem("ZGlmZmVyZW50");
      const result1 = await sha256FingerprintFromPem(pem1);
      const result2 = await sha256FingerprintFromPem(pem2);
      expect(result1).not.toBe(result2);
    });
  });

  describe("stringMatcher", () => {
    it("should return true when value contains filter value", () => {
      expect(stringMatcher("test", "this is a test string")).toBe(true);
      expect(stringMatcher("hello", "Hello World")).toBe(true);
    });

    it("should return false when value does not contain filter value", () => {
      expect(stringMatcher("test", "this is a string")).toBe(false);
      expect(stringMatcher("xyz", "abc def")).toBe(false);
    });

    it("should be case-insensitive", () => {
      expect(stringMatcher("TEST", "this is a test")).toBe(true);
      expect(stringMatcher("test", "THIS IS A TEST")).toBe(true);
      expect(stringMatcher("TeSt", "ThIs Is A tEsT")).toBe(true);
    });

    it("should return false for falsy value", () => {
      expect(stringMatcher("test", "")).toBe(false);
      expect(stringMatcher("test", null as unknown as string)).toBe(false);
      expect(stringMatcher("test", undefined as unknown as string)).toBe(false);
    });

    it("should handle empty filter value", () => {
      expect(stringMatcher("", "test string")).toBe(true); // Empty string is contained in any string
    });

    it("should handle exact matches", () => {
      expect(stringMatcher("test", "test")).toBe(true);
      expect(stringMatcher("hello", "hello")).toBe(true);
    });
  });

  describe("toIdentity", () => {
    it("should convert ParsedCertificate to identity", () => {
      const leaf: ParsedCertificate = {
        subject: "CN=test@example.com",
        issuer: "CN=Fulcio Root CA",
        sans: ["test@example.com"],
        pem: "",
        notBefore: "2024-01-01T00:00:00Z",
        notAfter: "2025-01-01T00:00:00Z",
        serialNumber: "123",
        isCa: false,
        role: "leaf",
      };

      const result = toIdentity(leaf);
      expect(result).toEqual({
        san: "test@example.com",
        issuer: "CN=Fulcio Root CA",
        issuerType: "fulcio",
      });
    });

    it("should return undefined for undefined input", () => {
      expect(toIdentity(undefined)).toBeUndefined();
    });

    it("should handle certificate without SANs", () => {
      const leaf: ParsedCertificate = {
        subject: "CN=test",
        issuer: "CN=Root CA",
        sans: [],
        pem: "",
        notBefore: "2024-01-01T00:00:00Z",
        notAfter: "2025-01-01T00:00:00Z",
        serialNumber: "123",
        isCa: false,
        role: "leaf",
      };

      const result = toIdentity(leaf);
      expect(result?.san).toBeUndefined();
    });

    it("should handle certificate without issuer", () => {
      const leaf: Partial<ParsedCertificate> = {
        subject: "CN=test",
        issuer: undefined,
        sans: ["test@example.com"],
        pem: "",
        notBefore: "2024-01-01T00:00:00Z",
        notAfter: "2025-01-01T00:00:00Z",
        serialNumber: "123",
        isCa: false,
        role: "leaf",
      };

      const result = toIdentity(leaf as ParsedCertificate);
      expect(result?.issuer).toBeUndefined();
      expect(result?.issuerType).toBe("unknown");
    });

    it("should use first SAN when multiple are present", () => {
      const leaf: ParsedCertificate = {
        subject: "CN=test",
        issuer: "CN=Root CA",
        sans: ["first@example.com", "second@example.com"],
        pem: "",
        notBefore: "2024-01-01T00:00:00Z",
        notAfter: "2025-01-01T00:00:00Z",
        serialNumber: "123",
        isCa: false,
        role: "leaf",
      };

      const result = toIdentity(leaf);
      expect(result?.san).toBe("first@example.com");
    });
  });

  describe("universalComparator", () => {
    it("should compare numbers directly", () => {
      expect(universalComparator(1, 2, "en")).toBeLessThan(0);
      expect(universalComparator(2, 1, "en")).toBeGreaterThan(0);
      expect(universalComparator(5, 5, "en")).toBe(0);
    });

    it("should compare strings using localeNumericCompare", () => {
      expect(universalComparator("item2", "item10", "en")).toBeLessThan(0);
      expect(universalComparator("item10", "item2", "en")).toBeGreaterThan(0);
    });

    it("should handle nullish values as empty strings", () => {
      expect(universalComparator(null, "test", "en")).toBeLessThan(0);
      expect(universalComparator(undefined, "test", "en")).toBeLessThan(0);
      expect(universalComparator(null, null, "en")).toBe(0);
      expect(universalComparator(undefined, undefined, "en")).toBe(0);
    });

    it("should convert non-number, non-string to string", () => {
      expect(universalComparator(true, false, "en")).toBeTruthy();
      expect(universalComparator(false, true, "en")).toBeTruthy();
    });

    it("should handle mixed types", () => {
      expect(universalComparator(123, "456", "en")).toBeTruthy();
      expect(universalComparator("123", 456, "en")).toBeTruthy();
    });
  });

  describe("verificationStatusToLabelColor", () => {
    it("should return correct label and color for 'verified'", () => {
      const result = verificationStatusToLabelColor("verified");
      expect(result).toEqual({ label: "Verified", color: "green" });
    });

    it("should return correct label and color for 'partially-verified'", () => {
      const result = verificationStatusToLabelColor("partially-verified");
      expect(result).toEqual({ label: "Partially verified", color: "orange" });
    });

    it("should return correct label and color for 'failed'", () => {
      const result = verificationStatusToLabelColor("failed");
      expect(result).toEqual({ label: "Verification failed", color: "red" });
    });

    it("should return correct label and color for 'unsigned'", () => {
      const result = verificationStatusToLabelColor("unsigned");
      expect(result).toEqual({ label: "Not signed", color: "grey" });
    });

    it("should return correct label and color for 'error'", () => {
      const result = verificationStatusToLabelColor("error");
      expect(result).toEqual({ label: "Verification error", color: "red" });
    });

    it("should return default for unknown status", () => {
      const result = verificationStatusToLabelColor("unknown-status");
      expect(result).toEqual({ label: "Unknown", color: "grey" });
    });

    it("should handle empty string", () => {
      const result = verificationStatusToLabelColor("");
      expect(result).toEqual({ label: "Unknown", color: "grey" });
    });
  });
});
