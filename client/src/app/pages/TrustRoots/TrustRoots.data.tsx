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

// export const columns = ['Subject', 'Excerpt'];

// export const rows: FulcioCertAuthority[] = [
//   {
//     subject: 'CN=Fulcio Root CA,O=Sigstore',
//     pem: `-----BEGIN CERTIFICATE-----
// MIIBszCCAVugAwIBAgIUWY1QrUe7GpU4... (truncated)
// -----END CERTIFICATE-----`,
//   },
//   {
//     subject: 'CN=Dev Fulcio CA,O=Sigstore Dev',
//     pem: `-----BEGIN CERTIFICATE-----
// MIICkzCCAfugAwIBAgIUQw9X3lNwJzZL... (truncated)
// -----END CERTIFICATE-----`,
//   },
// ];

export const exampleTrustRoot = {
  id: "default", // used internally or in dropdowns

  name: "Sigstore Default Trust Root",
  source: "https://tuf-repo.sigstore.dev/",
  lastUpdated: "2025-06-09T08:43:00Z",
  type: "tuf", // could later support other types

  certificates: [
    {
      subject: "CN=Fulcio Root CA,O=Sigstore",
      issuer: "CN=Sigstore Root CA",
      type: "Fulcio",
      status: "valid",
      fingerprint: "AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:00:11:22:33",
    },
    {
      subject: "CN=GitHub OIDC CA,O=Sigstore",
      issuer: "CN=GitHub Root CA",
      type: "Fulcio",
      status: "valid",
      fingerprint: "11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44",
    },
    // {
    //   subject: 'CN=TUF Root Signer',
    //   issuer: 'Self-signed',
    //   type: 'TUF',
    //   role: 'root',
    //   status: 'valid',
    //   version: 5,
    //   fingerprint: 'AA:AA:AA:AA:BB:BB:BB:BB:CC:CC:CC:CC:DD:DD:DD:DD:EE:EE:EE:EE',
    // },
  ],

  tufMetadata: [
    {
      // role: 'root',
      version: 5,
      expires: "2025-12-01T00:00:00Z",
      status: "valid",
    },
    {
      // role: 'targets',
      version: 3,
      expires: "2025-08-15T00:00:00Z",
      status: "valid",
    },
    {
      // role: 'snapshot',
      version: 3,
      expires: "2025-06-20T00:00:00Z",
      status: "expiring",
    },
    {
      // role: 'timestamp',
      version: 12,
      expires: "2025-06-10T08:00:00Z",
      status: "expiring",
    },
  ],

  events: [
    {
      timestamp: "2025-06-08T10:20:00Z",
      type: "Signature verification",
      message: "Invalid signature detected for snapshot.json",
    },
    {
      timestamp: "2025-06-07T17:45:00Z",
      type: "New certificate added",
      message: "CN=GitHub OIDC CA was added to trust root",
    },
  ],
};

export interface ImportersDataRow {
  name: string;
  type: string;
  description: string;
  source: string;
  period: string;
  state: string;
}
