import { Card, CardBody, CardHeader, CardTitle, Content, Flex, FlexItem } from "@patternfly/react-core";
import { StatusDot } from "./StatusDot";
import type { Severity } from "../utils";

interface Incident {
  title: string;
  timeAgo: string;
  utcTime: string;
  severity: Severity;
}

const incidents: Incident[] = [
  {
    title: "TUF root metadata expired",
    timeAgo: "14h 3m ago",
    utcTime: "02:14 UTC",
    severity: "danger",
  },
  {
    title: "Fulcio probes started failing",
    timeAgo: "38m ago",
    utcTime: "15:39 UTC",
    severity: "danger",
  },
  {
    title: "Rekor latency exceeded threshold",
    timeAgo: "22m ago",
    utcTime: "15:55 UTC",
    severity: "warning",
  },
  {
    title: "On-call paged via PagerDuty",
    timeAgo: "19m ago",
    utcTime: "15:58 UTC",
    severity: "info",
  },
];

export const IncidentTimeline: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Incident timeline (mock data)</CardTitle>
    </CardHeader>
    <CardBody>
      <Flex direction={{ default: "column" }} spaceItems={{ default: "spaceItemsNone" }}>
        {incidents.map((incident, index) => (
          <FlexItem key={index}>
            <Flex alignItems={{ default: "alignItemsFlexStart" }} spaceItems={{ default: "spaceItemsMd" }}>
              <FlexItem>
                <Flex
                  direction={{ default: "column" }}
                  alignItems={{ default: "alignItemsCenter" }}
                  spaceItems={{ default: "spaceItemsNone" }}
                >
                  <FlexItem style={{ paddingTop: "var(--pf-t--global--spacer--xs)" }}>
                    <StatusDot severity={incident.severity} />
                  </FlexItem>
                  {index < incidents.length - 1 && (
                    <FlexItem>
                      <div
                        style={{
                          width: 2,
                          height: 32,
                          backgroundColor: "var(--pf-t--global--border--color--default)",
                        }}
                      />
                    </FlexItem>
                  )}
                </Flex>
              </FlexItem>
              <FlexItem>
                <Content component="p">
                  <strong>{incident.title}</strong>
                </Content>
                <Content component="small" style={{ color: "var(--pf-t--global--text--color--subtle)" }}>
                  {incident.timeAgo} · {incident.utcTime}
                </Content>
              </FlexItem>
            </Flex>
          </FlexItem>
        ))}
      </Flex>
    </CardBody>
  </Card>
);
