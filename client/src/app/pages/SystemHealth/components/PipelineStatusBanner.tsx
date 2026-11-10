import { Alert, AlertActionLink } from "@patternfly/react-core";

export const PipelineStatusBanner: React.FC = () => (
  <Alert
    variant="danger"
    isInline
    title="Down – signing pipeline unavailable"
    actionLinks={
      <>
        <AlertActionLink>View incident</AlertActionLink>
        <AlertActionLink>Open runbook</AlertActionLink>
      </>
    }
  >
    Fulcio is unreachable and the TUF root has expired. New signatures will fail until both are restored.
  </Alert>
);
