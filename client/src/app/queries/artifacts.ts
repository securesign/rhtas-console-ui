import type { AxiosError } from "axios";

import { client } from "@app/axios-config/apiInit";
import {
  getApiV1ArtifactsImage,
  type PostApiV1ArtifactsVerifyResponse,
  type _Error,
  type ImageMetadataResponse,
} from "@app/client";
import { useMockableMutation, useMockableQuery } from "./helpers";
import { artifactsImageDataMock, artifactsVerificationMock } from "./mocks/artifacts.mock";
import { useQueryClient } from "@tanstack/react-query";

export const ArtifactsKeys = {
  all: ["Artifacts" as const],
  image: (uri: string) => ["Artifacts", "image", uri] as const,
  verify: (id: string | number) => ["Artifacts", "verify", id] as const,
};

export const useFetchArtifactsImageData = ({ uri }: { uri: string | null | undefined }) => {
  const enabled = typeof uri === "string" && uri.trim().length > 0;
  const { data, isLoading, error, refetch } = useMockableQuery<ImageMetadataResponse | null, AxiosError<_Error>>(
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

export const useVerifyArtifact = () => {
  const queryClient = useQueryClient();
  return useMockableMutation<PostApiV1ArtifactsVerifyResponse | null, AxiosError<_Error>, VerifyArtifactDraft>(
    {
      // eslint-disable-next-line @typescript-eslint/require-await
      mutationFn: async (draft) => {
        // if the backend/types aren't ready (e.g., missing SAN), return a mock/null
        if (!draft.expectedSAN) {
          return null;
        }

        // map the draft payload into the SDK body shape. Include only fields we know.
        // const res = await postApiV1ArtifactsVerify({
        //   client,
        //   body: {
        //     // the SDK requires `expectedSAN` (string | null); ensure it exists when we reach here
        //     expectedSAN: draft.expectedSAN ?? null,
        //     // use `ociImage` for the artifact reference (since `uri` isn't in the SDK type)
        //     ociImage: draft.uri,
        //   } as VerifyArtifactRequest,
        // });
        // return res.data ?? null;
        return null;
      },
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: ArtifactsKeys.all });
      },
    },
    artifactsVerificationMock
  );
};
