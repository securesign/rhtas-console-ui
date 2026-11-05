import { Card, CardBody, CardTitle, Content, Divider, Flex, FlexItem, CardHeader } from "@patternfly/react-core";
import { StatusDot } from "./StatusDot";

interface ErrorBreakdown {
  label: string;
  count: number;
  severity?: "danger";
}

const breakdowns: ErrorBreakdown[] = [
  { label: "5xx server errors", count: 1512 },
  { label: "Timeouts", count: 488 },
  { label: "Signature verify failures", count: 183, severity: "danger" },
  { label: "4xx client errors", count: 1 },
];

export const ErrorRateCard: React.FC = () => (
  <Card isFullHeight>
    <CardHeader>
      <CardTitle>Error rate · last 1h (mock data)</CardTitle>
    </CardHeader>
    <CardBody>
      <Flex>
        <FlexItem flex={{ default: "flex_1" }}>
          <Content component="small" style={{ color: "var(--pf-t--global--text--color--subtle)" }}>
            Total errors
          </Content>
          <Content component="p" style={{ fontSize: "var(--pf-t--global--font--size--heading--h2)" }}>
            <strong>2,184</strong>
          </Content>
        </FlexItem>
        <FlexItem flex={{ default: "flex_1" }}>
          <Content component="small" style={{ color: "var(--pf-t--global--text--color--subtle)" }}>
            Error rate
          </Content>
          <Content
            component="p"
            style={{
              fontSize: "var(--pf-t--global--font--size--heading--h2)",
              color: "var(--pf-t--global--color--status--danger--default)",
            }}
          >
            <strong>42.7%</strong>
          </Content>
        </FlexItem>
      </Flex>
      <Divider style={{ marginBlock: "var(--pf-t--global--spacer--md)" }} />
      <Flex direction={{ default: "column" }} spaceItems={{ default: "spaceItemsSm" }}>
        {breakdowns.map((item) => (
          <FlexItem key={item.label}>
            <Flex
              justifyContent={{ default: "justifyContentSpaceBetween" }}
              alignItems={{ default: "alignItemsCenter" }}
            >
              <FlexItem>
                <Flex alignItems={{ default: "alignItemsCenter" }} spaceItems={{ default: "spaceItemsSm" }}>
                  {item.severity && (
                    <FlexItem>
                      <StatusDot severity="danger" size={8} />
                    </FlexItem>
                  )}
                  <FlexItem>{item.label}</FlexItem>
                </Flex>
              </FlexItem>
              <FlexItem>
                <Content
                  component="p"
                  style={item.severity ? { color: "var(--pf-t--global--color--status--danger--default)" } : undefined}
                >
                  {item.count.toLocaleString()}
                </Content>
              </FlexItem>
            </Flex>
          </FlexItem>
        ))}
      </Flex>
    </CardBody>
  </Card>
);
