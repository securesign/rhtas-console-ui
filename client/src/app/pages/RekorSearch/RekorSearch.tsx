import { PageSection } from "@patternfly/react-core";
import { Explorer } from "./components/Explorer";
import { RekorClientProvider } from "@app/api/context";

export const RekorSearch: React.FC = () => {
  return (
    <PageSection>
      <RekorClientProvider>
        <Explorer />
      </RekorClientProvider>
    </PageSection>
  );
};
