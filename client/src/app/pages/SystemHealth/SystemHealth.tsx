import { DocumentMetadata } from "@app/components/DocumentMetadata";
import { Content, PageSection } from "@patternfly/react-core";

export const SystemHealth = () => {
  return (
    <>
      <DocumentMetadata title="System Health" />
      <PageSection>
        <Content>
          <h1>System Health</h1>
          <p>Monitor service health, track expiring trust assets, and investigate signing failures from one place</p>
        </Content>
      </PageSection>
      <PageSection></PageSection>
    </>
  );
};
