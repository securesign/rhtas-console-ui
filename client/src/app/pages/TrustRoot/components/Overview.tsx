import React from "react";

import type { AxiosError } from "axios";
import dayjs from "dayjs";

import { ChartDonut, ChartThemeColor } from "@patternfly/react-charts/victory";
import {
  Card,
  CardBody,
  CardTitle,
  Divider,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  Flex,
  FlexItem,
  List,
  ListItem,
} from "@patternfly/react-core";
import { InfoAltIcon } from "@patternfly/react-icons";

import type { _Error, CertificateInfo } from "@app/client";
import { LoadingWrapper } from "@app/components/LoadingWrapper";
import { formatDate } from "@app/utils/utils";
import { RepositoryNotInitiated } from "./ErrorStates/RepositoryNotInitialized";

interface IOverviewProps {
  certificates: CertificateInfo[];
  isFetching: boolean;
  fetchError: AxiosError<_Error> | null;
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
      {} as Record<string, number>
    );
  }, [certificates]);

  const totalCertificates = React.useMemo(() => {
    return Object.values(chartDonutData).reduce((prev, current) => prev + current, 0);
  }, [chartDonutData]);

  const expiringSoonCertificates = React.useMemo(() => {
    return certificates
      .filter((item) => item.status.toLowerCase() === "expiring")
      .sort((a, b) => dayjs(a.expiration).valueOf() - dayjs(b.expiration).valueOf());
  }, [certificates]);

  if (Array.isArray(certificates) && certificates.length === 0) return <RepositoryNotInitiated rootLink={rootLink} />;

  return (
    <LoadingWrapper isFetching={isFetching} fetchError={fetchError}>
      <Flex direction={{ default: "column", md: "row" }}>
        <FlexItem alignSelf={{ default: "alignSelfStretch" }} flex={{ md: "flex_1" }}>
          <Card isPlain>
            <CardTitle>Certificate health</CardTitle>
            <CardBody>
              <div style={{ height: "230px", width: "350px" }}>
                <ChartDonut
                  constrainToVisibleArea
                  data={Object.entries(chartDonutData).map(([key, value]) => ({ x: key, y: value }))}
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                  labels={({ datum }) => `${datum.x}: ${datum.y}`}
                  legendData={Object.entries(chartDonutData).map(([key, value]) => ({ name: `${key}: ${value}` }))}
                  legendOrientation="vertical"
                  legendPosition="right"
                  name="Certificates"
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
        </FlexItem>
        <Divider orientation={{ md: "vertical" }} inset={{ default: "inset3xl" }} />
        <FlexItem alignSelf={{ default: "alignSelfStretch" }} flex={{ md: "flex_1" }}>
          <Card isPlain>
            <CardTitle>Expiring soon</CardTitle>
            <CardBody>
              {expiringSoonCertificates.length > 0 ? (
                <List>
                  {expiringSoonCertificates.map((item) => (
                    <ListItem key={`${item.type}-${item.issuer}-${item.subject}-${item.target}`}>
                      <Flex
                        spaceItems={{ default: "spaceItemsSm" }}
                        alignItems={{ default: "alignItemsCenter" }}
                        flexWrap={{ default: "nowrap" }}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        <FlexItem>{item.issuer}</FlexItem>
                        <Divider orientation={{ default: "vertical" }} />
                        <FlexItem>{formatDate(item.expiration)}</FlexItem>
                      </Flex>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <EmptyState variant={EmptyStateVariant.xs} icon={InfoAltIcon}>
                  <EmptyStateBody>There are no certificates expiring soon.</EmptyStateBody>
                </EmptyState>
              )}
            </CardBody>
          </Card>
        </FlexItem>
      </Flex>
    </LoadingWrapper>
  );
};
