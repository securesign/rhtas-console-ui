import React from "react";
import { Bullseye, EmptyState, EmptyStateBody, EmptyStateStatus, EmptyStateVariant } from "@patternfly/react-core";

interface RepositoryNotInitiatedProps {
  rootLink?: string;
}

export const RepositoryNotInitiated: React.FC<RepositoryNotInitiatedProps> = ({ rootLink }) => (
  <Bullseye>
    <EmptyState
      variant={EmptyStateVariant.lg}
      titleText="Repository not initialized"
      headingLevel="h4"
      status={EmptyStateStatus.danger}
    >
      <EmptyStateBody>
        {rootLink
          ? `
          Failed to build trust root options for ${rootLink}. The system will retry again in 30 seconds.`
          : "Failed to build trust root options. The system will retry again in 30 seconds."}
      </EmptyStateBody>
    </EmptyState>
  </Bullseye>
);
