import React from "react";
import { Bullseye, EmptyState, EmptyStateBody, EmptyStateStatus, EmptyStateVariant } from "@patternfly/react-core";

interface MetadataNotAvailableProps {
  errorInfo?: string;
}

export const MetadataNotAvailable: React.FC<MetadataNotAvailableProps> = ({ errorInfo }) => (
  <Bullseye>
    <EmptyState
      variant={EmptyStateVariant.sm}
      titleText="Latest root metadata not available"
      status={EmptyStateStatus.danger}
      headingLevel="h4"
    >
      <EmptyStateBody>{errorInfo} </EmptyStateBody>
    </EmptyState>
  </Bullseye>
);
