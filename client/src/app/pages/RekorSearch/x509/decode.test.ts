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
    extensions: Array<{ type: string; critical: boolean; value: ArrayBuffer }>;

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

vi.mock("../utils/date", () => ({
  toRelativeDateString: vi.fn().mockImplementation((date: Date) => `Relative date for ${date}`),
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
import { decodex509 } from "./decode";

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
