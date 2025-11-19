import type { ImageMetadataResponse, Metadata, VerifyArtifactResponse } from "@app/client";
import type { ArtifactVerificationViewModel } from "@app/queries/artifacts.view-model";

export const artifactsImageDataMock: ImageMetadataResponse = {
  image: "ttl.sh/rhtas/test-image:1h",

  // container image metadata
  metadata: {
    created: "2025-11-06T08:58:50.271117116Z",

    // media type of the container image (e.g., OCI manifest type)
    mediaType: "application/vnd.oci.image.manifest.v1+json",

    // size of container image
    size: 414,

    // key-value labels or annotations associated with image
    labels: {
      "io.buildah.version": "1.41.5",
    },
  } as Metadata,
  // container image's digest
  digest: "sha256:dcb43136e08351ec346aacd6b7b5b4d12eb84f7151f180a3eb2a4d4a17b25bc2",
};

// draft view-model mock that matches the Artifacts designs. This is *not* what the
// API returns today, but represents the desired shape for the UI.
export const artifactVerificationViewModelMock: ArtifactVerificationViewModel = {
  artifact: artifactsImageDataMock,
  summary: {
    identities: [
      {
        id: "builder-email",
        type: "email",
        value: "builder@example.com",
        source: "san",
        issuer: "https://token.actions.githubusercontent.com",
      },
      {
        id: "github-oidc",
        type: "oidc-issuer",
        value: "GitHub OIDC",
        source: "issuer",
        issuer: "https://token.actions.githubusercontent.com",
      },
      {
        id: "release-email",
        type: "email",
        value: "release@example.com",
        source: "san",
        issuer: "https://token.actions.githubusercontent.com",
      },
    ],
    signatureCount: 2,
    attestationCount: 2,
    rekorEntryCount: 4,
    timeCoherence: {
      status: "ok",
      minIntegratedTime: "2025-11-06T08:59:07Z",
      maxIntegratedTime: "2025-11-06T09:09:07Z",
    },
    overallStatus: "unknown",
  },
  signatures: [
    {
      id: "sig-0",
      kind: "hashedrekord",
      identity: {
        san: "ryordan@redhat.com",
        issuer: "https://token.actions.githubusercontent.com",
        issuerType: "github-oidc",
      },
      hash: {
        algorithm: "sha256",
        value: "571e79e17938efb4b8459da79453fe4019ae11374af1155a8fa9972a7f1b93c2",
      },
      timestamp: "2025-11-06T08:59:07Z",
      status: {
        signature: "verified",
        rekor: "present",
        chain: "valid",
      },
      certificateChain: [
        {
          role: "leaf",
          subject: "CN=ryordan@redhat.com,O=sigstore.dev",
          issuer: "CN=sigstore-intermediate,O=sigstore.dev",
          notBefore: "2025-11-06T08:59:07Z",
          notAfter: "2025-11-06T09:09:07Z",
          sans: ["ryordan@redhat.com"],
          serialNumber: "59:72:f4:57:e5:53:bc:5f:bd:ef:34:9c:94:73:82:b5:8d:1b:60:75",
          isCa: false,
          pem: "-----BEGIN CERTIFICATE-----\nMIICLEAFCERT...sig0-leaf...\n-----END CERTIFICATE-----\n",
        },
        {
          role: "intermediate",
          subject: "CN=sigstore-intermediate,O=sigstore.dev",
          issuer: "CN=sigstore,O=sigstore.dev",
          notBefore: "2025-11-06T08:59:07Z",
          notAfter: "2025-11-06T09:09:07Z",
          sans: [],
          serialNumber: "59:72:f4:57:e5:53:bc:5f:bd:ef:34:9c:94:73:82:b5:8d:1b:60:75",
          isCa: true,
          pem: "-----BEGIN CERTIFICATE-----\nMIICINTERMEDIATECERT...sig0-int...\n-----END CERTIFICATE-----\n",
        },
        {
          role: "root",
          subject: "CN=sigstore,O=sigstore.dev",
          issuer: "CN=sigstore,O=sigstore.dev",
          notBefore: "2025-11-06T08:59:07Z",
          notAfter: "2025-11-06T09:09:07Z",
          sans: [],
          serialNumber: "59:72:f4:57:e5:53:bc:5f:bd:ef:34:9c:94:73:82:b5:8d:1b:60:75",
          isCa: true,
          pem: "-----BEGIN CERTIFICATE-----\nMIICROOTCERT...sig0-root...\n-----END CERTIFICATE-----\n",
        },
      ],
      rekorEntry: {
        uuid: "sig-0-uuid-1234",
        body: "BASE64_BODY_SIG0",
        integratedTime: 1730883547,
        logID: "d4c1a7f2-0000-0000-0000-000000000000",
        logIndex: 1234,
        verification: {
          inclusionProof: {
            checkpoint: "rekor.sigstore.dev - 123456",
            hashes: ["abc", "def"],
            logIndex: 1234,
            rootHash: "cafebabe",
            treeSize: 987654,
          },
          signedEntryTimestamp: "BASE64_SET_SIG0",
        },
      },
    },
    {
      id: "sig-1",
      kind: "hashedrekord",
      identity: {
        san: "release@redhat.com",
        issuer: "https://token.actions.githubusercontent.com",
        issuerType: "github-oidc",
      },
      hash: {
        algorithm: "sha256",
        value: "aa7b9c0d17938efb4b8459da79453fe4019ae11374af1155a8fa9972a7f1b93c2",
      },
      timestamp: "2025-11-06T09:05:00Z",
      status: {
        signature: "verified",
        rekor: "present",
        chain: "valid",
      },
      certificateChain: [
        {
          role: "leaf",
          subject: "CN=release@redhat.com,O=sigstore.dev",
          issuer: "CN=sigstore-intermediate,O=sigstore.dev",
          notBefore: "2025-11-06T09:00:00Z",
          notAfter: "2025-11-06T09:10:00Z",
          sans: ["release@redhat.com"],
          serialNumber: "aa:bb:cc:dd:ee:ff",
          isCa: false,
          pem: "-----BEGIN CERTIFICATE-----\nMIICLEAFCERT...sig1-leaf...\n-----END CERTIFICATE-----\n",
        },
        {
          role: "intermediate",
          subject: "CN=sigstore-intermediate,O=sigstore.dev",
          issuer: "CN=sigstore,O=sigstore.dev",
          notBefore: "2025-11-06T09:00:00Z",
          notAfter: "2025-11-06T09:10:00Z",
          sans: [],
          serialNumber: "aa:bb:cc:dd:ee:ff",
          isCa: true,
          pem: "-----BEGIN CERTIFICATE-----\nMIICINTERMEDIATECERT...sig1-int...\n-----END CERTIFICATE-----\n",
        },
        {
          role: "root",
          subject: "CN=sigstore,O=sigstore.dev",
          issuer: "CN=sigstore,O=sigstore.dev",
          notBefore: "2025-11-06T09:00:00Z",
          notAfter: "2025-11-06T09:10:00Z",
          sans: [],
          serialNumber: "aa:bb:cc:dd:ee:ff",
          isCa: true,
          pem: "-----BEGIN CERTIFICATE-----\nMIICROOTCERT...sig1-root...\n-----END CERTIFICATE-----\n",
        },
      ],
      rekorEntry: {
        uuid: "sig-1-uuid-5678",
        body: "BASE64_BODY_SIG1",
        integratedTime: 1730883600,
        logID: "d4c1a7f2-0000-0000-0000-000000000000",
        logIndex: 1235,
        verification: {
          inclusionProof: {
            checkpoint: "rekor.sigstore.dev - 123457",
            hashes: ["ghi", "jkl"],
            logIndex: 1235,
            rootHash: "deadbeef",
            treeSize: 987655,
          },
          signedEntryTimestamp: "BASE64_SET_SIG1",
        },
      },
    },
  ],
  attestations: [
    {
      id: "att-0",
      kind: "intoto",
      predicateType: "https://slsa.dev/provenance/v1",
      digest: {
        algorithm: "sha256",
        value: "65738dc1b314fe7e0bb369cb9e596024dcdb2256a4dc29d6a268c2a03eff9181",
      },
      subject: artifactsImageDataMock.image,
      issuer: "https://token.actions.githubusercontent.com",
      timestamp: "2025-11-06T09:00:00Z",
      status: {
        verified: true,
        rekor: "present",
      },
      rekorEntry: {
        uuid: "att-0-uuid-1111",
        body: "BASE64_BODY_ATT0",
        integratedTime: 1730883660,
        logID: "d4c1a7f2-0000-0000-0000-000000000000",
        logIndex: 2234,
        verification: {
          inclusionProof: {
            checkpoint: "rekor.sigstore.dev - 223456",
            hashes: ["att0a", "att0b"],
            logIndex: 2234,
            rootHash: "facefeed",
            treeSize: 123456,
          },
          signedEntryTimestamp: "BASE64_SET_ATT0",
        },
      },
    },
    {
      id: "att-1",
      kind: "intoto",
      predicateType: "https://slsa.dev/provenance/v1",
      digest: {
        algorithm: "sha256",
        value: "65738dc1b314fe7e0bb369cb9e596024dcdb2256a4dc29d6a268c2a03eff9181",
      },
      subject: artifactsImageDataMock.image,
      issuer: "https://token.actions.githubusercontent.com",
      timestamp: "2025-11-06T09:03:00Z",
      status: {
        verified: true,
        rekor: "present",
      },
      rekorEntry: {
        uuid: "att-1-uuid-2222",
        body: "BASE64_BODY_ATT1",
        integratedTime: 1730883720,
        logID: "d4c1a7f2-0000-0000-0000-000000000000",
        logIndex: 2235,
        verification: {
          inclusionProof: {
            checkpoint: "rekor.sigstore.dev - 223457",
            hashes: ["att1a", "att1b"],
            logIndex: 2235,
            rootHash: "beadfeed",
            treeSize: 123457,
          },
          signedEntryTimestamp: "BASE64_SET_ATT1",
        },
      },
    },
  ],
};

export const artifactsVerificationInvalidMock: VerifyArtifactResponse = {
  verified: false,
  details: {
    reason: "Signature verification failed",
    errorCode: "SIGNATURE_INVALID",
  },
};

export const artifactVerificationViewModelInvalidMock: ArtifactVerificationViewModel = {
  artifact: artifactsImageDataMock,
  summary: {
    identities: [
      {
        id: "invalid-email",
        type: "email",
        value: "invalid@example.com",
        source: "san",
        issuer: "https://token.actions.githubusercontent.com",
      },
    ],
    signatureCount: 1,
    attestationCount: 1,
    rekorEntryCount: 0,
    timeCoherence: {
      status: "error",
      minIntegratedTime: undefined,
      maxIntegratedTime: undefined,
    },
    overallStatus: "verified",
  },
  signatures: [
    {
      id: "sig-invalid-0",
      kind: "hashedrekord",
      identity: {
        san: "invalid@example.com",
        issuer: "https://token.actions.githubusercontent.com",
        issuerType: "github-oidc",
      },
      hash: {
        algorithm: "sha256",
        value: "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      },
      timestamp: "2025-11-06T10:00:00Z",
      status: {
        signature: "invalid",
        rekor: "missing",
        chain: "invalid",
      },
      certificateChain: [],
      rekorEntry: undefined,
    },
  ],
  attestations: [
    {
      id: "att-invalid-0",
      kind: "intoto",
      predicateType: "https://slsa.dev/provenance/v1",
      digest: {
        algorithm: "sha256",
        value: "0000000000000000000000000000000000000000000000000000000000000000",
      },
      subject: artifactsImageDataMock.image,
      issuer: "https://token.actions.githubusercontent.com",
      timestamp: "2025-11-06T10:05:00Z",
      status: {
        verified: false,
        rekor: "missing",
      },
      rekorEntry: undefined,
    },
  ],
};
