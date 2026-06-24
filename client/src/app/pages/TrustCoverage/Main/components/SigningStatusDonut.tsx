import { ChartDonut, ChartThemeColor } from "@patternfly/react-charts/victory";
import { Card, CardBody, CardTitle } from "@patternfly/react-core";

interface Props {
  title: string;
  donutData: {
    x: string;
    y: number;
  }[];
}

export default function SigningStatusDonut({ title, donutData }: Props) {
  return (
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
            title={title}
            themeColor={ChartThemeColor.multiOrdered}
            width={450}
            height={280}
          />
        </div>
      </CardBody>
    </Card>
  );
}
