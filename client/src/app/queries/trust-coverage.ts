import type { AxiosError } from "axios";
import { client } from "@app/axios-config/apiInit";

import {
  type AllArtifactItem,
  type AttestationPresenceItem,
  type TrendDataItem,
  type UnsignedArtifactItem,
  allArtifactsMock,
  attestationPresenceMock,
  attestationTrendData,
  trustCoverageMock,
  unsignedArtifactsMock,
} from "./mocks/trust-coverage.mock";
import { useMockableQuery } from "./helpers";
import { getApiV1TrustCoverage, type TrustCoverageResponse } from "@app/client";

export const useFetchTrustCoverageSummary = () => {
  const { data, isLoading, error } = useMockableQuery<TrustCoverageResponse | null, AxiosError>(
    {
      queryKey: ["TrustCoverage", "summary"],
      queryFn: async () => {
        const response = await getApiV1TrustCoverage({ client });
        return response.data ?? null;
      },
      refetchOnWindowFocus: false,
    },
    trustCoverageMock,
  );

  return { data, isFetching: isLoading, fetchError: error };
};

export const useFetchAttestationPresence = () => {
  const { data, isLoading, error } = useMockableQuery<AttestationPresenceItem[], AxiosError>(
    {
      queryKey: ["TrustCoverage", "attestationPresence"],
      queryFn: () => {
        throw new Error("Api call is not ready yet, use MOCK=on");
      },
      refetchOnWindowFocus: false,
    },
    attestationPresenceMock,
  );

  return { data, isFetching: isLoading, fetchError: error };
};

export const useFetchAllArtifacts = () => {
  const { data, isLoading, error } = useMockableQuery<AllArtifactItem[], AxiosError>(
    {
      queryKey: ["TrustCoverage", "allArtifacts"],
      queryFn: () => {
        throw new Error("Api call is not ready yet, use MOCK=on");
      },
      refetchOnWindowFocus: false,
    },
    allArtifactsMock,
  );

  return { data, isFetching: isLoading, fetchError: error };
};

export const useFetchUnsignedArtifacts = () => {
  const { data, isLoading, error } = useMockableQuery<UnsignedArtifactItem[], AxiosError>(
    {
      queryKey: ["TrustCoverage", "unsignedArtifacts"],
      queryFn: () => {
        throw new Error("Api call is not ready yet, use MOCK=on");
      },
      refetchOnWindowFocus: false,
    },
    unsignedArtifactsMock,
  );

  return { data, isFetching: isLoading, fetchError: error };
};

export const useFetchArtifactTrendData = () => {
  const { data, isLoading, error } = useMockableQuery<TrendDataItem[], AxiosError>(
    {
      queryKey: ["TrustCoverage", "unsignedArtifacts"],
      queryFn: () => {
        throw new Error("Api call is not ready yet, use MOCK=on");
      },
      refetchOnWindowFocus: false,
    },
    attestationTrendData,
  );

  return { data, isFetching: isLoading, fetchError: error };
};
