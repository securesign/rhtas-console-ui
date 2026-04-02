import type { AxiosError } from "axios";

import {
  type AttestationPresenceItem,
  type UnsignedArtifactItem,
  attestationPresenceMock,
  trustCoverageMock,
  unsignedArtifactsMock,
} from "./mocks/trust-coverage.mock";
import { useMockableQuery } from "./helpers";
import type { TrustCoverageResponse } from "@app/client";

export const useFetchTrustCoverageSummary = (environment?: string) => {
  const { data, isLoading, error } = useMockableQuery<TrustCoverageResponse, AxiosError>(
    {
      queryKey: ["TrustCoverage", "summary", { environment }],
      queryFn: () => {
        throw new Error("Api call is not ready yet, use MOCK=on");
      },
      refetchOnWindowFocus: false,
    },
    trustCoverageMock
  );

  return { data, isFetching: isLoading, fetchError: error };
};

export const useFetchAttestationPresence = (environment?: string) => {
  const { data, isLoading, error } = useMockableQuery<AttestationPresenceItem[], AxiosError>(
    {
      queryKey: ["TrustCoverage", "attestationPresence", { environment }],
      queryFn: () => {
        throw new Error("Api call is not ready yet, use MOCK=on");
      },
      refetchOnWindowFocus: false,
    },
    attestationPresenceMock
  );

  return { data, isFetching: isLoading, fetchError: error };
};

export const useFetchUnsignedArtifacts = (environment?: string) => {
  const { data, isLoading, error } = useMockableQuery<UnsignedArtifactItem[], AxiosError>(
    {
      queryKey: ["TrustCoverage", "unsignedArtifacts", { environment }],
      queryFn: () => {
        throw new Error("Api call is not ready yet, use MOCK=on");
      },
      refetchOnWindowFocus: false,
    },
    unsignedArtifactsMock
  );

  return { data, isFetching: isLoading, fetchError: error };
};
