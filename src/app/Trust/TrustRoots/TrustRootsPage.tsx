import { Fragment } from 'react';

import { Content, PageSection } from '@patternfly/react-core';

import { TrustRootsDataList } from './components/TrustRootsDataList';

const TrustRootsPage = () => {
  return (
    <Fragment>
      <PageSection variant="default">
        <Content>
          <h1>Trust Roots</h1>
          <p>Review Fulcio certificate authorities configured in the trust root.</p>
        </Content>
      </PageSection>
      <PageSection variant="default">
        <TrustRootsDataList />
      </PageSection>
    </Fragment>
  );
};

export { TrustRootsPage };
