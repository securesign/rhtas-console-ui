import type { AxiosError } from "axios";

import { client } from "@app/axios-config/apiInit";
import { getApiV1ArtifactsImage, type _Error, type ImageMetadataResponse } from "@app/client";
import { useMockableQuery } from "./helpers";
import { artifactsImageDataMock } from "./mocks/artifacts.mock";

export const ArtifactsKey = "Artifacts";

export const useFetchArtifactsImageData = ({ uri }: { uri: string | null | undefined }) => {
  const enabled = typeof uri === "string" && uri.trim().length > 0;
  const { data, isLoading, error, refetch } = useMockableQuery<ImageMetadataResponse | null, AxiosError<_Error>>(
    {
      queryKey: [ArtifactsKey, enabled, "image", uri ?? ""],
      queryFn: async () => {
        if (!enabled) return null;
        const response = await getApiV1ArtifactsImage({ client, query: { uri } });
        return response.data ?? null;
      },
      // only run when we have a string
      enabled: !!uri,
      refetchOnWindowFocus: false,
    },
    artifactsImageDataMock
  );

  return { artifact: data, isFetching: isLoading, fetchError: error, refetch };
};
