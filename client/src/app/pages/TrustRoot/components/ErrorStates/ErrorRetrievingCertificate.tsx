import React from "react";
import { Bullseye, EmptyState, EmptyStateBody, EmptyStateStatus, EmptyStateVariant } from "@patternfly/react-core";

export const ErrorRetrievingCertificate: React.FC = () => (
  <Bullseye>
    <EmptyState
      headingLevel="h4"
      titleText="Error retrieving certificate information"
      status={EmptyStateStatus.danger}
      variant={EmptyStateVariant.lg}
    >
      <EmptyStateBody className="pf-v6-u-font-size--xs">
        Due to issues with extracting certificate information, we could not find any valid certificates. The system will
        automatically retry again in 30 seconds.
      </EmptyStateBody>
    </EmptyState>
  </Bullseye>
);
