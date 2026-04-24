import React, { useState } from "react";

import { Content, Divider, Flex, FlexItem, Grid, GridItem, PageSection } from "@patternfly/react-core";

import { DocumentMetadata } from "@app/components/DocumentMetadata";
import { LoadingWrapper } from "@app/components/LoadingWrapper";
import { useFetchTrustCoverageSummary } from "@app/queries/trust-coverage";
import EnvironmentSelect from "../shared/components/EnvironmentSelect";
import Totals from "./components/Totals";
import SigningStatusDonut from "./components/SigningStatusDonut";
import CoverageTrend from "./components/CoverageTrend";
import AttestationPresence from "./components/AttestationPresence";
import UnsignedArtifactsTable from "./components/UnsignedArtifactsTable";

export const TrustCoverage: React.FC = () => {
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>("all");
  const { data, isFetching, fetchError } = useFetchTrustCoverageSummary(
    selectedEnvironment === "all" ? undefined : selectedEnvironment
  );

  const unsignedArtifacts = data ? data.totals.totalArtifacts - data.totals.signedArtifacts : 0;
  const donutData = data
    ? [
        { x: "Signed", y: data.totals.signedArtifacts },
        { x: "Unsigned", y: unsignedArtifacts },
      ]
    : [];
  const environments: string[] = data
    ? data.environmentBreakdown.map((item) => item.environment)
    : [...(selectedEnvironment === "all" ? [] : [selectedEnvironment])];

  return (
    <>
      <DocumentMetadata title="Trust Coverage" />
      <PageSection variant="default">
        <EnvironmentSelect
          selectedEnvironment={selectedEnvironment}
          setSelectedEnvironment={setSelectedEnvironment}
          environments={environments}
        />
      </PageSection>
      <Divider />
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
                <Totals totals={data.totals} percentages={data.percentages} />
              </FlexItem>
              <FlexItem>
                <Grid hasGutter>
                  <GridItem md={5}>
                    <SigningStatusDonut title={data.totals.totalArtifacts.toString()} donutData={donutData} />
                  </GridItem>
                  <GridItem md={7}>
                    <CoverageTrend trendData={data.trendData} />
                  </GridItem>
                </Grid>
              </FlexItem>
              <FlexItem>
                <AttestationPresence environment={selectedEnvironment === "all" ? undefined : selectedEnvironment} />
              </FlexItem>
              <FlexItem>
                <UnsignedArtifactsTable environments={environments} />
              </FlexItem>
            </Flex>
          )}
        </LoadingWrapper>
      </PageSection>
    </>
  );
};
