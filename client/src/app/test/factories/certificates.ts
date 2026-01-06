import type { ParsedCertificate } from "@app/client";

export function createLeafCertificate(overrides: Partial<ParsedCertificate> = {}): ParsedCertificate {
  return {
    subject: "CN=test@example.com",
    isCa: false,
    issuer: "CN=Fulcio Root CA",
    notBefore: "2024-01-01T00:00:00Z",
    notAfter: "2025-01-01T00:00:00Z",
    pem: "",
    role: "intermediate",
    serialNumber: "123456",
    sans: ["test@example.com"],
    ...overrides,
  };
}
