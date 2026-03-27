import React from "react";

import { RekorClientProvider } from "@app/pages/Rekor/shared/utils/rekor/api/context";
import { Alert, Breadcrumb, BreadcrumbItem, Content, PageSection, Spinner } from "@patternfly/react-core";

import { DocumentMetadata } from "@app/components/DocumentMetadata";
import { Paths, useRouteParams } from "@app/Routes";
import { useFetchRekorEntry } from "@app/queries/rekor-search";
import { Link } from "react-router-dom";
import { Entry } from "./components/Entry";

const RekorEntryContent: React.FC = () => {
  const logIndex = useRouteParams("logIndex");

  const { data: entry, isLoading: loading, error } = useFetchRekorEntry(logIndex);

  return (
    <>
      <DocumentMetadata title="Rekor Entry" />
      <PageSection type="breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to={Paths.rekorSearch}>Logs</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{logIndex}</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>
      <PageSection>
        <Content>
          <Content component="h1">{logIndex}</Content>
          <Content component="p">This page shows transparency logs detail.</Content>
        </Content>
      </PageSection>
      <PageSection>
        {loading && <Spinner />}
        {error && <Alert variant="danger" title="Failed to load entry" />}
        {entry && <Entry entry={entry} />}
      </PageSection>
    </>
  );
};

export const RekorEntry: React.FC = () => {
  return (
    <RekorClientProvider>
      <RekorEntryContent />
    </RekorClientProvider>
  );
};
