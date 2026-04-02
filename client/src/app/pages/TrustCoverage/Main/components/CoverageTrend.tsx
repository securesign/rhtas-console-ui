import type { TrendDataPoint } from "@app/client";
import {
  Chart,
  ChartAxis,
  ChartGroup,
  ChartLegend,
  ChartLine,
  ChartVoronoiContainer,
} from "@patternfly/react-charts/victory";
import { Card, CardBody, CardTitle } from "@patternfly/react-core";

const formatTimestamp = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
};

type Props = {
  trendData: Array<TrendDataPoint>;
};

export default function CoverageTrend({ trendData }: Props) {
  return (
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
              tickValues={trendData.map((_, i) => i)}
              tickFormat={trendData.map((p) => formatTimestamp(p.timestamp))}
              style={{
                tickLabels: { angle: -45, textAnchor: "end", fontSize: 10 },
              }}
            />
            <ChartAxis dependentAxis tickFormat={(t: number) => `${t}%`} domain={[0, 100]} />
            <ChartGroup>
              <ChartLine
                data={trendData.map((p, i) => ({
                  x: i,
                  y: p.signedPercentage,
                }))}
                name="Signing Coverage"
              />
              <ChartLine
                data={trendData.map((p, i) => ({
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
  );
}
