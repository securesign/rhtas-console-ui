import React from "react";

import type { AxiosError } from "axios";

import { ChartDonut, ChartThemeColor } from "@patternfly/react-charts/victory";
import { Card, CardBody, CardTitle } from "@patternfly/react-core";

import type { Error as ApiError, CertificateInfo } from "@app/client";
import { RepositoryNotInitiated } from "./ErrorStates/RepositoryNotInitialized";
import { LoadingWrapper } from "@tsd-ui/core";

interface IOverviewProps {
  certificates: CertificateInfo[];
  isFetching: boolean;
  fetchError: AxiosError<ApiError> | null;
  rootLink?: string;
}

export const Overview: React.FC<IOverviewProps> = ({ certificates, isFetching, fetchError, rootLink }) => {
  const chartDonutData = React.useMemo(() => {
    return certificates.reduce(
      (prev, current) => {
        return {
          ...prev,
          [current.status]: (prev[current.status] ?? 0) + 1,
        };
      },
      {} as Record<string, number>,
    );
  }, [certificates]);

  const totalCertificates = React.useMemo(() => {
    return Object.values(chartDonutData).reduce((prev, current) => prev + current, 0);
  }, [chartDonutData]);

  if (Array.isArray(certificates) && certificates.length === 0) return <RepositoryNotInitiated rootLink={rootLink} />;

  return (
    <LoadingWrapper isFetching={isFetching} fetchError={fetchError}>
      <Card isPlain>
        <CardTitle>Certificate health</CardTitle>
        <CardBody>
          <div style={{ height: "230px", width: "350px" }}>
            <ChartDonut
              constrainToVisibleArea
              data={Object.entries(chartDonutData).map(([key, value]) => ({ x: key, y: value }))}

              labels={({ datum }) => `${datum.x}: ${datum.y}`}
              legendData={Object.entries(chartDonutData).map(([key, value]) => ({ name: `${key}: ${value}` }))}
              legendOrientation="vertical"
              legendPosition="right"
              name="Certificates"
              ariaTitle="Certificates donut chart"
              padding={{
                bottom: 20,
                left: 20,
                right: 140, // Adjusted to accommodate legend
                top: 20,
              }}
              subTitle="Certificates"
              title={totalCertificates.toString()}
              themeColor={ChartThemeColor.multiOrdered}
              width={350}
            />
          </div>
        </CardBody>
      </Card>
    </LoadingWrapper>
  );
};
