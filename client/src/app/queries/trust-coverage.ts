import type { AxiosError } from "axios";

import { trustCoverageMock } from "./mocks/trust-coverage.mock";
import { useMockableQuery } from "./helpers";
import type { TrustCoverageResponse } from "@app/client";

export const useFetchTrustCoverageSummary = () => {
  const { data, isLoading, error } = useMockableQuery<TrustCoverageResponse, AxiosError>(
    {
      queryKey: ["TrustCoverage", "summary"],
      queryFn: () => {
        throw new Error("Api call is not ready yet, use MOCK=on");
      },
      refetchOnWindowFocus: false,
    },
    trustCoverageMock
  );

  return { data, isFetching: isLoading, fetchError: error };
};
