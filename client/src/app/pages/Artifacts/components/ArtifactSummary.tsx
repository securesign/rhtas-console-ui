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
  Label,
} from "@patternfly/react-core";
import type { ImageMetadataResponse, VerifyArtifactResponse } from "@app/client";

interface IArtifactSummaryProps {
  artifact: ImageMetadataResponse;
  verification: VerifyArtifactResponse;
}

const getAllLabels = (labels: Record<string, string> | undefined | null): string[] => {
  return Object.entries(labels ?? {}).map(([key, value]) => joinKeyValueAsString({ key, value }));
};

const joinKeyValueAsString = ({ key, value }: { key: string; value: string }): string => {
  return `${value ? `${key}=${value}` : `${key}`}`;
};

export const ArtifactSummary = ({ artifact, verification }: IArtifactSummaryProps) => {
  const { summary } = verification;
  const identities = summary.identities ?? [];
  const labels = getAllLabels(artifact.metadata.labels);
  const { timeCoherence } = summary;

  const identityList = identities.map((identity) => (
    <div key={identity.value}>
      <Label isCompact>{identity.value}</Label>
    </div>
  ));

  const identitiesUnavailable = (
    <Popover triggerAction="hover" bodyContent={<div>Artifact was not signed with a certificate</div>}>
      <p>No identity available</p>
    </Popover>
  );

  const unknownTimeCoherence = (
    <Popover
      triggerAction="hover"
      aria-label="hoverable popover for unknown time coherence"
      bodyContent={<div>No min/max integrated time recorded in transparency log</div>}
    >
      <p>{timeCoherence?.status}</p>
    </Popover>
  );

  const summaryCards = [
    <Card key="artifact-summary" isPlain>
      <CardBody>
        <DescriptionList aria-label="Digest help text" columnModifier={{ default: "2Col" }}>
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
            <DescriptionListTermHelpText>
              <Popover
                headerContent={<div>Media Type</div>}
                bodyContent={<div>The media type of the container image (e.g., OCI manifest type).</div>}
              >
                <DescriptionListTermHelpTextButton>Media Type</DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>{artifact.metadata.mediaType}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>
              <Popover
                headerContent={<div>Size</div>}
                bodyContent={<div>The size of the container image in bytes.</div>}
              >
                <DescriptionListTermHelpTextButton> Size </DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>{artifact.metadata.size}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>
              <Popover
                headerContent={<div>Created</div>}
                bodyContent={<div>The timestamp indicating when the image was created.</div>}
              >
                <DescriptionListTermHelpTextButton> Created </DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>{formatDate(artifact.metadata.created)}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>
              <Popover headerContent={<div>Labels</div>} bodyContent={<div>Labels from artifact&apos;s metadata</div>}>
                <DescriptionListTermHelpTextButton>Labels</DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>
              {labels.length
                ? labels.map((label) => (
                    <div key={label}>
                      <Label isCompact>{label}</Label>
                    </div>
                  ))
                : "--"}
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
            <DescriptionListDescription style={{ width: "fit-content" }}>
              {identities.length ? identityList : identitiesUnavailable}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>
              <Popover
                headerContent={<div>Signatures</div>}
                bodyContent={
                  <div>
                    The number of cosign signatures attached to this artifact. Each signature is stored as a separate
                    layer in the OCI registry and can be independently verified.
                  </div>
                }
              >
                <DescriptionListTermHelpTextButton> Signatures </DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>{summary.signatureCount}</DescriptionListDescription>
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
            <DescriptionListDescription>{summary.attestationCount}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>
              <Popover headerContent={<div>Rekor Entries</div>} bodyContent={<div>A signed document</div>}>
                <DescriptionListTermHelpTextButton> Rekor Entries </DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>{summary.rekorEntryCount}</DescriptionListDescription>
          </DescriptionListGroup>
          {timeCoherence && (
            <DescriptionListGroup>
              <DescriptionListTermHelpText>
                <Popover headerContent={<div>Time Coherence</div>} bodyContent={<div>min/max integratedTime</div>}>
                  <DescriptionListTermHelpTextButton> Time Coherence </DescriptionListTermHelpTextButton>
                </Popover>
              </DescriptionListTermHelpText>
              <DescriptionListDescription style={{ width: "fit-content" }}>
                {timeCoherence.status === "ok"
                  ? `OK (${formatDate(timeCoherence.minIntegratedTime)} – ${formatDate(timeCoherence.maxIntegratedTime)})`
                  : timeCoherence.status === "unknown"
                    ? unknownTimeCoherence
                    : timeCoherence.status}
              </DescriptionListDescription>
            </DescriptionListGroup>
          )}
        </DescriptionList>
      </CardBody>
    </Card>,
  ];

  return <MultiContentCard isPlain cards={summaryCards} />;
};
