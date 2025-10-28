import type { PrismTheme } from "types/prism-theme";
import type { ImageMetadataResponse } from "@app/client";
import { Card, CardBody, Divider, Flex, FlexItem, Grid, GridItem, Panel } from "@patternfly/react-core";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism";
import { atomDark as darkTheme } from "react-syntax-highlighter/dist/esm/styles/prism";

export interface IArtifactResults {
  artifact: ImageMetadataResponse;
}

export const ArtifactResults = ({ artifact }: IArtifactResults) => {
  return (
    <div style={{ margin: "2em auto" }}>
      <p>Showing 1 of 1</p>
      <Card style={{ margin: "1.5em auto 2em", overflowY: "hidden" }}>
        <CardBody>
          <h2 style={{ margin: "1.25em auto", overflow: "hidden", textOverflow: "ellipsis" }}>
            <b>Artifact:</b> {artifact.image}
          </h2>
          <Divider />
          <Grid hasGutter={true}>
            <GridItem sm={3}>
              <Flex style={{ padding: "1em" }}>
                <Divider orientation={{ default: "vertical" }} style={{ margin: "inherit 1em" }} />
                <FlexItem>
                  <h3>{artifact.digest}</h3>
                  <p
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "start",
                    }}
                  >
                    Image: {artifact.image}
                  </p>
                </FlexItem>
              </Flex>
            </GridItem>
          </Grid>
          <Divider />
          <Panel style={{ marginTop: "1.25em" }}>
            <h5 style={{ margin: "1em auto" }}>Digest</h5>
            <SyntaxHighlighter language="text" style={darkTheme as unknown as PrismTheme}>
              {artifact.digest}
            </SyntaxHighlighter>
          </Panel>
        </CardBody>
      </Card>
    </div>
  );
};
