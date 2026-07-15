import { useFetchArtifactTrendData } from "@app/queries/trust-coverage";
import {
  Chart,
  ChartAxis,
  ChartGroup,
  ChartLegend,
  ChartLine,
  ChartVoronoiContainer,
} from "@patternfly/react-charts/victory";
import { Card, CardBody, CardTitle } from "@patternfly/react-core";
import { LoadingWrapper } from "@tsd-ui/core";

const formatTimestamp = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
};

export default function CoverageTrend() {
  const { data, isFetching, fetchError } = useFetchArtifactTrendData();

  return (
    <Card isFullHeight>
      <CardTitle>Artifact Trend (Last 30 Days)</CardTitle>
      <CardBody>
        <LoadingWrapper isFetching={isFetching} fetchError={fetchError}>
          {data && (
            <div style={{ height: "280px" }}>
              <Chart
                ariaTitle="Coverage trend over the last 30 days"
                ariaDesc="Line chart showing signing coverage and attestation coverage percentages over the last 30 days"
                containerComponent={
                  <ChartVoronoiContainer labels={({ datum }) => `${datum.y as number}%`} constrainToVisibleArea />
                }
                height={280}
                padding={{ bottom: 75, top: 20 }}
                legendComponent={
                  <ChartLegend
                    orientation="horizontal"
                    data={[{ name: "Signing Coverage" }, { name: "Attestation Coverage" }]}
                  />
                }
                legendPosition="bottom"
              >
                <ChartAxis
                  tickValues={data.map((_, i) => i)}
                  tickFormat={data.map((p) => formatTimestamp(p.timestamp))}
                  style={{
                    tickLabels: { angle: -45, textAnchor: "end", fontSize: 10 },
                  }}
                />
                <ChartAxis dependentAxis tickFormat={(t: number) => `${t}%`} domain={[0, 100]} />
                <ChartGroup>
                  <ChartLine
                    data={data.map((p, i) => ({
                      x: i,
                      y: p.signedPercentage,
                    }))}
                    name="Signed Artifacts"
                  />
                  <ChartLine
                    data={data.map((p, i) => ({
                      x: i,
                      y: p.attestedPercentage,
                    }))}
                    name="With Attestation"
                  />
                </ChartGroup>
              </Chart>
            </div>
          )}
        </LoadingWrapper>
      </CardBody>
    </Card>
  );
}
