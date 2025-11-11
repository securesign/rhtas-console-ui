import type { ImageMetadataResponse } from "@app/client";
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

export interface IArtifactResultsProps {
  artifact: ImageMetadataResponse;
}

export const ArtifactResults = ({ artifact }: IArtifactResultsProps) => {
  // temporary workaround until API merged
  const artifactSignatures: string[] = ["a", "b"];
  const [activeTabKey, setActiveTabKey] = useState<string | number>(0);

  const handleTabClick = (
    event: React.MouseEvent<unknown> | React.KeyboardEvent | MouseEvent,
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
            <Flex className="example-border">
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
            <ArtifactResultsSummary artifact={artifact} />
          </Panel>
          <Panel style={{ marginTop: "1.25em" }}>
            <Tabs
              activeKey={activeTabKey}
              onSelect={handleTabClick}
              aria-label="Tabs in the default example"
              role="region"
            >
              <Tab eventKey={0} title={<TabTitleText>Signatures</TabTitleText>} aria-label="Default content - users">
                {/** SIGNATURES */}
                <ArtifactResultsSignatures signatures={artifactSignatures} />
              </Tab>
              <Tab eventKey={1} title={<TabTitleText>Attestations</TabTitleText>}>
                Attestations
              </Tab>
            </Tabs>
          </Panel>
        </CardBody>
      </Card>
    </div>
  );
};
