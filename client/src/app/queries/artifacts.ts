import type { AxiosError } from "axios";
import { client } from "@app/axios-config/apiInit";
import {
  getApiV1ArtifactsImage,
  type Error,
  type ImageMetadataResponse,
  postApiV1ArtifactsVerify,
  type VerifyArtifactRequest,
  type VerifyArtifactResponse,
} from "@app/client";
import { useMockableQuery } from "./helpers";
import { artifactsImageDataMock, artifactVerificationViewModelMock } from "./mocks/artifacts.mock";

export const ArtifactsKeys = {
  all: ["Artifacts" as const],
  image: (uri: string) => ["Artifacts", "image", uri] as const,
  verify: (uri: string, expectedSAN: string | null | undefined) =>
    ["Artifacts", "verify", uri, expectedSAN ?? null] as const,
};

export const useFetchArtifactsImageData = ({ uri }: { uri: string | null | undefined }) => {
  const enabled = typeof uri === "string" && uri.trim().length > 0;
  const { data, isLoading, error, refetch } = useMockableQuery<ImageMetadataResponse | null, AxiosError<Error>>(
    {
      queryKey: ArtifactsKeys.image(uri ?? ""),
      queryFn: async () => {
        const response = await getApiV1ArtifactsImage({ client, query: { uri: uri! } });
        return response.data ?? null;
      },
      // only run when we have a string
      enabled,
      refetchOnWindowFocus: false,
    },
    artifactsImageDataMock
  );

  return { artifact: data, isFetching: isLoading, fetchError: error, refetch };
};

export const useVerifyArtifact = ({
  uri,
  expectedSAN,
}: {
  uri: string | null | undefined;
  expectedSAN?: string | null;
}) => {
  const enabled = typeof uri === "string" && uri.trim().length > 0;

  const { data, isLoading, error, refetch } = useMockableQuery<VerifyArtifactResponse | null, AxiosError<Error>>(
    {
      queryKey: ArtifactsKeys.verify(uri ?? "", expectedSAN ?? null),
      enabled,
      refetchOnWindowFocus: false,
      queryFn: async () => {
        if (!uri) {
          return null;
        }

        const body: VerifyArtifactRequest = {
          expectedSAN: expectedSAN ?? null,
          // temporarily accept any issuer
          expectedOIDIssuerRegex: ".*",
          ociImage: uri,
        };

        const response = await postApiV1ArtifactsVerify({ client, body });

        return response.data ?? null;
      },
    },
    artifactVerificationViewModelMock
  );

  return {
    verification: data,
    isFetching: isLoading,
    fetchError: error,
    refetch,
  };
};
