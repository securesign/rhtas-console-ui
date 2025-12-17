import type { TransparencyLogEntry } from "@app/client";
import { formatIntegratedTime, getRekorEntryType, getRekorSetBytes } from "@app/utils/utils";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  ClipboardCopy,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTermHelpText,
} from "@patternfly/react-core";
import { ExternalLinkAltIcon } from "@patternfly/react-icons";

export const RekorEntryPanel = ({ rekorEntry }: { rekorEntry: TransparencyLogEntry | undefined }) => {
  if (!rekorEntry) return <></>;
  const entryType = getRekorEntryType(rekorEntry.canonicalizedBody);
  const setBytes = getRekorSetBytes(rekorEntry.inclusionPromise?.signedEntryTimestamp);

  return (
    <Card>
      <CardTitle>Rekor Entry</CardTitle>
      <CardBody>
        <DescriptionList aria-label="Certificate chain details" isCompact isHorizontal>
          {entryType && (
            <DescriptionListGroup>
              <DescriptionListTermHelpText>Entry Type</DescriptionListTermHelpText>
              <DescriptionListDescription>{entryType}</DescriptionListDescription>
            </DescriptionListGroup>
          )}
          {rekorEntry.integratedTime && (
            <DescriptionListGroup>
              <DescriptionListTermHelpText>Integrated Time</DescriptionListTermHelpText>
              <DescriptionListDescription>{formatIntegratedTime(rekorEntry.integratedTime)}</DescriptionListDescription>
            </DescriptionListGroup>
          )}
          {rekorEntry.logId?.keyId && (
            <DescriptionListGroup>
              <DescriptionListTermHelpText>Log ID</DescriptionListTermHelpText>
              <DescriptionListDescription>{rekorEntry.logId?.keyId}</DescriptionListDescription>
            </DescriptionListGroup>
          )}
          {rekorEntry.logIndex && (
            <DescriptionListGroup>
              <DescriptionListTermHelpText>Log Index</DescriptionListTermHelpText>
              <DescriptionListDescription>{rekorEntry.logIndex}</DescriptionListDescription>
            </DescriptionListGroup>
          )}
          {rekorEntry.inclusionProof?.treeSize && (
            <DescriptionListGroup>
              <DescriptionListTermHelpText>Tree Size</DescriptionListTermHelpText>
              <DescriptionListDescription>{rekorEntry.inclusionProof?.treeSize}</DescriptionListDescription>
            </DescriptionListGroup>
          )}
          {rekorEntry.inclusionProof?.hashes && rekorEntry.inclusionProof?.hashes.length > 0 && (
            <DescriptionListGroup>
              <DescriptionListTermHelpText>Proof Depth</DescriptionListTermHelpText>
              <DescriptionListDescription>{rekorEntry.inclusionProof?.hashes.length}</DescriptionListDescription>
            </DescriptionListGroup>
          )}
          {setBytes && (
            <DescriptionListGroup>
              <DescriptionListTermHelpText>Signed Entry Timestamp</DescriptionListTermHelpText>
              <DescriptionListDescription>
                {/* probably better to show base64 or hex string rather than raw bytes array */}
                <ClipboardCopy isReadOnly hoverTip="Copy SET" clickTip="Copied">
                  {Array.from(setBytes)
                    .map((b) => b.toString(16))
                    .join("")}
                </ClipboardCopy>
              </DescriptionListDescription>
            </DescriptionListGroup>
          )}
          <DescriptionListGroup>
            <DescriptionListTermHelpText>Entry</DescriptionListTermHelpText>
            <DescriptionListDescription>
              <Button
                component="a"
                variant="link"
                href={`/rekor-search?logIndex=${rekorEntry.logIndex}`}
                target="_blank"
                rel="noopener noreferrer"
                icon={<ExternalLinkAltIcon />}
                iconPosition="right"
                aria-label={`rekorlink`}
              >
                Open in Rekor Search
              </Button>
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </CardBody>
    </Card>
  );
};
