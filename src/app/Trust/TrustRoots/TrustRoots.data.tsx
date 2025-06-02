export interface TrustConfig {
  tufRoot: TufRoot;
  fulcioCertAuthorities: FulcioCertAuthority[];
}

export interface TufRoot {
  version: number;
  expires: string; // ISO 8601 format (e.g. 2025-12-31T23:59:59Z)
}

export interface FulcioCertAuthority {
  subject: string;
  pem: string;
}

export const columns = ['Subject', 'Excerpt'];

export const rows: FulcioCertAuthority[] = [
  {
    subject: 'CN=Fulcio Root CA,O=Sigstore',
    pem: `-----BEGIN CERTIFICATE-----
MIIBszCCAVugAwIBAgIUWY1QrUe7GpU4... (truncated)
-----END CERTIFICATE-----`,
  },
  {
    subject: 'CN=Dev Fulcio CA,O=Sigstore Dev',
    pem: `-----BEGIN CERTIFICATE-----
MIICkzCCAfugAwIBAgIUQw9X3lNwJzZL... (truncated)
-----END CERTIFICATE-----`,
  },
];
