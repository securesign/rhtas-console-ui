import { DocumentMetadata } from "@app/components/DocumentMetadata";
import { Button, Content, Flex, FlexItem, Grid, GridItem, PageSection } from "@patternfly/react-core";
import { SyncAltIcon } from "@patternfly/react-icons";
import { ErrorRateCard } from "./components/ErrorRateCard";
import { ExpiringTrustAssets } from "./components/ExpiringTrustAssets";
import { IncidentTimeline } from "./components/IncidentTimeline";
import { PipelineStatusBanner } from "./components/PipelineStatusBanner";
import { ServiceStatusCard } from "./components/ServiceStatusCard";
import { StatusDot } from "./components/StatusDot";
import { getOverallStatus, overallStatusToSeverity, type ServiceStatus } from "./utils";
import { useFetchSystemHealth } from "@app/queries/system-health";
import { LoadingWrapper } from "@app/components/LoadingWrapper";
import { formatDate } from "@app/utils/utils";

interface ServiceInfo {
  name: string;
  status: ServiceStatus;
  detail: string;
}

export const SystemHealth: React.FC = () => {
  const { data, isFetching, fetchError, refetch } = useFetchSystemHealth();

  const services: ServiceInfo[] = [
    {
      name: "Fulcio",
      status: data?.securesignStatus ?? "unknown",
      detail: "No response · 47 attempts (mock data)",
    },
    { name: "Rekor", status: data?.rekorStatus ?? "unknown", detail: "p95 5.8s · 8.2% errors (mock data)" },
    { name: "TUF", status: data?.tufStatus ?? "unknown", detail: "Root metadata expired (mock data)" },
  ];

  return (
    <>
      <DocumentMetadata title="System Health" />
      <PageSection>
        <Flex justifyContent={{ default: "justifyContentSpaceBetween" }} alignItems={{ default: "alignItemsCenter" }}>
          <FlexItem>
            <Content>
              <Content component="h1">System Health</Content>
              <Content component="p">
                Monitor service health, track expiring trust assets, and investigate signing failures from one place
              </Content>
            </Content>
          </FlexItem>
          <LoadingWrapper isFetching={isFetching} fetchError={fetchError}>
            {data && (
              <FlexItem>
                <Flex alignItems={{ default: "alignItemsCenter" }} spaceItems={{ default: "spaceItemsMd" }}>
                  <FlexItem>
                    <Flex alignItems={{ default: "alignItemsCenter" }} spaceItems={{ default: "spaceItemsXs" }}>
                      <FlexItem>
                        <StatusDot
                          severity={overallStatusToSeverity(
                            getOverallStatus([data.securesignStatus, data.rekorStatus, data.tufStatus]),
                          )}
                        />
                      </FlexItem>
                      <FlexItem>
                        <Content component="small">
                          {getOverallStatus([data.securesignStatus, data.rekorStatus, data.tufStatus])}
                        </Content>
                      </FlexItem>
                    </Flex>
                  </FlexItem>
                  <FlexItem>
                    <Content component="small" style={{ color: "var(--pf-t--global--text--color--subtle)" }}>
                      Last checked {formatDate(data.updatedAt)}
                    </Content>
                  </FlexItem>
                  <FlexItem>
                    <Button variant="secondary" icon={<SyncAltIcon />} onClick={() => void refetch()}>
                      Refresh
                    </Button>
                  </FlexItem>
                </Flex>
              </FlexItem>
            )}
          </LoadingWrapper>
        </Flex>
      </PageSection>
      <LoadingWrapper fetchError={fetchError} isFetching={isFetching}>
        <PageSection>
          <Flex direction={{ default: "column" }} spaceItems={{ default: "spaceItemsMd" }}>
            <FlexItem>
              <PipelineStatusBanner />
            </FlexItem>

            <FlexItem>
              <Grid hasGutter>
                {services.map((svc) => (
                  <GridItem key={svc.name} span={4}>
                    <ServiceStatusCard name={svc.name} status={svc.status} detail={svc.detail} />
                  </GridItem>
                ))}
              </Grid>
            </FlexItem>

            <FlexItem>
              <Grid hasGutter>
                <GridItem span={6}>
                  <ExpiringTrustAssets />
                </GridItem>
                <GridItem span={6}>
                  <ErrorRateCard />
                </GridItem>
              </Grid>
            </FlexItem>

            <FlexItem>
              <IncidentTimeline />
            </FlexItem>
          </Flex>
        </PageSection>
      </LoadingWrapper>
    </>
  );
};
