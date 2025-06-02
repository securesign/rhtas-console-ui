import React from 'react';
import {
  Content,
  Grid,
  GridItem,
  PageSection,
} from '@patternfly/react-core';

const Dashboard = () => {
  return (
    <React.Fragment>
      <PageSection>
        <Content>
          <h1>RHTAS Console</h1>
        </Content>
      </PageSection>
      <PageSection isFilled>
        <Grid hasGutter={true}>
          <GridItem>
            <p>🚧 This page is under construction. 🚧</p>
          </GridItem>
        </Grid>
      </PageSection>
    </React.Fragment>
  );
};

export { Dashboard };
