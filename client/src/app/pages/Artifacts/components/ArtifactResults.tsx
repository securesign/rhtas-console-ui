import type { ImageMetadataResponse } from "@app/client";
import type { VerifyArtifactResponse } from "@app/client";
import { Panel, PanelMain, PanelMainBody } from "@patternfly/react-core";
import { ArtifactCard } from "./ArtifactCard";

export interface IArtifactResultsProps {
  artifact: ImageMetadataResponse;
  verification: VerifyArtifactResponse;
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
