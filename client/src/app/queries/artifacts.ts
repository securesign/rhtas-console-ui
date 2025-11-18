import type { AxiosError } from "axios";
import { client } from "@app/axios-config/apiInit";
import {
  getApiV1ArtifactsImage,
  type _Error,
  type ImageMetadataResponse,
  postApiV1ArtifactsVerify,
  type VerifyArtifactRequest,
} from "@app/client";
import { useMockableMutation, useMockableQuery } from "./helpers";
import { artifactsImageDataMock, artifactVerificationViewModelMock } from "./mocks/artifacts.mock";
import type { ArtifactVerificationViewModel } from "@app/queries/artifacts";
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

// Variables accepted by the verify mutation. This represents the data we send to the
// backend (request), which is separate from the view-model we use for rendering
// (ArtifactVerificationViewModel).
interface IVerifyArtifactVariables {
  uri: string;
  expectedSAN?: string | null;
}

export const useVerifyArtifact = () => {
  const queryClient = useQueryClient();

  // NOTE:
  // - TData: ArtifactVerificationViewModel   → what the UI consumes
  // - TError: AxiosError<_Error>             → error shape from the SDK
  // - TVariables: IVerifyArtifactVariables   → what the caller passes in (uri, expectedSAN, etc.)
  return useMockableMutation<ArtifactVerificationViewModel, AxiosError<_Error>, IVerifyArtifactVariables>(
    {
      mutationFn: async ({ uri, expectedSAN }: IVerifyArtifactVariables) => {
        // For now, the backend still returns VerifyArtifactResponse, not the full
        // ArtifactVerificationViewModel. We keep calling the SDK so wiring is in place,
        // but we return the locally defined view-model mock until the API contract is
        // updated and we can map the response into the view-model shape.
        const body: VerifyArtifactRequest = {
          expectedSAN: expectedSAN ?? null,
          // TEMP: accept any issuer
          expectedOIDIssuerRegex: ".*",
          ociImage: uri,
        };

        await postApiV1ArtifactsVerify({
          client,
          body,
        });

        // Temporary: always return the mock view-model. When the backend is
        // updated to return this shape (or something close to it), this is
        // where we will adapt `res.data` into `ArtifactVerificationViewModel`.
        return artifactVerificationViewModelMock;
      },
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: ArtifactsKeys.all });
      },
    },
    artifactVerificationViewModelMock
  );
};

// Re-export view-model types so consumers don't have to import from the mocks module.
export type {
  ArtifactVerificationViewModel,
  ArtifactIdentity,
  TimeCoherenceSummary,
  ArtifactSummaryView,
  ParsedCertificate,
  CertificateRole,
  SignatureVerificationStatus,
  SignatureStatus,
  HashSummary,
  SignatureView,
  AttestationStatus,
  AttestationView,
} from "./mocks/artifacts.mock";
