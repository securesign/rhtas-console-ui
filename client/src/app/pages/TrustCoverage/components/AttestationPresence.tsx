import { Chart, ChartAxis, ChartBar, ChartTooltip } from "@patternfly/react-charts/victory";
import { Card, CardBody, CardTitle } from "@patternfly/react-core";

import { useFetchAttestationPresence } from "@app/queries/trust-coverage";

type Props = {
  environment?: string;
};

export default function AttestationPresence({ environment }: Props) {
  const { data } = useFetchAttestationPresence(environment);

  const chartData = (data ?? []).map((item) => ({ x: item.type, y: item.percentage }));

  return (
    <Card isFullHeight>
      <CardTitle>Attestation Presence by Type</CardTitle>
      <CardBody>
        <div style={{ height: "280px" }}>
          <Chart
            ariaTitle="Attestation presence by type"
            ariaDesc="Horizontal bar chart showing attestation presence percentages by type"
            height={280}
            horizontal
            padding={{ bottom: 50, top: 20 }}
            domainPadding={{ x: 25 }}
          >
            <ChartAxis style={{ tickLabels: { fontSize: 12 } }} />
            <ChartAxis
              dependentAxis
              tickFormat={(t: number) => `${t}%`}
              tickValues={[20, 40, 60, 80, 100]}
              domain={[0, 100]}
            />
            <ChartBar
              data={chartData}
              labelComponent={<ChartTooltip constrainToVisibleArea />}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              labels={({ datum }) => `${datum.y as number}%`}
            />
          </Chart>
        </div>
      </CardBody>
    </Card>
  );
}
