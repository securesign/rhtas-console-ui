import {
  Card,
  CardHeader,
  Content,
  Flex,
  FlexItem,
  Button,
  Label,
  CardBody,
  Tabs,
  Tab,
  TabTitleText,
} from "@patternfly/react-core";
import { ArtifactAttestations } from "./ArtifactAttestations";
import { ArtifactSignatures } from "./ArtifactSignatures";
import { ArtifactSummary } from "./ArtifactSummary";
import { verificationStatusToLabelColor } from "@app/utils/utils";
import { useState } from "react";
import type { ImageMetadataResponse, VerifyArtifactResponse } from "@app/client";
import { ExternalLinkSquareAltIcon } from "@patternfly/react-icons";
import { NoDataEmptyState } from "@app/components/TableControls/NoDataEmptyState";

interface IArtifactCard {
  artifact: ImageMetadataResponse;
  verification: VerifyArtifactResponse;
}

export const ArtifactCard = ({ artifact, verification }: IArtifactCard) => {
  const [activeTabKey, setActiveTabKey] = useState<string | number>(0);
  const { overallStatus } = verification.summary;
  const { label: verificationLabel, color: verificationLabelColor } = verificationStatusToLabelColor(overallStatus);

  const handleTabClick = (
    _event: React.MouseEvent<unknown> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

  return (
    <Card style={{ overflowY: "hidden" }}>
      <CardHeader>
        <Content style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
          <Flex className="border">
            <FlexItem>
              Artifact:{" "}
              <Button
                variant="link"
                href={`https://${artifact.image}`}
                component={"a"}
                icon={<ExternalLinkSquareAltIcon />}
                iconPosition="end"
                target="_blank"
              >
                {artifact.image}
              </Button>
            </FlexItem>
            <FlexItem align={{ default: "alignRight" }}>
              <Label color={verificationLabelColor}>{verificationLabel}</Label>
            </FlexItem>
          </Flex>
        </Content>
      </CardHeader>
      <CardBody>
        {/** ARTIFACT SUMMARY */}
        <ArtifactSummary artifact={artifact} verification={verification} />
      </CardBody>
      <CardBody>
        <Tabs activeKey={activeTabKey} onSelect={handleTabClick} aria-label="Artifact results" role="region">
          <Tab eventKey={0} title={<TabTitleText>Signatures</TabTitleText>} aria-label="Signatures">
            {/** SIGNATURES */}
            {verification.signatures ? (
              <ArtifactSignatures signatures={verification.signatures} />
            ) : (
              <NoDataEmptyState />
            )}
          </Tab>
          <Tab eventKey={1} title={<TabTitleText>Attestations</TabTitleText>} aria-label="Attestations">
            {/** ATTESTATIONS */}
            {verification.attestations ? (
              <ArtifactAttestations attestations={verification.attestations} />
            ) : (
              <NoDataEmptyState />
            )}
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
};
