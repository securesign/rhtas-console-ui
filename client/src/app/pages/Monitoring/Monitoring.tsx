import type React from "react";
import { Bullseye, EmptyState, EmptyStateBody } from "@patternfly/react-core";
import ChartLineIcon from "@patternfly/react-icons/dist/esm/icons/chart-line-icon";

export const Monitoring: React.FC = () => {
  return (
    <Bullseye>
      <EmptyState titleText="Monitoring & Alerting" headingLevel="h4" icon={ChartLineIcon}>
        <EmptyStateBody>Monitoring and alerting features will be available here.</EmptyStateBody>
      </EmptyState>
    </Bullseye>
  );
};
