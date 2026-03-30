import React from "react";

import { RekorClientProvider } from "@app/pages/Rekor/shared/utils/rekor/api/context";
import {
  Alert,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Content,
  Flex,
  FlexItem,
  PageSection,
  Spinner,
} from "@patternfly/react-core";

import { DocumentMetadata } from "@app/components/DocumentMetadata";
import { Paths, useRouteParams } from "@app/Routes";
import { useFetchRekorEntry } from "@app/queries/rekor-search";
import { Link, useNavigate } from "react-router-dom";
import { Entry } from "./components/Entry";
import { ArrowLeftIcon } from "@patternfly/react-icons";

const RekorEntryContent: React.FC = () => {
  const navigate = useNavigate();
  const logIndex = useRouteParams("logIndex");

  const { data: entry, isLoading: loading, error } = useFetchRekorEntry(logIndex);

  return (
    <>
      <DocumentMetadata title="Rekor Entry" />
      <PageSection type="breadcrumb">
        <Flex spaceItems={{ default: "spaceItemsXs" }}>
          <FlexItem>
            <Button size="sm" variant="plain" onClick={() => void navigate(-1)} style={{ cursor: "pointer" }}>
              <ArrowLeftIcon />
            </Button>
          </FlexItem>
          <FlexItem>
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to={Paths.rekorSearch}>Logs</Link>
              </BreadcrumbItem>
              <BreadcrumbItem isActive>{logIndex}</BreadcrumbItem>
            </Breadcrumb>
          </FlexItem>
        </Flex>
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
