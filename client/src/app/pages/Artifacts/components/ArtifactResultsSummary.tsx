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

export const ArtifactResultsSummary = ({ artifact, verification }: IArtifactResultsProps) => {
  const { summary } = verification;
  const identities = summary.identities ?? [];
  const timeCoherence = summary.timeCoherence;

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
              <ClipboardCopy truncation hoverTip="Copy" clickTip="Copied" variant="inline-compact" isCode>
                {artifact.digest}
              </ClipboardCopy>
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>
              <Popover headerContent={<div>Media Type</div>} bodyContent={<div>ref + resolved canonical digest</div>}>
                <DescriptionListTermHelpTextButton> Media Type </DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>{artifact.metadata.mediaType}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>Size</DescriptionListTermHelpText>
            <DescriptionListDescription>{artifact.metadata.size}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>
              <Popover headerContent={<div>Date</div>} bodyContent={<div>Date created</div>}>
                <DescriptionListTermHelpTextButton> Created </DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>{formatDate(artifact.metadata.created)}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>
              <Popover headerContent={<div>Labels</div>} bodyContent={<div>Additional labels info</div>}>
                <DescriptionListTermHelpTextButton> Labels </DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
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
              {identities.map((identity, index) => (
                <span key={identity.id}>
                  <a href="#">{identity.value}</a>
                  {index < identities.length - 1 && ", "}
                </span>
              ))}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>
              <Popover headerContent={<div>Signatures</div>} bodyContent={<div>Additional labels info</div>}>
                <DescriptionListTermHelpTextButton> Signatures </DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>
              <Label className="pf-v6-u-mb-sm" color="blue">
                {summary.signatureCount} Signatures
              </Label>
            </DescriptionListDescription>
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
            <DescriptionListDescription>
              <Label className="pf-v6-u-mb-sm" color="green">
                {summary.attestationCount} Attestations
              </Label>
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>
              <Popover headerContent={<div>Rekor Entries</div>} bodyContent={<div>A signed document</div>}>
                <DescriptionListTermHelpTextButton> Rekor Entries </DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>
              <Label className="pf-v6-u-mb-sm" color="orange">
                {summary.rekorEntryCount} Rekor Entries
              </Label>
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>
              <Popover headerContent={<div>Time Coherence</div>} bodyContent={<div>min/max integratedTime</div>}>
                <DescriptionListTermHelpTextButton> Time Coherence </DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>
              {timeCoherence.status === "ok"
                ? `OK (${timeCoherence.minIntegratedTime} – ${timeCoherence.maxIntegratedTime})`
                : timeCoherence.status}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </CardBody>
    </Card>,
  ];
  return <MultiContentCard cards={summaryCards} />;
};
