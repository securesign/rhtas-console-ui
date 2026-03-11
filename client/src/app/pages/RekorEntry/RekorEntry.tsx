import React, { useEffect, useState } from "react";

import { RekorClientProvider, useRekorClient } from "@app/pages/RekorSearch/api/context";
import { Alert, Breadcrumb, BreadcrumbItem, Content, PageSection, Spinner } from "@patternfly/react-core";

import { DocumentMetadata } from "@app/components/DocumentMetadata";
import { Paths, useRouteParams } from "@app/Routes";
import { Link } from "react-router-dom";
import type { LogEntry } from "rekor";
import { Entry } from "./components/Entry";

const RekorEntryContent: React.FC = () => {
  const logIndex = useRouteParams("logIndex");
  const client = useRekorClient();

  const [entry, setEntry] = useState<LogEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      setError(null);
      try {
        const result = await client.entries.getLogEntryByIndex({ logIndex: Number(logIndex) });
        setEntry(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    }

    void fetch();
  }, [logIndex, client]);

  console.log(entry);

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
