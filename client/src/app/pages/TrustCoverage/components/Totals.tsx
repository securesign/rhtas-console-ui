import type { TrustCoverageResponse } from "@app/client";
import { Card, CardBody, CardTitle, Content, Flex, FlexItem, Grid, GridItem, Label } from "@patternfly/react-core";

type Props = Pick<TrustCoverageResponse, "totalArtifacts" | "attestedCount" | "attestedPercentage">;

export default function Totals({ totalArtifacts, attestedCount, attestedPercentage }: Props) {
  return (
    <Grid hasGutter>
      <GridItem sm={6} lg={4}>
        <Card isFullHeight>
          <CardTitle>Signed Artifacts</CardTitle>
          <CardBody>
            <Content component="h1">{totalArtifacts}</Content>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem sm={6} lg={4}>
        <Card isFullHeight>
          <CardTitle>With Attestations</CardTitle>
          <CardBody>
            <Flex alignItems={{ default: "alignItemsCenter" }} gap={{ default: "gapMd" }}>
              <FlexItem>
                <Content component="h1">{attestedCount}</Content>
              </FlexItem>
              <FlexItem>
                <Label isCompact color="green">
                  {attestedPercentage}% of signed
                </Label>
              </FlexItem>
            </Flex>
          </CardBody>
        </Card>
      </GridItem>

      <GridItem sm={6} lg={4}>
        <Card isFullHeight>
          <CardTitle>Attestation Coverage</CardTitle>
          <CardBody>
            <Flex alignItems={{ default: "alignItemsCenter" }} gap={{ default: "gapMd" }}>
              <FlexItem>
                <Content component="h1">{attestedPercentage}%</Content>
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
  );
}
