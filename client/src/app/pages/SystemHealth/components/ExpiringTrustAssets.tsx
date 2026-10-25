import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Content,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  Label,
} from "@patternfly/react-core";
import { ArrowRightIcon } from "@patternfly/react-icons";
import type { Severity } from "../utils";

interface TrustAsset {
  name: string;
  expiryLabel: string;
  timeRemaining: string;
  severity: Severity;
}

const assets: TrustAsset[] = [
  {
    name: "TUF root metadata",
    expiryLabel: "Expired Apr 7, 2026 · 14h ago",
    timeRemaining: "Expired",
    severity: "danger",
  },
  {
    name: "Fulcio intermediate CA",
    expiryLabel: "Expires May 6, 2026",
    timeRemaining: "28 days",
    severity: "warning",
  },
  {
    name: "CT log shard 2026",
    expiryLabel: "Expires Dec 31, 2026",
    timeRemaining: "267 days",
    severity: "success",
  },
];

const expiredCount = assets.filter((a) => a.severity === "danger").length;

export const ExpiringTrustAssets: React.FC = () => (
  <Card isFullHeight>
    <CardHeader>
      <Flex justifyContent={{ default: "justifyContentSpaceBetween" }} alignItems={{ default: "alignItemsCenter" }}>
        <FlexItem>
          <CardTitle>Expiring trust assets</CardTitle>
        </FlexItem>
        {expiredCount > 0 && (
          <FlexItem>
            <Label color="red">{expiredCount} expired</Label>
          </FlexItem>
        )}
      </Flex>
    </CardHeader>
    <CardBody>
      <DescriptionList isHorizontal isCompact termWidth="auto">
        {assets.map((asset) => (
          <DescriptionListGroup key={asset.name}>
            <DescriptionListTerm>
              <Content component="p">
                <strong>{asset.name}</strong>
              </Content>
              <Content component="small" style={{ color: "var(--pf-t--global--text--color--subtle)" }}>
                {asset.expiryLabel}
              </Content>
            </DescriptionListTerm>
            <DescriptionListDescription>
              <Content
                component="p"
                style={{
                  color:
                    asset.severity === "danger"
                      ? "var(--pf-t--global--color--status--danger--default)"
                      : asset.severity === "warning"
                        ? "var(--pf-t--global--color--status--warning--default)"
                        : "var(--pf-t--global--text--color--regular)",
                  textAlign: "end",
                }}
              >
                {asset.timeRemaining}
              </Content>
            </DescriptionListDescription>
          </DescriptionListGroup>
        ))}
      </DescriptionList>
      <Button
        variant="link"
        isInline
        icon={<ArrowRightIcon />}
        iconPosition="end"
        style={{ marginTop: "var(--pf-t--global--spacer--md)" }}
      >
        Renewal runbook
      </Button>
    </CardBody>
  </Card>
);
