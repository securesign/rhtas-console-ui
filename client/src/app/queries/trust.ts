import type { AxiosError } from "axios";

import { client } from "@app/axios-config/apiInit";
import {
  getApiV1TrustConfig,
  getApiV1TrustRootMetadataInfo,
  getApiV1TrustTargetsCertificates,
  type _Error,
  type CertificateInfoList,
  type RootMetadataInfoList,
  type TrustConfig,
} from "@app/client";

import { useMockableQuery } from "./helpers";
import { trustConfigMock, trustRootMetadataInfoMock, trustTargetCertificatesMock } from "./mocks/trust.mock";

export const TrustKey = "Trust";

export const useFetchTrustConfig = () => {
  const { data, isLoading, error, refetch } = useMockableQuery<TrustConfig | null, AxiosError<_Error>>(
    {
      queryKey: [TrustKey, "config"],
      queryFn: async () => {
        const response = await getApiV1TrustConfig({
          client,
        });
        return response.data ?? null;
      },
    },
    trustConfigMock
  );

  return {
    config: data,
    isFetching: isLoading,
    fetchError: error,
    refetch,
  };
};

export const useFetchTrustRootMetadataInfo = () => {
  const { data, isLoading, error, refetch } = useMockableQuery<RootMetadataInfoList | null, AxiosError<_Error>>(
    {
      queryKey: [TrustKey, "metadata"],
      queryFn: async () => {
        const response = await getApiV1TrustRootMetadataInfo({
          client,
        });
        return response.data ?? null;
      },
    },
    trustRootMetadataInfoMock
  );

  return {
    rootMetadataList: data,
    isFetching: isLoading,
    fetchError: error,
    refetch,
  };
};

export const useFetchTrustTargetCertificates = () => {
  const { data, isLoading, error, refetch } = useMockableQuery<CertificateInfoList | null, AxiosError<_Error>>(
    {
      queryKey: [TrustKey, "certificates"],
      queryFn: async () => {
        const response = await getApiV1TrustTargetsCertificates({
          client,
        });
        return response.data ?? null;
      },
    },
    trustTargetCertificatesMock
  );

  return {
    certificates: data,
    isFetching: isLoading,
    fetchError: error,
    refetch,
  };
};
