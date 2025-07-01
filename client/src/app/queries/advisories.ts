import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { client } from "@app/axios-config/apiInit";
import { getApiV1TrustConfig } from "@app/client";

export interface IAdvisoriesQueryParams {
  filterText?: string;
  offset?: number;
  limit?: number;
  sort_by?: string;
}

export const TrustConfigKey = "TrustConfig";

export const useFetchTrustConfig = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [TrustConfigKey],
    queryFn: () => {
      return getApiV1TrustConfig({
        client,
      });
    },
  });

  return {
    config: data?.data,
    isFetching: isLoading,
    fetchError: error as AxiosError,
    refetch,
  };
};
