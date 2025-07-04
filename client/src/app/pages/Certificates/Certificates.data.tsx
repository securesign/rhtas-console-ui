export type CertificateType = "TUF" | "Fulcio" | "Signing";

export interface ICertificateProps {
  // certificate authority subject
  subject: string;

  // certificate in PEM format
  pem?: string;

  // derived fields from certificate
  issuer?: string;
  validFrom?: string;
  validTo?: string; // expiration
  fingerprint?: string;

  // UI / contextual
  name?: string; // display label, fallback to 'subject'
  status?: "valid" | "expired" | "expiring" | "unknown";
  type?: CertificateType;
  role?: "root" | "targets" | "snapshot" | "timestamp"; // TUF only
  version?: number; // TUF only
}

export const columns = ["Subject", "PEM"];

export const certificates: ICertificateProps[] = [
  {
    subject: "CN=Fulcio Root CA,O=Sigstore",
    pem: `-----BEGIN CERTIFICATE-----
MIIBszCCAVugAwIBAgIUWY1QrUe7GpU4... (truncated)
-----END CERTIFICATE-----`,
  },
  {
    subject: "CN=Dev Fulcio CA,O=Sigstore Dev",
    pem: `-----BEGIN CERTIFICATE-----
MIICkzCCAfugAwIBAgIUQw9X3lNwJzZL... (truncated)
-----END CERTIFICATE-----`,
  },
  {
    subject: "CN=GitHub OIDC CA,O=GitHub",
    pem: `-----BEGIN CERTIFICATE-----
MIIDeTCCAmGgAwIBAgIUEj0+4xFe7r... (truncated)
-----END CERTIFICATE-----`,
  },
];
