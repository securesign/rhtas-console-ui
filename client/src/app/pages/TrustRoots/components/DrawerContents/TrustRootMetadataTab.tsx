import * as React from "react";
import { Button, Card, CardBody, CardFooter, CardTitle, Content, Flex, FlexItem, Icon } from "@patternfly/react-core";
import CheckCircleIcon from "@patternfly/react-icons/dist/esm/icons/check-circle-icon";
import { capitalizeFirstLetter, formatDate } from "@app/utils/utils";
import { ExclamationTriangleIcon, ExternalLinkAltIcon } from "@patternfly/react-icons";
import { type TrustRootKind } from "../../data/TrustRoots.data";
import TrustRootNotFound from "../TrustRootNotFound";

export interface TrustRootMetadataTabProps {
  trustRoot?: TrustRootKind;
}

const TrustRootMetadataTab: React.FC<TrustRootMetadataTabProps> = ({ trustRoot }) => {
  if (!trustRoot?.tufMetadata || !Array.isArray(trustRoot.tufMetadata) || trustRoot.tufMetadata.length === 0) {
    return <TrustRootNotFound />;
  }
  const latestTUF = trustRoot?.tufMetadata[0];

  return (
    <Card id="certificate-health" isPlain isFullHeight key="card-1">
      <CardTitle>
        <Content component="h3">TUF metadata</Content>
      </CardTitle>
      <CardBody>
        <Flex grow={{ default: "grow" }} spaceItems={{ default: "spaceItemsXl" }}>
          <Flex flex={{ default: "flex_1" }}>
            <Flex direction={{ default: "column" }} spaceItems={{ default: "spaceItemsLg" }}>
              <FlexItem>
                <Flex direction={{ default: "column" }}>
                  <FlexItem>
                    <Content component="h4">Status</Content>
                  </FlexItem>
                  <FlexItem>
                    {latestTUF.status === "valid" ? (
                      <Icon status="success">
                        <CheckCircleIcon />
                      </Icon>
                    ) : (
                      <Icon status="warning">
                        <ExclamationTriangleIcon />
                      </Icon>
                    )}{" "}
                    {capitalizeFirstLetter(latestTUF.status)}
                  </FlexItem>
                </Flex>
              </FlexItem>

              <FlexItem>
                <Flex direction={{ default: "column" }}>
                  <FlexItem>
                    <Content component="h4">Version</Content>
                  </FlexItem>
                  <FlexItem>{latestTUF.version}</FlexItem>
                </Flex>
              </FlexItem>
            </Flex>
          </Flex>
          <Flex flex={{ default: "flex_1" }} align={{ default: "alignRight" }}>
            <Flex direction={{ default: "column" }} spaceItems={{ default: "spaceItemsLg" }}>
              <FlexItem>
                <FlexItem>
                  <Flex direction={{ default: "column" }}>
                    <FlexItem>
                      <Content component="h4">Role</Content>
                    </FlexItem>
                    <FlexItem>{latestTUF.role}</FlexItem>
                  </Flex>
                </FlexItem>
              </FlexItem>
              <Flex>
                <FlexItem align={{ default: "alignRight" }}>
                  <FlexItem>
                    <Flex direction={{ default: "column" }}>
                      <FlexItem>
                        <Content component="h4">Expires</Content>
                      </FlexItem>
                      <FlexItem>{formatDate(latestTUF.expires)}</FlexItem>
                    </Flex>
                  </FlexItem>
                </FlexItem>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </CardBody>
      <CardFooter>
        <Button variant="link" isInline icon={<ExternalLinkAltIcon />}>
          See the trust root definition on store
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TrustRootMetadataTab;
