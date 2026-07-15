import type { TrustCoverageResponse } from "@app/client";

export interface AttestationPresenceItem {
  type: string;
  percentage: number;
}

export interface UnsignedArtifactItem {
  uri: string;
  environment: string;
  registry: string;
  lastSeen: string;
}

export interface TrendDataItem {
  timestamp: string;
  totalArtifacts: number;
  signedCount: number;
  verifiedCount: number;
  attestedCount: number;
  signedPercentage: number;
  verifiedPercentage: number;
  attestedPercentage: number;
}

export const attestationPresenceMock: AttestationPresenceItem[] = [
  { type: "SLSA Provenance", percentage: 92 },
  { type: "SBOM (SPDX)", percentage: 83 },
  { type: "Vulnerability Scan", percentage: 70 },
  { type: "SLSA VSA", percentage: 50 },
  { type: "Test Results", percentage: 32 },
];

export const unsignedArtifactsMock: UnsignedArtifactItem[] = [
  {
    uri: "quay.io/myorg/billing-service:1.4.2",
    environment: "production",
    registry: "quay.io",
    lastSeen: "Mar 09, 2026",
  },
  {
    uri: "quay.io/myorg/auth-proxy:2.0.1",
    environment: "production",
    registry: "quay.io",
    lastSeen: "Mar 08, 2026",
  },
  {
    uri: "registry.example.com/frontend:3.1.0-rc1",
    environment: "staging",
    registry: "registry.example.com",
    lastSeen: "Mar 09, 2026",
  },
  {
    uri: "quay.io/myorg/api-gateway:1.2.0",
    environment: "dev",
    registry: "quay.io",
    lastSeen: "Mar 07, 2026",
  },
  {
    uri: "registry.example.com/worker:0.9.5",
    environment: "staging",
    registry: "registry.example.com",
    lastSeen: "Mar 06, 2026",
  },
];

export interface AllArtifactItem {
  uri: string;
  environment: string;
  registry: string;
  status: "signed" | "unsigned";
  lastSeen: string;
}

export const allArtifactsMock: AllArtifactItem[] = [
  {
    uri: "quay.io/myorg/billing-service:1.4.2",
    environment: "production",
    registry: "quay.io",
    status: "signed",
    lastSeen: "Mar 09, 2026",
  },
  {
    uri: "quay.io/myorg/auth-proxy:2.0.1",
    environment: "production",
    registry: "quay.io",
    status: "signed",
    lastSeen: "Mar 08, 2026",
  },
  {
    uri: "registry.example.com/frontend:3.1.0-rc1",
    environment: "staging",
    registry: "registry.example.com",
    status: "unsigned",
    lastSeen: "Mar 09, 2026",
  },
  {
    uri: "quay.io/myorg/api-gateway:1.2.0",
    environment: "dev",
    registry: "quay.io",
    status: "signed",
    lastSeen: "Mar 07, 2026",
  },
  {
    uri: "registry.example.com/worker:0.9.5",
    environment: "staging",
    registry: "registry.example.com",
    status: "unsigned",
    lastSeen: "Mar 06, 2026",
  },
  {
    uri: "quay.io/myorg/metrics-collector:0.3.1",
    environment: "production",
    registry: "quay.io",
    status: "signed",
    lastSeen: "Mar 10, 2026",
  },
  {
    uri: "quay.io/myorg/notification-svc:1.1.0",
    environment: "dev",
    registry: "quay.io",
    status: "unsigned",
    lastSeen: "Mar 05, 2026",
  },
];

export const trustCoverageMock: TrustCoverageResponse = {
  totalArtifacts: 124,
  attestedCount: 115,
  verifiedPercentage: 98,
  attestedPercentage: 92.7,
  updatedAt: "2026-03-19T12:00:00Z",
};

export const attestationTrendData: TrendDataItem[] = [
  {
    timestamp: "2026-02-18T00:00:00Z",
    totalArtifacts: 130,
    signedCount: 107,
    verifiedCount: 100,
    attestedCount: 114,
    signedPercentage: 82.3,
    verifiedPercentage: 76.9,
    attestedPercentage: 87.7,
  },
  {
    timestamp: "2026-02-23T00:00:00Z",
    totalArtifacts: 132,
    signedCount: 110,
    verifiedCount: 103,
    attestedCount: 117,
    signedPercentage: 83.3,
    verifiedPercentage: 78.0,
    attestedPercentage: 88.6,
  },
  {
    timestamp: "2026-02-28T00:00:00Z",
    totalArtifacts: 135,
    signedCount: 114,
    verifiedCount: 107,
    attestedCount: 121,
    signedPercentage: 84.4,
    verifiedPercentage: 79.3,
    attestedPercentage: 89.6,
  },
  {
    timestamp: "2026-03-05T00:00:00Z",
    totalArtifacts: 137,
    signedCount: 117,
    verifiedCount: 110,
    attestedCount: 124,
    signedPercentage: 85.4,
    verifiedPercentage: 80.3,
    attestedPercentage: 90.5,
  },
  {
    timestamp: "2026-03-10T00:00:00Z",
    totalArtifacts: 139,
    signedCount: 119,
    verifiedCount: 113,
    attestedCount: 127,
    signedPercentage: 85.6,
    verifiedPercentage: 81.3,
    attestedPercentage: 91.4,
  },
  {
    timestamp: "2026-03-14T00:00:00Z",
    totalArtifacts: 140,
    signedCount: 121,
    verifiedCount: 115,
    attestedCount: 129,
    signedPercentage: 86.4,
    verifiedPercentage: 82.1,
    attestedPercentage: 92.1,
  },
  {
    timestamp: "2026-03-19T00:00:00Z",
    totalArtifacts: 142,
    signedCount: 124,
    verifiedCount: 118,
    attestedCount: 131,
    signedPercentage: 87.3,
    verifiedPercentage: 83.1,
    attestedPercentage: 92.3,
  },
];
