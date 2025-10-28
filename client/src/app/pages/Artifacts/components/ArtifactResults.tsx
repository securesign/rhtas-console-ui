import type { ImageMetadataResponse } from "@app/client";
import { Card, CardBody, Divider, Flex, FlexItem, Grid, GridItem } from "@patternfly/react-core";

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
            Artifact Digest: {artifact.digest}
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
        </CardBody>
      </Card>
    </div>
  );
};
