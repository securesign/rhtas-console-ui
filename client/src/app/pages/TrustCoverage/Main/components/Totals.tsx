import type { CoveragePercentages, CoverageTotals } from "@app/client";
import { Paths } from "@app/Routes";
import { Card, CardBody, CardTitle, Content, Flex, FlexItem, Grid, GridItem, Label } from "@patternfly/react-core";
import { Link } from "react-router-dom";

interface Props {
  totals: CoverageTotals;
  percentages: CoveragePercentages;
}

export default function Totals({ totals, percentages }: Props) {
  return (
    <Grid hasGutter>
      <GridItem sm={6} lg={3}>
        <Card isFullHeight>
          <CardTitle>Total Artifacts</CardTitle>
          <CardBody>
            <Content component="h1">
              <Link to={Paths.allArtifacts}>{totals.totalArtifacts}</Link>
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
                <Content component="h1">{percentages.signedPercentage}%</Content>
              </FlexItem>
              <FlexItem>
                <Label isCompact color="orange">
                  {totals.signedArtifacts} / {totals.totalArtifacts}
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
                <Content component="h1">{totals.totalArtifacts - totals.signedArtifacts}</Content>
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
                <Content component="h1">{percentages.attestedPercentage}%</Content>
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
