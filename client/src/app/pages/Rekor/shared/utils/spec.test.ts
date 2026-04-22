import { describe, it, expect, vi, beforeEach } from "vitest";
import { isPublicKeyValid } from "./spec";

// Mock the x509 decode module
vi.mock("./x509/decode", () => ({
  hasValidPublicCertificate: vi.fn(),
}));

import { hasValidPublicCertificate } from "./x509/decode";

describe("isPublicKeyValid", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("hashedrekord and rekord types", () => {
    it("validates certificate for hashedrekord type", () => {
      const spec = {
        data: { hash: { algorithm: "sha256", value: "abc123" } },
        signature: {
          content: "signature-content",
          publicKey: { content: window.btoa("-----BEGIN CERTIFICATE-----\ntest\n-----END CERTIFICATE-----") },
        },
      };

      vi.mocked(hasValidPublicCertificate).mockReturnValue(true);

      const result = isPublicKeyValid({ type: "hashedrekord", spec, apiVersion: "0.0.1" });

      expect(hasValidPublicCertificate).toHaveBeenCalledWith(
        "-----BEGIN CERTIFICATE-----\ntest\n-----END CERTIFICATE-----",
        undefined
      );
      expect(result).toBe(true);
    });

    it("passes integratedTime to certificate validation for hashedrekord", () => {
      const spec = {
        data: { hash: { algorithm: "sha256", value: "abc123" } },
        signature: {
          content: "signature-content",
          publicKey: { content: window.btoa("-----BEGIN CERTIFICATE-----\ntest\n-----END CERTIFICATE-----") },
        },
      };

      vi.mocked(hasValidPublicCertificate).mockReturnValue(true);
      const integratedTime = 1710504600; // Unix timestamp for 2024-03-15

      const result = isPublicKeyValid({ type: "hashedrekord", spec, apiVersion: "0.0.1" }, integratedTime);

      expect(hasValidPublicCertificate).toHaveBeenCalledWith(
        "-----BEGIN CERTIFICATE-----\ntest\n-----END CERTIFICATE-----",
        integratedTime
      );
      expect(result).toBe(true);
    });

    it("validates certificate for rekord type", () => {
      const spec = {
        data: { hash: { algorithm: "sha256", value: "abc123" } },
        signature: {
          content: "signature-content",
          publicKey: { content: window.btoa("-----BEGIN CERTIFICATE-----\ntest\n-----END CERTIFICATE-----") },
        },
      };

      vi.mocked(hasValidPublicCertificate).mockReturnValue(true);

      const result = isPublicKeyValid({ type: "rekord", spec, apiVersion: "0.0.1" });

      expect(result).toBe(true);
    });
  });

  describe("intoto types", () => {
    it("validates certificate for intoto v0.0.1", () => {
      const spec = {
        publicKey: window.btoa("-----BEGIN CERTIFICATE-----\ntest\n-----END CERTIFICATE-----"),
        content: {},
      };

      vi.mocked(hasValidPublicCertificate).mockReturnValue(true);

      const result = isPublicKeyValid({ type: "intoto", spec, apiVersion: "0.0.1" });

      expect(hasValidPublicCertificate).toHaveBeenCalledWith(
        "-----BEGIN CERTIFICATE-----\ntest\n-----END CERTIFICATE-----",
        undefined
      );
      expect(result).toBe(true);
    });

    it("validates certificate for intoto v0.0.2 with integratedTime", () => {
      const spec = {
        content: {
          envelope: {
            signatures: [
              {
                sig: "signature",
                publicKey: window.btoa("-----BEGIN CERTIFICATE-----\ntest\n-----END CERTIFICATE-----"),
              },
            ],
          },
        },
      };

      vi.mocked(hasValidPublicCertificate).mockReturnValue(true);
      const integratedTime = 1710504600;

      const result = isPublicKeyValid({ type: "intoto", spec, apiVersion: "0.0.2" }, integratedTime);

      expect(hasValidPublicCertificate).toHaveBeenCalledWith(
        "-----BEGIN CERTIFICATE-----\ntest\n-----END CERTIFICATE-----",
        integratedTime
      );
      expect(result).toBe(true);
    });
  });

  describe("dsse type", () => {
    it("validates certificate for dsse type", () => {
      const spec = {
        signatures: [
          {
            verifier: window.btoa("-----BEGIN CERTIFICATE-----\ntest\n-----END CERTIFICATE-----"),
            signature: "signature-content",
          },
        ],
      };

      vi.mocked(hasValidPublicCertificate).mockReturnValue(true);

      const result = isPublicKeyValid({ type: "dsse", spec, apiVersion: "0.0.1" });

      expect(hasValidPublicCertificate).toHaveBeenCalledWith(
        "-----BEGIN CERTIFICATE-----\ntest\n-----END CERTIFICATE-----",
        undefined
      );
      expect(result).toBe(true);
    });

    it("passes integratedTime to certificate validation for dsse", () => {
      const spec = {
        signatures: [
          {
            verifier: window.btoa("-----BEGIN CERTIFICATE-----\ntest\n-----END CERTIFICATE-----"),
            signature: "signature-content",
          },
        ],
      };

      vi.mocked(hasValidPublicCertificate).mockReturnValue(true);
      const integratedTime = 1710504600;

      const result = isPublicKeyValid({ type: "dsse", spec, apiVersion: "0.0.1" }, integratedTime);

      expect(hasValidPublicCertificate).toHaveBeenCalledWith(
        "-----BEGIN CERTIFICATE-----\ntest\n-----END CERTIFICATE-----",
        integratedTime
      );
      expect(result).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("returns false when certificate content is missing", () => {
      const spec = {
        data: { hash: { algorithm: "sha256", value: "abc123" } },
        signature: {
          content: "signature-content",
          publicKey: {},
        },
      };

      // When content is undefined, window.atob("") returns empty string
      // which doesn't include "BEGIN CERTIFICATE", so hasValidPublicCertificate returns false
      vi.mocked(hasValidPublicCertificate).mockReturnValue(false);

      const result = isPublicKeyValid({ type: "hashedrekord", spec, apiVersion: "0.0.1" });

      expect(result).toBe(false);
    });

    it("returns false when hasValidPublicCertificate returns false", () => {
      const spec = {
        data: { hash: { algorithm: "sha256", value: "abc123" } },
        signature: {
          content: "signature-content",
          publicKey: { content: window.btoa("invalid-cert") },
        },
      };

      vi.mocked(hasValidPublicCertificate).mockReturnValue(false);

      const result = isPublicKeyValid({ type: "hashedrekord", spec, apiVersion: "0.0.1" });

      expect(result).toBe(false);
    });

    it("returns false for unsupported type", () => {
      const spec = {};

      const result = isPublicKeyValid({ type: "unknown-type", spec, apiVersion: "0.0.1" });

      expect(result).toBe(false);
      expect(hasValidPublicCertificate).not.toHaveBeenCalled();
    });
  });
});
