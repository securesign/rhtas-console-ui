import React, { Fragment } from "react";

import { Content, PageSection, Tab, TabContent, Tabs, TabTitleText } from "@patternfly/react-core";
import { ExternalLinkAltIcon } from "@patternfly/react-icons";

import { LoadingWrapper } from "@app/components/LoadingWrapper";
import { useFetchTrustRootMetadataInfo } from "@app/queries/trust";

import { RootDetails } from "./components/RootDetails";
import { Certificates } from "./components/Certificates";

export const TrustRoots: React.FC = () => {
  const { rootMetadataList, isFetching, fetchError } = useFetchTrustRootMetadataInfo();

  // Tab refs
  const certificatesTabRef = React.createRef<HTMLElement>();
  const rootDetailsTabRef = React.createRef<HTMLElement>();

  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);

  const handleTabClick = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, tabIndex: string | number) => {
    setActiveTabKey(tabIndex);
  };

  return (
    <Fragment>
      <PageSection variant="default">
        <Content>
          <h1>Trust Root</h1>
          <p>This information represents the update framework.</p>
          <p>
            <a href={rootMetadataList?.["repo-url"]} target="_blank" rel="noreferrer">
              {rootMetadataList?.["repo-url"]} <ExternalLinkAltIcon />
            </a>
          </p>
        </Content>
      </PageSection>
      <PageSection variant="default">
        <Tabs
          mountOnEnter
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          aria-label="Tabs that contain the SBOM information"
          role="region"
        >
          <Tab
            eventKey={0}
            title={<TabTitleText>Certificates</TabTitleText>}
            tabContentId="certificatesTabSection"
            tabContentRef={certificatesTabRef}
          />
          <Tab
            eventKey={1}
            title={<TabTitleText>Root details</TabTitleText>}
            tabContentId="rootDetailsTabSection"
            tabContentRef={rootDetailsTabRef}
          />
        </Tabs>
      </PageSection>
      <PageSection>
        <TabContent eventKey={0} id="certificatesTabSection" ref={certificatesTabRef} aria-label="Certificates">
          <Certificates />
        </TabContent>
        <TabContent eventKey={1} id="rootDetailsTabSection" ref={rootDetailsTabRef} aria-label="Root details" hidden>
          <LoadingWrapper isFetching={isFetching} fetchError={fetchError}>
            {rootMetadataList && <RootDetails rootMetadataList={rootMetadataList} />}
          </LoadingWrapper>
        </TabContent>
      </PageSection>
    </Fragment>
  );
};
