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
} from "@patternfly/react-core";
import { ArtifactResultsSummary } from "./ArtifactResultsSummary";
import { ArtifactResultsSignatures } from "./ArtifactResultsSignatures";

export interface IArtifactResultsProps {
  artifact: ImageMetadataResponse;
}

export const ArtifactResults = ({ artifact }: IArtifactResultsProps) => {
  // temporary workaround until API merged
  const artifactSignatures: string[] = [];

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
            {/** SIGNATURES */}
            <ArtifactResultsSignatures signatures={artifactSignatures} />
          </Panel>
        </CardBody>
      </Card>
    </div>
  );
};
