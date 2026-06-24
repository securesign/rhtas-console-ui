import { vi } from "vitest";

import { EXTENSIONS_CONFIG } from "./extensions";

// Store the mock implementation so we can change it per test
let mockX509CertificateData = {
  serialNumber: "123456",
  issuer: "Issuer Name",
  notBefore: new Date("2020-01-01"),
  notAfter: new Date("2022-01-01"),
  publicKey: {
    algorithm: "rsaEncryption",
  },
  subjectName: "Subject Name",
  extensions: [
    {
      type: "1.2.3.4.5",
      critical: false,
      value: new ArrayBuffer(8),
    },
  ],
};

vi.mock("@peculiar/x509", () => {
  // Use a class to properly mock the constructor for Vitest 4.x
  const X509Certificate = class {
    serialNumber: string;
    issuer: string;
    notBefore: Date;
    notAfter: Date;
    publicKey: { algorithm: string };
    subjectName: string;
    extensions: { type: string; critical: boolean; value: ArrayBuffer }[];

    constructor() {
      this.serialNumber = mockX509CertificateData.serialNumber;
      this.issuer = mockX509CertificateData.issuer;
      this.notBefore = mockX509CertificateData.notBefore;
      this.notAfter = mockX509CertificateData.notAfter;
      this.publicKey = mockX509CertificateData.publicKey;
      this.subjectName = mockX509CertificateData.subjectName;
      this.extensions = mockX509CertificateData.extensions;
    }
  };
  return { X509Certificate };
});

vi.mock("../date", () => ({
  toRelativeDateString: vi.fn().mockImplementation((date: Date) => `Relative date for ${String(date)}`),
}));

vi.mock("./extensions", () => ({
  EXTENSIONS_CONFIG: {
    "1.2.3.4.5": {
      name: "Mock Extension",
      toJSON: vi.fn().mockReturnValue({ mockKey: "mockValue" }),
    },
  },
}));

// Import after mocks are set up
import { decodex509, hasValidPublicCertificate } from "./decode";

describe("decodex509", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset mock data to default
    mockX509CertificateData = {
      serialNumber: "123456",
      issuer: "Issuer Name",
      notBefore: new Date("2020-01-01"),
      notAfter: new Date("2022-01-01"),
      publicKey: {
        algorithm: "rsaEncryption",
      },
      subjectName: "Subject Name",
      extensions: [
        {
          type: "1.2.3.4.5",
          critical: false,
          value: new ArrayBuffer(8),
        },
      ],
    };
  });

  it("should decode a raw X.509 certificate", () => {
    const rawCertificate = "rawCertificateString";
    const decoded = decodex509(rawCertificate);
    expect(decoded).toBeDefined();
    expect(decoded.Signature.Issuer).toBe("Issuer Name");
  });

  // simulate an extension not found
  // @ts-expect-error allowed
  EXTENSIONS_CONFIG.unknownExtensionType = undefined;

  it("converts ArrayBuffer to hex string for unknown extension types", () => {
    // Update mock data for this specific test
    mockX509CertificateData = {
      serialNumber: "654321",
      issuer: "New Issuer",
      notBefore: new Date("2021-01-01"),
      notAfter: new Date("2023-01-01"),
      publicKey: {
        algorithm: "ecdsa",
      },
      subjectName: "New Subject",
      extensions: [
        {
          type: "unknownExtensionType",
          critical: true,
          value: new Uint8Array([1, 2, 3, 4]).buffer, // tests bufferToHex
        },
      ],
    };

    const rawCertificate = "anotherRawCertificateString";
    const decoded = decodex509(rawCertificate);

    // asserts the hex string format of the ArrayBuffer
    expect(decoded["X509v3 extensions"]["unknownExtensionType (critical)"]).toBe("01:02:03:04");
  });
});

describe("hasValidPublicCertificate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns false for non-certificate content (public key only)", () => {
    const publicKey = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...\n-----END PUBLIC KEY-----";
    expect(hasValidPublicCertificate(publicKey)).toBe(false);
  });

  it("returns false for expired certificate (current time validation)", () => {
    // Certificate expired in 2022, current time is 2026
    mockX509CertificateData = {
      ...mockX509CertificateData,
      notBefore: new Date("2020-01-01"),
      notAfter: new Date("2022-01-01"),
    };

    const expiredCert = "-----BEGIN CERTIFICATE-----\nMIIC...\n-----END CERTIFICATE-----";
    expect(hasValidPublicCertificate(expiredCert)).toBe(false);
  });

  it("returns true for currently valid certificate (current time validation)", () => {
    // Certificate valid from 2020 to 2030
    mockX509CertificateData = {
      ...mockX509CertificateData,
      notBefore: new Date("2020-01-01"),
      notAfter: new Date("2030-01-01"),
    };

    const validCert = "-----BEGIN CERTIFICATE-----\nMIIC...\n-----END CERTIFICATE-----";
    expect(hasValidPublicCertificate(validCert)).toBe(true);
  });

  it("returns false for not-yet-valid certificate (current time validation)", () => {
    // Certificate not valid until 2028
    mockX509CertificateData = {
      ...mockX509CertificateData,
      notBefore: new Date("2028-01-01"),
      notAfter: new Date("2030-01-01"),
    };

    const futureValidCert = "-----BEGIN CERTIFICATE-----\nMIIC...\n-----END CERTIFICATE-----";
    expect(hasValidPublicCertificate(futureValidCert)).toBe(false);
  });

  it("returns true for historical certificate valid at integratedTime (Rekor entry from 2024)", () => {
    // Certificate valid from 2024-01-01 to 2024-12-31
    // Rekor entry created on 2024-03-15 (integratedTime)
    // Current time is 2026 (certificate expired)
    mockX509CertificateData = {
      ...mockX509CertificateData,
      notBefore: new Date("2024-01-01T00:00:00Z"),
      notAfter: new Date("2024-12-31T23:59:59Z"),
    };

    const historicalCert = "-----BEGIN CERTIFICATE-----\nMIIC...\n-----END CERTIFICATE-----";
    const integratedTime = Math.floor(new Date("2024-03-15T10:30:00Z").getTime() / 1000); // Unix timestamp

    // Should return true because cert was valid at integratedTime
    expect(hasValidPublicCertificate(historicalCert, integratedTime)).toBe(true);
  });

  it("returns false for historical certificate expired before integratedTime", () => {
    // Certificate valid from 2020-01-01 to 2022-01-01
    // Rekor entry created on 2024-03-15 (after cert expired)
    mockX509CertificateData = {
      ...mockX509CertificateData,
      notBefore: new Date("2020-01-01T00:00:00Z"),
      notAfter: new Date("2022-01-01T00:00:00Z"),
    };

    const expiredCert = "-----BEGIN CERTIFICATE-----\nMIIC...\n-----END CERTIFICATE-----";
    const integratedTime = Math.floor(new Date("2024-03-15T10:30:00Z").getTime() / 1000);

    // Should return false because cert was already expired at integratedTime
    expect(hasValidPublicCertificate(expiredCert, integratedTime)).toBe(false);
  });

  it("returns false for historical certificate not yet valid at integratedTime", () => {
    // Certificate valid from 2025-01-01 to 2030-01-01
    // Rekor entry created on 2024-03-15 (before cert valid)
    mockX509CertificateData = {
      ...mockX509CertificateData,
      notBefore: new Date("2025-01-01T00:00:00Z"),
      notAfter: new Date("2030-01-01T00:00:00Z"),
    };

    const futureValidCert = "-----BEGIN CERTIFICATE-----\nMIIC...\n-----END CERTIFICATE-----";
    const integratedTime = Math.floor(new Date("2024-03-15T10:30:00Z").getTime() / 1000);

    // Should return false because cert wasn't valid yet at integratedTime
    expect(hasValidPublicCertificate(futureValidCert, integratedTime)).toBe(false);
  });

  it("validates against current time when integratedTime is undefined", () => {
    // Certificate valid from 2020 to 2030
    mockX509CertificateData = {
      ...mockX509CertificateData,
      notBefore: new Date("2020-01-01"),
      notAfter: new Date("2030-01-01"),
    };

    const validCert = "-----BEGIN CERTIFICATE-----\nMIIC...\n-----END CERTIFICATE-----";

    // Without integratedTime, should validate against current time
    expect(hasValidPublicCertificate(validCert, undefined)).toBe(true);
  });

  it("handles edge case: certificate valid exactly at integratedTime (notBefore boundary)", () => {
    const exactStartTime = new Date("2024-03-15T10:30:00Z");
    mockX509CertificateData = {
      ...mockX509CertificateData,
      notBefore: exactStartTime,
      notAfter: new Date("2025-01-01T00:00:00Z"),
    };

    const cert = "-----BEGIN CERTIFICATE-----\nMIIC...\n-----END CERTIFICATE-----";
    const integratedTime = Math.floor(exactStartTime.getTime() / 1000);

    // Should return true - cert becomes valid exactly at integratedTime
    expect(hasValidPublicCertificate(cert, integratedTime)).toBe(true);
  });

  it("handles edge case: certificate valid at exact notAfter boundary", () => {
    const exactEndTime = new Date("2024-03-15T10:30:00Z");
    mockX509CertificateData = {
      ...mockX509CertificateData,
      notBefore: new Date("2020-01-01T00:00:00Z"),
      notAfter: exactEndTime,
    };

    const cert = "-----BEGIN CERTIFICATE-----\nMIIC...\n-----END CERTIFICATE-----";
    const integratedTime = Math.floor(exactEndTime.getTime() / 1000);

    // Should return true - cert is still valid at exact notAfter time
    expect(hasValidPublicCertificate(cert, integratedTime)).toBe(true);
  });

  it("handles edge case: certificate invalid one second after notAfter", () => {
    const exactEndTime = new Date("2024-03-15T10:30:00Z");
    mockX509CertificateData = {
      ...mockX509CertificateData,
      notBefore: new Date("2020-01-01T00:00:00Z"),
      notAfter: exactEndTime,
    };

    const cert = "-----BEGIN CERTIFICATE-----\nMIIC...\n-----END CERTIFICATE-----";
    const integratedTime = Math.floor(exactEndTime.getTime() / 1000) + 1; // One second after expiry

    // Should return false - cert expired one second ago
    expect(hasValidPublicCertificate(cert, integratedTime)).toBe(false);
  });
});
