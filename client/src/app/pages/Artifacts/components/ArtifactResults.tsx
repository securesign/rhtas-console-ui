import { useState } from "react";
import type { ImageMetadataResponse } from "@app/client";
import type { ArtifactVerificationViewModel } from "@app/queries/artifacts.view-model";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Content,
  Flex,
  FlexItem,
  Label,
  Panel,
  Tab,
  Tabs,
  TabTitleText,
} from "@patternfly/react-core";
import { ArtifactResultsSummary } from "./ArtifactResultsSummary";
import { ArtifactResultsSignatures } from "./ArtifactResultsSignatures";
import { ArtifactResultsAttestations } from "./ArtifactResultsAttestations";
import { verificationStatusToLabelColor } from "@app/utils/utils";

export interface IArtifactResultsProps {
  artifact: ImageMetadataResponse;
  verification: ArtifactVerificationViewModel;
}

export const ArtifactResults = ({ artifact, verification }: IArtifactResultsProps) => {
  const [activeTabKey, setActiveTabKey] = useState<string | number>(0);
  const { overallStatus } = verification.summary;
  const { label: verificationLabel, color: verificationLabelColor } = verificationStatusToLabelColor(overallStatus);

  const handleTabClick = (
    _event: React.MouseEvent<unknown> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

  return (
    <div>
      <p>Showing 1 of 1</p>
      <Card style={{ overflowY: "hidden" }}>
        <CardHeader>
          <Content style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
            <Flex className="border">
              <FlexItem>
                Artifact: <Button variant="plain">{artifact.image}</Button>
              </FlexItem>
              <FlexItem align={{ default: "alignRight" }}>
                <Label color={verificationLabelColor}>{verificationLabel}</Label>
              </FlexItem>
            </Flex>
          </Content>
        </CardHeader>
        <CardBody>
          <Panel>
            {/** ARTIFACT RESULTS SUMMARY */}
            <ArtifactResultsSummary artifact={artifact} verification={verification} />
          </Panel>
          <Panel>
            <Tabs activeKey={activeTabKey} onSelect={handleTabClick} aria-label="Artifact results" role="region">
              <Tab eventKey={0} title={<TabTitleText>Signatures</TabTitleText>} aria-label="Signatures">
                {/** SIGNATURES */}
                <ArtifactResultsSignatures signatures={verification.signatures} />
              </Tab>
              <Tab eventKey={1} title={<TabTitleText>Attestations</TabTitleText>} aria-label="Attestations">
                {/** ATTESTATIONS */}
                <ArtifactResultsAttestations attestations={verification.attestations} />
              </Tab>
            </Tabs>
          </Panel>
        </CardBody>
      </Card>
    </div>
  );
};
