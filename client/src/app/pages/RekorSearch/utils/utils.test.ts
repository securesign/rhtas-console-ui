import { isAcceptedProtocol, isValidUrl, validateUrl } from "./validateUrl";

describe("URL Validation Tests", () => {
  describe("Individual Function Tests", () => {
    it("isAcceptedProtocol: should check for https protocols", () => {
      expect(isAcceptedProtocol("http://example.com")).toBe(false);
      expect(isAcceptedProtocol("example.com")).toBe(false);
      expect(isAcceptedProtocol("www.example.com")).toBe(false);
      expect(isAcceptedProtocol("ftp://example.com")).toBe(false);
      expect(isAcceptedProtocol("http://rekor")).toBe(false);
      expect(isAcceptedProtocol("https://example.com")).toBe(true);
    });

    it("isValidUrl: http(s) protocol, valid characters, and tld", () => {
      expect(isValidUrl("http://rekor")).toBe(true);
      expect(isValidUrl("https://rekor")).toBe(true);
      expect(isValidUrl("https://rekor🦩")).toBe(false);
      expect(isValidUrl("https://rekor-example")).toBe(true);
      expect(isValidUrl("https://rekor-example.com")).toBe(true);
      expect(isValidUrl("https://")).toBe(false);
      expect(isValidUrl("https://₮∌⎛")).toBe(false);
      expect(isValidUrl("https://😝")).toBe(false);
    });
  });

  describe("validateUrl: Composite Function Tests", () => {
    it("should return true for valid URLs with correct protocol", () => {
      expect(validateUrl("https://example.com")).toBe(true);
    });

    it("should return false for valid URLs with incorrect protocol", () => {
      expect(validateUrl("ftp://example.com")).toBe(false);
    });

    it("should return false for invalid URLs", () => {
      expect(validateUrl("justastring")).toBe(false);
    });
  });
});
