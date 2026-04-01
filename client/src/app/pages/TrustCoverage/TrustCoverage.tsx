import React, { Fragment } from "react";

import {
  Chart,
  ChartAxis,
  ChartDonut,
  ChartGroup,
  ChartLegend,
  ChartLine,
  ChartThemeColor,
  ChartVoronoiContainer,
} from "@patternfly/react-charts/victory";
import {
  Card,
  CardBody,
  CardTitle,
  Content,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Label,
  PageSection,
} from "@patternfly/react-core";

import { DocumentMetadata } from "@app/components/DocumentMetadata";
import { LoadingWrapper } from "@app/components/LoadingWrapper";
import { useFetchTrustCoverageSummary } from "@app/queries/trust-coverage";

export const TrustCoverage: React.FC = () => {
  const { data, isFetching, fetchError } = useFetchTrustCoverageSummary();

  const formatTimestamp = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
  };
  const unsignedArtifacts = data ? data.totals.totalArtifacts - data.totals.signedArtifacts : 0;
  const donutData = data
    ? [
        { x: "Signed", y: data.totals.signedArtifacts },
        { x: "Unsigned", y: unsignedArtifacts },
      ]
    : [];

  return (
    <Fragment>
      <DocumentMetadata title="Trust Coverage" />
      <PageSection variant="default">
        <Content>
          <h1>Trust Coverage</h1>
          <p>Fleet-level visibility into artifact signing coverage and attestation status.</p>
        </Content>
      </PageSection>
      <PageSection>
        <LoadingWrapper isFetching={isFetching} fetchError={fetchError}>
          {data && (
            <Flex direction={{ default: "column" }} gap={{ default: "gapLg" }}>
              <FlexItem>
                <Grid hasGutter>
                  <GridItem sm={6} lg={3}>
                    <Card isFullHeight>
                      <CardTitle>Total Artifacts</CardTitle>
                      <CardBody>
                        <Content component="p">
                          <strong>{data.totals.totalArtifacts}</strong>
                        </Content>
                      </CardBody>
                    </Card>
                  </GridItem>
                  <GridItem sm={6} lg={3}>
                    <Card isFullHeight>
                      <CardTitle>Signed</CardTitle>
                      <CardBody>
                        <Flex alignItems={{ default: "alignItemsCenter" }} gap={{ default: "gapMd" }}>
                          <FlexItem>
                            <Content component="p">
                              <strong>{data.percentages.signedPercentage}%</strong>
                            </Content>
                          </FlexItem>
                          <FlexItem>
                            <Label isCompact color="orange">
                              {data.totals.signedArtifacts} / {data.totals.totalArtifacts}
                            </Label>
                          </FlexItem>
                        </Flex>
                      </CardBody>
                    </Card>
                  </GridItem>
                  <GridItem sm={6} lg={3}>
                    <Card isFullHeight>
                      <CardTitle>Unsigned in Production</CardTitle>
                      <CardBody>
                        <Flex alignItems={{ default: "alignItemsCenter" }} gap={{ default: "gapMd" }}>
                          <FlexItem>
                            <Content component="p">
                              <strong>{data.totals.totalArtifacts - data.totals.signedArtifacts}</strong>
                            </Content>
                          </FlexItem>
                          <FlexItem>
                            <Label isCompact color="red">
                              Action needed
                            </Label>
                          </FlexItem>
                        </Flex>
                      </CardBody>
                    </Card>
                  </GridItem>
                  <GridItem sm={6} lg={3}>
                    <Card isFullHeight>
                      <CardTitle>Attestation Coverage</CardTitle>
                      <CardBody>
                        <Flex alignItems={{ default: "alignItemsCenter" }} gap={{ default: "gapMd" }}>
                          <FlexItem>
                            <Content component="p">
                              <strong>{data.percentages.attestedPercentage}%</strong>
                            </Content>
                          </FlexItem>
                          <FlexItem>
                            <Label isCompact color="green">
                              Good
                            </Label>
                          </FlexItem>
                        </Flex>
                      </CardBody>
                    </Card>
                  </GridItem>
                </Grid>
              </FlexItem>
              <FlexItem>
                <Grid hasGutter>
                  <GridItem md={5}>
                    <Card isFullHeight>
                      <CardTitle>Signing Status Distribution</CardTitle>
                      <CardBody>
                        <div style={{ height: "280px", width: "100%", maxWidth: "450px" }}>
                          <ChartDonut
                            constrainToVisibleArea
                            data={donutData}
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                            labels={({ datum }) => `${datum.x as string}: ${datum.y as number}`}
                            legendData={donutData.map((d) => ({
                              name: `${d.x}: ${d.y}`,
                            }))}
                            legendOrientation="vertical"
                            legendPosition="right"
                            name="SigningStatus"
                            ariaTitle="Signing status distribution donut chart"
                            padding={{
                              bottom: 20,
                              left: 20,
                              right: 160,
                              top: 20,
                            }}
                            subTitle="Artifacts"
                            title={data.totals.totalArtifacts.toString()}
                            themeColor={ChartThemeColor.multiOrdered}
                            width={450}
                            height={280}
                          />
                        </div>
                      </CardBody>
                    </Card>
                  </GridItem>
                  <GridItem md={7}>
                    <Card isFullHeight>
                      <CardTitle>Coverage Trend (Last 30 Days)</CardTitle>
                      <CardBody>
                        <div style={{ height: "280px" }}>
                          <Chart
                            ariaTitle="Coverage trend over the last 30 days"
                            ariaDesc="Line chart showing signing coverage and attestation coverage percentages over the last 30 days"
                            containerComponent={
                              <ChartVoronoiContainer
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                                labels={({ datum }) => `${datum.y as number}%`}
                                constrainToVisibleArea
                              />
                            }
                            height={280}
                            padding={{ bottom: 75, left: 50, right: 30, top: 20 }}
                            legendComponent={
                              <ChartLegend
                                orientation="horizontal"
                                data={[{ name: "Signing Coverage" }, { name: "Attestation Coverage" }]}
                              />
                            }
                            legendPosition="bottom"
                          >
                            <ChartAxis
                              tickValues={data.trendData.map((_, i) => i)}
                              tickFormat={data.trendData.map((p) => formatTimestamp(p.timestamp))}
                              style={{
                                tickLabels: { angle: -45, textAnchor: "end", fontSize: 10 },
                              }}
                            />
                            <ChartAxis dependentAxis tickFormat={(t: number) => `${t}%`} domain={[0, 100]} />
                            <ChartGroup>
                              <ChartLine
                                data={data.trendData.map((p, i) => ({
                                  x: i,
                                  y: p.signedPercentage,
                                }))}
                                name="Signing Coverage"
                              />
                              <ChartLine
                                data={data.trendData.map((p, i) => ({
                                  x: i,
                                  y: p.attestedPercentage,
                                }))}
                                name="Attestation Coverage"
                              />
                            </ChartGroup>
                          </Chart>
                        </div>
                      </CardBody>
                    </Card>
                  </GridItem>
                </Grid>
              </FlexItem>
            </Flex>
          )}
        </LoadingWrapper>
      </PageSection>
    </Fragment>
  );
};
