import type React from "react";
import { Bullseye, EmptyState, EmptyStateBody } from "@patternfly/react-core";
import ChartLineIcon from "@patternfly/react-icons/dist/esm/icons/chart-line-icon";

export const Observability: React.FC = () => {
  return (
    <Bullseye>
      <EmptyState titleText="Observability" headingLevel="h4" icon={ChartLineIcon}>
        <EmptyStateBody>Observability and monitoring features will be available here.</EmptyStateBody>
      </EmptyState>
    </Bullseye>
  );
};
