import { Fragment, useState } from "react";
import type { PrismTheme } from "types/prism-theme";
import type { ImageMetadataResponse } from "@app/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  Card,
  CardBody,
  Divider,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Panel,
} from "@patternfly/react-core";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism";
import { atomDark as darkTheme } from "react-syntax-highlighter/dist/esm/styles/prism";

export interface IArtifactResults {
  artifact: ImageMetadataResponse;
}

export const ArtifactResults = ({ artifact }: IArtifactResults) => {
  type PanelId = "metadata-content";
  const [expanded, setExpanded] = useState<PanelId[]>([]);

  const toggle = (id: PanelId) => {
    const index = expanded.indexOf(id);
    const newExpanded: PanelId[] =
      index >= 0 ? [...expanded.slice(0, index), ...expanded.slice(index + 1, expanded.length)] : [...expanded, id];
    setExpanded(newExpanded);
  };

  return (
    <div style={{ margin: "2em auto" }}>
      <p>Showing 1 of 1</p>
      <Card style={{ margin: "1.5em auto 2em", overflowY: "hidden" }}>
        <CardBody>
          <h2 style={{ margin: "1.25em auto", overflow: "hidden", textOverflow: "ellipsis" }}>
            <b>Artifact:</b> {artifact.image}
          </h2>
          <Divider />
          <Panel style={{ marginTop: "1.25em" }}>
            <h5 style={{ margin: "1em auto" }}>Digest</h5>
            <SyntaxHighlighter language="text" style={darkTheme as unknown as PrismTheme}>
              {artifact.digest}
            </SyntaxHighlighter>
          </Panel>
          <Panel style={{ margin: "0.75em auto" }}>
            <Fragment>
              <Accordion>
                <>
                  <AccordionItem isExpanded={expanded.includes("metadata-content")}>
                    <AccordionToggle
                      id={"metadata-header"}
                      onClick={() => {
                        toggle("metadata-content");
                      }}
                    >
                      <b>Metadata</b>
                    </AccordionToggle>
                    <AccordionContent>
                      <Grid hasGutter={true}>
                        <GridItem sm={3}>
                          <Flex style={{ padding: "1em" }}>
                            <Divider orientation={{ default: "vertical" }} style={{ margin: "inherit 1em" }} />
                            <FlexItem>
                              <h3>Media Type</h3>
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
                        <GridItem sm={3}>
                          <Flex style={{ padding: "1em" }}>
                            <Divider orientation={{ default: "vertical" }} style={{ margin: "inherit 1em" }} />
                            <FlexItem>
                              <h3>Size</h3>
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
                        <GridItem sm={3}>
                          <Flex style={{ padding: "1em" }}>
                            <Divider orientation={{ default: "vertical" }} style={{ margin: "inherit 1em" }} />
                            <FlexItem>
                              <h3>Created</h3>
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
                        <GridItem sm={3}>
                          <Flex style={{ padding: "1em" }}>
                            <Divider orientation={{ default: "vertical" }} style={{ margin: "inherit 1em" }} />
                            <FlexItem>
                              <h3>Labels</h3>
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
                    </AccordionContent>
                  </AccordionItem>
                </>
              </Accordion>
            </Fragment>
          </Panel>
        </CardBody>
      </Card>
    </div>
  );
};
