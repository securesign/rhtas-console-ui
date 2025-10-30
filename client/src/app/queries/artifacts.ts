import type { AxiosError } from "axios";

import { client } from "@app/axios-config/apiInit";
import { getApiV1ArtifactsImage, type _Error, type ImageMetadataResponse } from "@app/client";
import { useMockableQuery } from "./helpers";
import { artifactsImageDataMock } from "./mocks/artifacts.mock";

export const ArtifactsKey = "Artifacts";

export const useFetchArtifactsImageData = ({ uri }: { uri: string | null }) => {
  const { data, isLoading, error, refetch } = useMockableQuery<ImageMetadataResponse | null, AxiosError<_Error>>(
    {
      queryKey: [ArtifactsKey, "image", uri],
      queryFn: async () => {
        const response = await getApiV1ArtifactsImage({ client, query: { uri } });
        return response.data ?? null;
      },
      // only run when we have a string
      enabled: !!uri,
      refetchOnWindowFocus: false,
      gcTime: 0,
    },
    artifactsImageDataMock
  );

  return { artifact: data, isFetching: isLoading, fetchError: error, refetch };
};
