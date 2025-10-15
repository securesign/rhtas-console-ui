/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument */

import { EXTENSIONS_CONFIG } from "./extensions";

vi.mock("@peculiar/asn1-schema", () => ({
  AsnUtf8StringConverter: {
    fromASN: vi.fn().mockReturnValue("mockedString"),
  },
  AsnAnyConverter: {
    toASN: vi.fn().mockReturnValue(new ArrayBuffer(0)),
  },
}));

vi.mock("@peculiar/x509", () => ({
  AuthorityKeyIdentifierExtension: vi.fn().mockImplementation(() => ({
    keyId: "01020304",
    certId: undefined,
  })),
  BasicConstraintsExtension: vi.fn().mockImplementation(() => ({
    ca: false,
  })),
  ExtendedKeyUsageExtension: vi.fn().mockImplementation(() => ({
    usages: ["1.3.6.1.5.5.7.3.3"],
  })),
  KeyUsagesExtension: vi.fn().mockImplementation(() => ({
    usages: 3,
  })),
  SubjectAlternativeNameExtension: vi.fn().mockImplementation(() => ({
    names: [],
  })),
  SubjectKeyIdentifierExtension: vi.fn().mockImplementation(() => ({
    keyId: "01020304",
  })),
}));

vi.mock("./constants", () => ({
  KEY_USAGE_NAMES: {
    1: "Digital Signature",
    2: "Non Repudiation",
    4: "Key Encipherment",
    8: "Data Encipherment",
  },
}));

describe("EXTENSIONS_CONFIG", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should map '2.5.29.14' to Subject Key Identifier", () => {
    const rawExtension = {
      rawData: new Uint8Array([1, 2, 3, 4]),
      value: new Uint8Array([5, 6, 7, 8]),
    };
    const result = EXTENSIONS_CONFIG["2.5.29.14"].toJSON(rawExtension as any);
    expect(result).toEqual(["01:02:03:04"]);
  });

  it("should map '2.5.29.15' to Key Usage", () => {
    const rawExtension = {
      rawData: new Uint8Array([1, 2, 3, 4]),
      value: new Uint8Array([5, 6, 7, 8]),
    };
    const result = EXTENSIONS_CONFIG["2.5.29.15"].toJSON(rawExtension as any);
    expect(result).toEqual(["Digital Signature", "Non Repudiation"]);
  });

  it.skip("should map '2.5.29.17' to Subject Alternative Name", () => {
    const rawExtension = {
      rawData: new Uint8Array([1, 2, 3, 4]),
      value: new Uint8Array([5, 6, 7, 8]),
    };
    const result = EXTENSIONS_CONFIG["2.5.29.17"].toJSON(rawExtension as any);
    expect(result).toEqual({ names: [] });
  });

  it("should map '2.5.29.19' to Basic Constraints", () => {
    const rawExtension = {
      rawData: new Uint8Array([1, 2, 3, 4]),
      value: new Uint8Array([5, 6, 7, 8]),
    };
    const result = EXTENSIONS_CONFIG["2.5.29.19"].toJSON(rawExtension as any);
    expect(result).toEqual({ CA: false });
  });

  it("should map '2.5.29.35' to Authority Key Identifier", () => {
    const rawExtension = {
      rawData: new Uint8Array([1, 2, 3, 4]),
      value: new Uint8Array([5, 6, 7, 8]),
    };
    const result = EXTENSIONS_CONFIG["2.5.29.35"].toJSON(rawExtension as any);
    expect(result).toEqual({ keyid: "01:02:03:04", certid: undefined });
  });

  it("should map '2.5.29.37' to Extended Key Usage", () => {
    const rawExtension = {
      rawData: new Uint8Array([1, 2, 3, 4]),
      value: new Uint8Array([5, 6, 7, 8]),
    };
    const result = EXTENSIONS_CONFIG["2.5.29.37"].toJSON(rawExtension as any);
    expect(result).toEqual(["Code Signing"]);
  });

  it("should decode text using textDecoder", () => {
    const rawExtension = { value: new TextEncoder().encode("test") };
    const result = EXTENSIONS_CONFIG["1.3.6.1.4.1.57264.1.1"].toJSON(rawExtension as any);
    expect(result).toBe("test");
  });

  it("should decode UTF-8 string using utf8StringDecoder", () => {
    const rawExtension = { value: new TextEncoder().encode("test") };
    const result = EXTENSIONS_CONFIG["1.3.6.1.4.1.57264.1.8"].toJSON(rawExtension as any);
    expect(result).toBe("mockedString");
  });
});
