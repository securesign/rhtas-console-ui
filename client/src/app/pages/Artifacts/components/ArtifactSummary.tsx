import { formatDate } from "@app/utils/utils";
import MultiContentCard from "@patternfly/react-component-groups/dist/esm/MultiContentCard";
import {
  Card,
  CardBody,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTermHelpText,
  Popover,
  DescriptionListTermHelpTextButton,
  DescriptionListDescription,
  ClipboardCopy,
  Button,
  Label,
} from "@patternfly/react-core";
import { PlusCircleIcon } from "@patternfly/react-icons";
import type { IArtifactResultsProps } from "./ArtifactResults";

export const ArtifactSummary = ({ artifact, verification }: IArtifactResultsProps) => {
  const { summary } = verification;
  const identities = summary.identities ?? [];
  const { timeCoherence } = summary;

  const summaryCards = [
    <Card key="artifact-summary" isPlain>
      <CardBody>
        <DescriptionList aria-label="Digest help text" isCompact isHorizontal columnModifier={{ default: "2Col" }}>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>
              <Popover headerContent={<div>Digest</div>} bodyContent={<div>ref + resolved canonical digest</div>}>
                <DescriptionListTermHelpTextButton> Digest </DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>
              <ClipboardCopy
                truncation={{ maxCharsDisplayed: 14 }}
                hoverTip="Copy"
                clickTip="Copied"
                variant="inline-compact"
                isCode
              >
                {artifact.digest}
              </ClipboardCopy>
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>Media Type</DescriptionListTermHelpText>
            <DescriptionListDescription>{artifact.metadata.mediaType}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>Size</DescriptionListTermHelpText>
            <DescriptionListDescription>{artifact.metadata.size}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>Created</DescriptionListTermHelpText>
            <DescriptionListDescription>{formatDate(artifact.metadata.created)}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>Labels</DescriptionListTermHelpText>
            <DescriptionListDescription>
              <Button variant="link" isInline icon={<PlusCircleIcon />}>
                {artifact.metadata.labels?.maintainer}
              </Button>
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>
              <Popover
                headerContent={<div>Identities</div>}
                bodyContent={<div>Deduped list of signature identities used</div>}
              >
                <DescriptionListTermHelpTextButton> Identities </DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>
              {identities.map((identity, idx) => (
                <div key={idx}>
                  <Label isCompact>{identity.value}</Label>{" "}
                </div>
              ))}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>Signatures</DescriptionListTermHelpText>
            <DescriptionListDescription>{summary.signatureCount} Signatures</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>
              <Popover
                headerContent={<div>Attestation</div>}
                bodyContent={
                  <div>
                    An attestation is a signed document (usually in in-toto format) that describes an event, action, or
                    property related to a software artifact.
                  </div>
                }
              >
                <DescriptionListTermHelpTextButton> Attestations </DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>{summary.attestationCount} Attestations</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>
              <Popover headerContent={<div>Rekor Entries</div>} bodyContent={<div>A signed document</div>}>
                <DescriptionListTermHelpTextButton> Rekor Entries </DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>{summary.rekorEntryCount} Rekor Entries</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>
              <Popover headerContent={<div>Time Coherence</div>} bodyContent={<div>min/max integratedTime</div>}>
                <DescriptionListTermHelpTextButton> Time Coherence </DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>
              {timeCoherence.status === "ok"
                ? `OK (${formatDate(timeCoherence.minIntegratedTime)} – ${formatDate(timeCoherence.maxIntegratedTime)})`
                : timeCoherence.status}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </CardBody>
    </Card>,
  ];

  return <MultiContentCard cards={summaryCards} />;
};
