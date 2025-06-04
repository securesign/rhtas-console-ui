import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { CertificatesPage } from '@app/Trust/Certificates/CertificatesPage';
import { certificates, columns } from '@app/Trust/Certificates/Certificates.data';

const meta = {
  title: 'Trust/Certificates Page',
  component: CertificatesPage,
} satisfies Meta<typeof CertificatesPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CurrentState: Story = {
  args: {
    certificates: certificates,
    columns: columns,
  },
};

export const WithExtendedFields: Story = {
  args: {
    certificates: [
      {
        subject: 'CN=Fulcio Root CA,O=Sigstore',
        pem: `-----BEGIN CERTIFICATE-----
MIIBszCCAVugAwIBAgIUWY1QrUe7GpU4... (truncated)
-----END CERTIFICATE-----`,
        issuer: 'CN=Sigstore Root CA',
        validFrom: '2023-01-01T00:00:00Z',
        validTo: '2033-01-01T00:00:00Z',
        fingerprint: '3A:1F:DE:AD:BE:EF:00:00:12:34:56:78:90:AB:CD:EF:01:23:45:67',
        type: 'Fulcio',
      },
      {
        subject: 'CN=TUF Root Signing Key,O=Trusted Foundations',
        pem: `-----BEGIN CERTIFICATE-----
MIICkzCCAfugAwIBAgIUQw9X3lNwJzZL... (truncated)
-----END CERTIFICATE-----`,
        issuer: 'Self-signed',
        validFrom: '2022-07-01T00:00:00Z',
        validTo: '2032-07-01T00:00:00Z',
        fingerprint: 'AB:CD:EF:12:34:56:78:90:00:00:11:22:33:44:55:66:77:88:99:AA',
        type: 'TUF',
        role: 'root',
      },
      {
        subject: 'CN=GitHub OIDC Signing CA,O=GitHub',
        pem: `-----BEGIN CERTIFICATE-----
MIIDeTCCAmGgAwIBAgIUEj0+4xFe7r... (truncated)
-----END CERTIFICATE-----`,
        issuer: 'CN=GitHub Root CA',
        validFrom: '2024-03-15T00:00:00Z',
        validTo: '2026-03-15T00:00:00Z',
        fingerprint: 'FE:ED:FA:CE:BE:EF:DE:AD:12:34:56:78:9A:BC:DE:F0:12:34:56:78',
        type: 'Fulcio',
      },
    ],
    columns: ['Subject', 'Issuer', 'Type', 'Role', 'Valid To'],
  },
};
