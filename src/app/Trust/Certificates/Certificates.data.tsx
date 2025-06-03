export interface FulcioCertAuthority {
  subject: string;
  pem: string;
}

export const columns = ['Subject', 'PEM'];

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
  {
    subject: 'CN=GitHub OIDC CA,O=GitHub',
    pem: `-----BEGIN CERTIFICATE-----
MIIDeTCCAmGgAwIBAgIUEj0+4xFe7r... (truncated)
-----END CERTIFICATE-----`,
  },
];
