import React, { useState } from "react";

import { RekorClientProvider } from "@app/pages/RekorSearch/api/context";
import { Button, Content, PageSection, Split, SplitItem } from "@patternfly/react-core";
import { CogIcon } from "@patternfly/react-icons";

import { Explorer } from "./components/Explorer";
import { Settings } from "./components/Settings";

export const RekorSearch: React.FC = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <RekorClientProvider>
      <PageSection variant="default">
        <Split>
          <SplitItem isFilled>
            <Content>
              <h1>Rekor Search</h1>
              <p>Search the Rekor public transparency log.</p>
            </Content>
          </SplitItem>
          <SplitItem>
            <Button variant="plain" icon={<CogIcon />} onClick={() => setSettingsOpen(true)} />
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
