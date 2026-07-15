import React from "react";

import { Content, Flex, FlexItem, Grid, GridItem, PageSection } from "@patternfly/react-core";

import { DocumentMetadata } from "@app/components/DocumentMetadata";
import { LoadingWrapper } from "@tsd-ui/core";
import { useFetchTrustCoverageSummary } from "@app/queries/trust-coverage";
import Totals from "./components/Totals";
import SigningStatusDonut from "./components/SigningStatusDonut";
import CoverageTrend from "./components/CoverageTrend";
import AttestationPresence from "./components/AttestationPresence";
import UnsignedArtifactsTable from "./components/UnsignedArtifactsTable";

export const TrustCoverage: React.FC = () => {
  const { data, isFetching, fetchError } = useFetchTrustCoverageSummary();

  const unsignedArtifacts = data ? data.totalArtifacts - data.attestedCount : 0;
  const donutData = data
    ? [
        { x: "With attestation", y: data.attestedCount },
        { x: "Without attestation", y: unsignedArtifacts },
      ]
    : [];

  return (
    <>
      <DocumentMetadata title="Trust Coverage" />
      <PageSection variant="default">
        <Content>
          <Content component="h1">Trust Coverage</Content>
          <Content component="p">Fleet-level visibility into artifact signing coverage and attestation status.</Content>
        </Content>
      </PageSection>
      <PageSection>
        <LoadingWrapper isFetching={isFetching} fetchError={fetchError}>
          {data && (
            <Flex direction={{ default: "column" }} gap={{ default: "gapLg" }}>
              <FlexItem>
                <Totals
                  totalArtifacts={data.totalArtifacts}
                  attestedCount={data.attestedCount}
                  attestedPercentage={data.attestedPercentage}
                />
              </FlexItem>
              <FlexItem>
                <Grid hasGutter>
                  <GridItem md={4}>
                    <SigningStatusDonut title={data.totalArtifacts.toString()} donutData={donutData} />
                  </GridItem>
                  <GridItem md={8}>
                    <CoverageTrend />
                  </GridItem>
                </Grid>
              </FlexItem>
              <FlexItem>
                <AttestationPresence />
              </FlexItem>
              <FlexItem>
                <UnsignedArtifactsTable />
              </FlexItem>
            </Flex>
          )}
        </LoadingWrapper>
      </PageSection>
    </>
  );
};
