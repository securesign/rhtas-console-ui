import type { ImageMetadataResponse } from "@app/client";
import type { ArtifactVerificationViewModel } from "@app/queries/artifacts.view-model";
import { Panel, PanelMain, PanelMainBody } from "@patternfly/react-core";
import { ArtifactCard } from "./ArtifactCard";

export interface IArtifactResultsProps {
  artifact: ImageMetadataResponse;
  verification: ArtifactVerificationViewModel;
}

export const ArtifactResults = ({ artifact, verification }: IArtifactResultsProps) => {
  return (
    <div>
      <Panel>
        <PanelMain>
          <PanelMainBody>Showing 1 of 1</PanelMainBody>
        </PanelMain>
      </Panel>
      <ArtifactCard artifact={artifact} verification={verification} />
    </div>
  );
};
