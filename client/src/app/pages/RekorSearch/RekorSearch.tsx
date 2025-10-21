import React, { Fragment } from "react";

import { RekorClientProvider } from "@app/api/context";
import { Content, PageSection } from "@patternfly/react-core";

import { Explorer } from "./components/Explorer";

export const RekorSearch: React.FC = () => {
  return (
    <Fragment>
      <PageSection variant="default">
        <Content>
          <h1>Rekor Search</h1>
          <p>Search the Rekor public transparency log.</p>
        </Content>
      </PageSection>
      <PageSection variant="secondary" isFilled>
        <RekorClientProvider>
          <Explorer />
        </RekorClientProvider>
      </PageSection>
    </Fragment>
  );
};
