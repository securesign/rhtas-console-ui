import { verificationStatusToLabelColor } from "@app/utils/utils";
import { CardHeader, CardTitle, Flex, FlexItem, Label } from "@patternfly/react-core";

export const StatusCardHeader = ({ title, status }: { title: string; status: string }) => {
  const { label, color } = verificationStatusToLabelColor(status ?? "Unknown");
  return (
    <CardHeader>
      <Flex>
        <FlexItem>
          <CardTitle>{title}</CardTitle>
        </FlexItem>
        <FlexItem align={{ default: "alignRight" }}>
          <Label aria-label={`Verification status: ${label}`} color={color}>
            {label}
          </Label>
        </FlexItem>
      </Flex>
    </CardHeader>
  );
};
