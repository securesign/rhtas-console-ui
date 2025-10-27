import { Fragment } from "react";
import type { PrismTheme } from "types/prism-theme";
import type { ImageMetadataResponse } from "@app/client";
import {
  Card,
  CardBody,
  Content,
  ContentVariants,
  Divider,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Panel,
} from "@patternfly/react-core";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism";
import { atomDark as darkTheme } from "react-syntax-highlighter/dist/esm/styles/prism";

export interface IArtifactResultsProps {
  artifact: ImageMetadataResponse;
}

export const ArtifactResults = ({ artifact }: IArtifactResultsProps) => {
  return (
    <div style={{ margin: "2em auto" }}>
      <p>Showing 1 of 1</p>
      <Card style={{ margin: "1.5em auto 2em", overflowY: "hidden" }}>
        <CardBody>
          <Content
            component={ContentVariants.h4}
            style={{ margin: "1.25em auto", overflow: "hidden", textOverflow: "ellipsis" }}
          >
            Artifact: {artifact.image}
          </Content>
          <Divider />
          <Panel style={{ marginTop: "1.25em" }}>
            <Content component={ContentVariants.h6} style={{ margin: "1em auto" }}>
              Digest
            </Content>
            <SyntaxHighlighter language="text" style={darkTheme as unknown as PrismTheme}>
              {artifact.digest}
            </SyntaxHighlighter>
          </Panel>
          <Panel style={{ margin: "0.75em auto" }}>
            <Fragment>
              <Grid>
                <GridItem span={4}>
                  <Flex style={{ padding: "1em" }}>
                    <FlexItem>
                      <Content component={ContentVariants.h6}>Media Type</Content>
                      <p
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "start",
                        }}
                      >
                        {artifact.metadata.mediaType}
                      </p>
                    </FlexItem>
                  </Flex>
                </GridItem>
                <GridItem span={2}>
                  <Flex style={{ padding: "1em" }}>
                    <FlexItem>
                      <Content component={ContentVariants.h6}>Size</Content>
                      <p
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "start",
                        }}
                      >
                        {artifact.metadata.size}
                      </p>
                    </FlexItem>
                  </Flex>
                </GridItem>
                <GridItem span={3}>
                  <Flex style={{ padding: "1em" }}>
                    <FlexItem>
                      <Content component={ContentVariants.h6}>Created</Content>
                      <p
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "start",
                        }}
                      >
                        {artifact.metadata.created}
                      </p>
                    </FlexItem>
                  </Flex>
                </GridItem>
                <GridItem span={3}>
                  <Flex style={{ padding: "1em" }}>
                    <Divider orientation={{ default: "vertical" }} style={{ margin: "auto 1em" }} />
                    <FlexItem>
                      <Content component={ContentVariants.h6}>Labels</Content>
                      <p
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "start",
                        }}
                      >
                        {artifact.metadata.labels?.maintainer}
                      </p>
                    </FlexItem>
                  </Flex>
                </GridItem>
              </Grid>
            </Fragment>
          </Panel>
        </CardBody>
      </Card>
    </div>
  );
};
