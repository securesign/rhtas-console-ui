import React from "react";
import { Bullseye, EmptyState, EmptyStateBody, EmptyStateStatus } from "@patternfly/react-core";

export const CertificateDoesNotExist: React.FC = () => {
  return (
    <Bullseye>
      <EmptyState titleText="Certificate does not exist" headingLevel="h6" status={EmptyStateStatus.info}>
        <EmptyStateBody>Currently this trust root does not have any have certificates to display</EmptyStateBody>
      </EmptyState>
    </Bullseye>
  );
};
