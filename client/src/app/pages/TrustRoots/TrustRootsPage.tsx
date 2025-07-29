import { Fragment } from "react";

import { Content, PageSection } from "@patternfly/react-core";

import { useFetchTrustRootMetadataInfo } from "@app/queries/trust";
import { TrustRootsDataList } from "./components/TrustRootsDataList";

const TrustRootsPage = () => {
  const metadataInfo = useFetchTrustRootMetadataInfo();
  console.log(metadataInfo);

  return (
    <Fragment>
      <PageSection variant="default">
        <Content>
          <h1>Trust Roots</h1>
          <p>Review trust root data such as TUF targets and Fulcio certificate authorities.</p>
        </Content>
      </PageSection>
      <PageSection variant="default">
        <TrustRootsDataList />
      </PageSection>
    </Fragment>
  );
};

export { TrustRootsPage };
