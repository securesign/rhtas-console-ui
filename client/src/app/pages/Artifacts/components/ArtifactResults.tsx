import type { ImageMetadataResponse } from "@app/client";
import type { ArtifactVerificationViewModel } from "@app/queries/artifacts";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Content,
  ContentVariants,
  Flex,
  FlexItem,
  Panel,
  Tab,
  Tabs,
  TabTitleText,
} from "@patternfly/react-core";
import { ArtifactResultsSummary } from "./ArtifactResultsSummary";
import { ArtifactResultsSignatures } from "./ArtifactResultsSignatures";
import { useState } from "react";
import { ArtifactResultsAttestations } from "./ArtifactResultsAttestations";

export interface IArtifactResultsProps {
  artifact: ImageMetadataResponse;
  verification: ArtifactVerificationViewModel;
}

export const ArtifactResults = ({ artifact, verification }: IArtifactResultsProps) => {
  const [activeTabKey, setActiveTabKey] = useState<string | number>(0);

  const handleTabClick = (
    _event: React.MouseEvent<unknown> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

  return (
    <div style={{ margin: "2em auto" }}>
      <p>Showing 1 of 1</p>
      <Card style={{ margin: "1.5em auto 2em", overflowY: "hidden" }}>
        <CardHeader>
          <Content component={ContentVariants.h4} style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
            <Flex className="border">
              <FlexItem>
                Artifact: <Button variant="plain">{artifact.image}</Button>
              </FlexItem>
              <FlexItem align={{ default: "alignRight" }}>Verified ✓</FlexItem>
            </Flex>
          </Content>
        </CardHeader>
        <CardBody>
          <Panel style={{ margin: "0.75em auto" }}>
            {/** ARTIFACT RESULTS SUMMARY */}
            <ArtifactResultsSummary artifact={artifact} verification={verification} />
          </Panel>
          <Panel style={{ marginTop: "1.25em" }}>
            <Tabs activeKey={activeTabKey} onSelect={handleTabClick} aria-label="Artifact results" role="region">
              <Tab
                eventKey={0}
                title={<TabTitleText>Signatures</TabTitleText>}
                aria-label="Default content - signatures"
              >
                {/** SIGNATURES */}
                <ArtifactResultsSignatures signatures={verification.signatures} />
              </Tab>
              <Tab eventKey={1} title={<TabTitleText>Attestations</TabTitleText>}>
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
