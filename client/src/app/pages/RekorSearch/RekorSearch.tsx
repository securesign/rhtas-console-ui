import React, { useState } from "react";

import { RekorClientProvider } from "@app/pages/RekorSearch/api/context";
import { Button, Content, ContentVariants, PageSection, Split, SplitItem } from "@patternfly/react-core";
import { CogIcon } from "@patternfly/react-icons";

import { Explorer } from "./components/Explorer";
import { Settings } from "./components/Settings";
import { DocumentMetadata } from "@app/components/DocumentMetadata";

export const RekorSearch: React.FC = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <RekorClientProvider>
      <DocumentMetadata title="Rekor Search" />
      <PageSection variant="default">
        <Split>
          <SplitItem isFilled>
            <Content>
              <Content component={ContentVariants.h1}>Rekor Search</Content>
              <Content component={ContentVariants.p}>Search the Rekor public transparency log.</Content>
            </Content>
          </SplitItem>
          <SplitItem>
            <Button
              variant="plain"
              icon={<CogIcon />}
              onClick={() => setSettingsOpen(true)}
              data-testid="settings-button"
            />
          </SplitItem>
        </Split>
      </PageSection>
      <PageSection>
        <Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        <Explorer />
      </PageSection>
    </RekorClientProvider>
  );
};
