import React, { Fragment } from "react";

import { Content, ContentVariants, PageSection, Tab, TabContent, Tabs, TabTitleText } from "@patternfly/react-core";
import { ExternalLinkAltIcon } from "@patternfly/react-icons";

import { LoadingWrapper } from "@app/components/LoadingWrapper";
import { useFetchTrustRootMetadataInfo, useFetchTrustTargetCertificates } from "@app/queries/trust";

import { CertificatesTable } from "./components/Certificates";
import { Overview } from "./components/Overview";
import { RootDetails } from "./components/RootDetails";
import { MetadataNotAvailable } from "./components/ErrorStates/MetadataNotAvailable";
import { DocumentMetadata } from "@app/components/DocumentMetadata";

export const TrustRoots: React.FC = () => {
  const {
    rootMetadataList,
    isFetching: isFetchingRootMetadata,
    fetchError: fetchErrorRootMetadata,
  } = useFetchTrustRootMetadataInfo();

  const {
    certificates,
    isFetching: isFetchingCertificates,
    fetchError: fetchErrorCertificates,
  } = useFetchTrustTargetCertificates();

  // Tab refs
  const overviewTabRef = React.createRef<HTMLElement>();
  const certificatesTabRef = React.createRef<HTMLElement>();
  const rootDetailsTabRef = React.createRef<HTMLElement>();

  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);

  const handleTabClick = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, tabIndex: string | number) => {
    setActiveTabKey(tabIndex);
  };

  return (
    <Fragment>
      <DocumentMetadata title="Trust Root" />
      <PageSection variant="default">
        <Content>
          <Content component={ContentVariants.h1}>Trust Root</Content>
          <Content component={ContentVariants.p}>This information represents the update framework.</Content>
          <Content component={ContentVariants.p}>
            <Content component={ContentVariants.a} href={rootMetadataList?.["repo-url"]} target="_blank" rel="noreferrer">
              {rootMetadataList?.["repo-url"]} <ExternalLinkAltIcon />
            </Content>
          </Content>
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
            title={<TabTitleText>Overview</TabTitleText>}
            tabContentId="overviewTabSection"
            tabContentRef={overviewTabRef}
          />
          <Tab
            eventKey={1}
            title={<TabTitleText>Certificates</TabTitleText>}
            tabContentId="certificatesTabSection"
            tabContentRef={certificatesTabRef}
          />
          <Tab
            eventKey={2}
            title={<TabTitleText>Root details</TabTitleText>}
            tabContentId="rootDetailsTabSection"
            tabContentRef={rootDetailsTabRef}
          />
        </Tabs>
      </PageSection>
      <PageSection>
        <TabContent eventKey={0} id="overviewTabSection" ref={overviewTabRef} aria-label="Overview">
          <Overview
            certificates={certificates?.data ?? []}
            isFetching={isFetchingCertificates}
            fetchError={fetchErrorCertificates}
            rootLink={rootMetadataList?.["repo-url"]}
          />
        </TabContent>
        <TabContent eventKey={1} id="certificatesTabSection" ref={certificatesTabRef} aria-label="Certificates" hidden>
          <CertificatesTable
            certificates={certificates?.data ?? []}
            isFetching={isFetchingCertificates}
            fetchError={fetchErrorCertificates}
          />
        </TabContent>
        <TabContent eventKey={2} id="rootDetailsTabSection" ref={rootDetailsTabRef} aria-label="Root details" hidden>
          <LoadingWrapper isFetching={isFetchingRootMetadata} fetchError={fetchErrorRootMetadata}>
            {rootMetadataList ? (
              <RootDetails rootMetadataList={rootMetadataList} />
            ) : (
              <MetadataNotAvailable errorInfo="No metadata list found" />
            )}
          </LoadingWrapper>
        </TabContent>
      </PageSection>
    </Fragment>
  );
};
