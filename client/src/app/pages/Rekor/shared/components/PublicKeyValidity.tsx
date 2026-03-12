import { Flex, FlexItem, Icon } from "@patternfly/react-core";
import { CheckCircleIcon, ExclamationCircleIcon } from "@patternfly/react-icons";

export default function PublicKeyValidity({ isValid }: { isValid: boolean }) {
  return (
    <>
      {isValid ? (
        <Flex spaceItems={{ default: "spaceItemsXs" }}>
          <FlexItem>
            <Icon status="success">
              <CheckCircleIcon />
            </Icon>
          </FlexItem>
          <FlexItem>Valid</FlexItem>
        </Flex>
      ) : (
        <Flex spaceItems={{ default: "spaceItemsXs" }}>
          <FlexItem>
            <Icon status="danger">
              <ExclamationCircleIcon />
            </Icon>
          </FlexItem>
          <FlexItem>Invalid</FlexItem>
        </Flex>
      )}
    </>
  );
}
