import { Fragment } from "react";

import { Content, PageSection } from "@patternfly/react-core";

import { useFetchArtifactsImageData } from "@app/queries/artifacts";
import { LoadingWrapper } from "@app/components/LoadingWrapper";

export const Artifacts = () => {
  const {
    artifact,
    isFetching: isFetchingArtifactMetadata,
    fetchError: fetchErrorArtifactMetadata,
  } = useFetchArtifactsImageData();
  return (
    <Fragment>
      <PageSection variant="default">
        <Content>
          <h1>Artifacts</h1>
          <p>Artifacts</p>
        </Content>
        <LoadingWrapper isFetching={isFetchingArtifactMetadata} fetchError={fetchErrorArtifactMetadata}>
          {artifact && <div>Artifact details here.. {artifact.digest}</div>}
        </LoadingWrapper>
      </PageSection>
    </Fragment>
  );
};
