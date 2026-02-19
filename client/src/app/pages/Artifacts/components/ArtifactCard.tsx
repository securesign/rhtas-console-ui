import { Card, CardHeader, Content, Button, Label, CardTitle, CardExpandableContent } from "@patternfly/react-core";
import { ArtifactAttestations } from "./ArtifactAttestations";
import { ArtifactSignatures } from "./ArtifactSignatures";
import { ArtifactSummary } from "./ArtifactSummary";
import { verificationStatusToLabelColor } from "@app/utils/utils";
import { Fragment, useState } from "react";
import type { ImageMetadataResponse, VerifyArtifactResponse } from "@app/client";
import { ExternalLinkAltIcon } from "@patternfly/react-icons";
import { NoDataEmptyState } from "@app/components/TableControls/NoDataEmptyState";

interface IArtifactCard {
  artifact: ImageMetadataResponse;
  verification: VerifyArtifactResponse;
}

export const ArtifactCard = ({ artifact, verification }: IArtifactCard) => {
  const { overallStatus } = verification.summary;
  const { label: verificationLabel, color: verificationLabelColor } = verificationStatusToLabelColor(overallStatus);
  const [isSignaturesExpanded, setIsSignaturesExpanded] = useState(false);
  const [isAttestationsExpanded, setIsAttestationsExpanded] = useState(false);

  const onSignatureExpand = () => {
    setIsSignaturesExpanded(!isSignaturesExpanded);
  };

  const onAttestationsExpand = () => {
    setIsAttestationsExpanded(!isAttestationsExpanded);
  };

  return (
    <Fragment>
      <Card style={{ overflowY: "hidden" }}>
        <CardHeader>
          <Content style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
            <CardTitle>Artifact details</CardTitle>
            <Button
              style={{ padding: "0", marginRight: "1rem" }}
              variant="link"
              href={`https://${artifact.image}`}
              component={"a"}
              icon={<ExternalLinkAltIcon />}
              iconPosition="end"
              target="_blank"
            >
              {artifact.image}
            </Button>
            <Label color={verificationLabelColor}>{verificationLabel}</Label>
          </Content>
        </CardHeader>
        {/** ARTIFACT SUMMARY */}
        <ArtifactSummary artifact={artifact} verification={verification} />
      </Card>
      <Card style={{ marginTop: "2rem" }} isExpanded={isSignaturesExpanded}>
        <CardHeader onExpand={onSignatureExpand}>
          <Content>
            <CardTitle style={{ borderBottom: "none" }}>Signatures - {verification.signatures?.length ?? 0}</CardTitle>
          </Content>
        </CardHeader>
        <CardExpandableContent>
          {verification.signatures ? <ArtifactSignatures signatures={verification.signatures} /> : <NoDataEmptyState />}
        </CardExpandableContent>
      </Card>

      <Card style={{ marginTop: "2rem" }} isExpanded={isAttestationsExpanded}>
        <CardHeader onExpand={onAttestationsExpand}>
          <Content>
            <CardTitle style={{ borderBottom: "none" }}>
              Attestations - {verification.attestations?.length ?? 0}
            </CardTitle>
          </Content>
        </CardHeader>
        <CardExpandableContent>
          {verification.attestations ? (
            <ArtifactAttestations attestations={verification.attestations} />
          ) : (
            <NoDataEmptyState />
          )}
        </CardExpandableContent>
      </Card>
    </Fragment>
  );
};
