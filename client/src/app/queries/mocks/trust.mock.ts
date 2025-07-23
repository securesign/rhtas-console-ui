import type { CertificateInfoList, RootMetadataInfoList, TrustConfig } from "@app/client";

export const trustConfigMock: TrustConfig = {
  fulcioCertAuthorities: [
    {
      pem: "-----BEGIN CERTIFICATE-----\nstub-cert\n-----END CERTIFICATE-----",
      subject: "stub-sub",
    },
  ],
};

export const trustRootMetadataInfoMock: RootMetadataInfoList = {
  "repo-url": "https://tuf-repo-cdn.sigstore.dev",
  data: [
    {
      expires: "2025-02-19T08:04:32Z",
      status: "expired",
      version: "1",
    },
    {
      expires: "2025-08-05T08:37:20Z",
      status: "expiring",
      version: "2",
    },
    {
      expires: "2026-01-22T13:05:59Z",
      status: "valid",
      version: "3",
    },
  ],
};

export const trustTargetCertificatesMock: CertificateInfoList = {
  data: [
    {
      expiration: "2031-02-23 03:20:29 +0000 UTC",
      issuer: "CN=sigstore,O=sigstore.dev",
      status: "Expired",
      subject: "CN=sigstore,O=sigstore.dev",
      target: "fulcio.crt.pem",
      type: "Fulcio",
    },
    {
      expiration: "2031-10-05 13:56:58 +0000 UTC",
      issuer: "CN=sigstore,O=sigstore.dev",
      status: "Active",
      subject: "CN=sigstore-intermediate,O=sigstore.dev",
      target: "fulcio_intermediate_v1.crt.pem",
      type: "Fulcio",
    },
    {
      expiration: "2031-10-05 13:56:58 +0000 UTC",
      issuer: "CN=sigstore,O=sigstore.dev",
      status: "Active",
      subject: "CN=sigstore,O=sigstore.dev",
      target: "fulcio_v1.crt.pem",
      type: "Fulcio",
    },
  ],
};
