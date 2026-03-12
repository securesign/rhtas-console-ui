import { Fragment, useState } from "react";
import { Content, PageSection } from "@patternfly/react-core";
import { useFetchArtifactsImageData, useVerifyArtifact } from "@app/queries/artifacts";
import { LoadingWrapper } from "@app/components/LoadingWrapper";
import { ArtifactResults } from "./components/ArtifactResults";
import { DocumentMetadata } from "@app/components/DocumentMetadata";
import { SearchForm } from "@app/components/SearchForm";

export const Artifacts = () => {
  const [artifactUri, setArtifactUri] = useState<string | null>();

  const {
    artifact,
    isFetching: isFetchingArtifactMetadata,
    fetchError: fetchErrorArtifactMetadata,
  } = useFetchArtifactsImageData({ uri: artifactUri });

  const {
    verification,
    isFetching: isFetchingVerification,
    fetchError: fetchErrorVerification,
    refetch: refetchVerification,
  } = useVerifyArtifact({ uri: artifactUri });

  const handleSubmit = (value: string) => {
    if (value === artifactUri) {
      void refetchVerification();
    } else {
      setArtifactUri(value);
    }
  };

  return (
    <Fragment>
      <DocumentMetadata title="Artifacts" />
      <PageSection>
        <Content>
          <h1>Artifacts</h1>
          <p>View your artifacts and their metadata</p>
        </Content>
      </PageSection>
      <PageSection>
        <SearchForm
          label="Search for an artifact"
          placeholder="Enter container image URI to view an artifact and its metadata"
          ariaLabel="Containerimage URI input field"
          id="uri"
          name="searchInput"
          onSubmit={handleSubmit}
        />
      </PageSection>
      <PageSection>
        <LoadingWrapper
          isFetching={isFetchingArtifactMetadata || isFetchingVerification}
          fetchError={fetchErrorArtifactMetadata ?? fetchErrorVerification}
        >
          {artifact && verification && <ArtifactResults artifact={artifact} verification={verification} />}
        </LoadingWrapper>
      </PageSection>
    </Fragment>
  );
};
