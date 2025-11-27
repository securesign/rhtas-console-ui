import type { RekorEntry } from "@app/client";
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

export const RekorEntryPanel = ({ rekorEntry }: { rekorEntry: RekorEntry | undefined }) => {
  if (!rekorEntry) return <></>;
  const entryType = getRekorEntryType(rekorEntry.body);
  const setBytes = getRekorSetBytes(rekorEntry.verification.signedEntryTimestamp);

  return (
    <Card>
      <CardTitle>Rekor Entry</CardTitle>
      <CardBody>
        <DescriptionList aria-label="Certificate chain details" isCompact isHorizontal>
          {rekorEntry.uuid && (
            <DescriptionListGroup>
              <DescriptionListTermHelpText>UUID</DescriptionListTermHelpText>
              <DescriptionListDescription>
                <ClipboardCopy isReadOnly hoverTip="Copy UUID" clickTip="Copied">
                  {rekorEntry.uuid}
                </ClipboardCopy>
              </DescriptionListDescription>
            </DescriptionListGroup>
          )}
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
          {rekorEntry.logID && (
            <DescriptionListGroup>
              <DescriptionListTermHelpText>Log ID</DescriptionListTermHelpText>
              <DescriptionListDescription>{rekorEntry.logID}</DescriptionListDescription>
            </DescriptionListGroup>
          )}
          {rekorEntry.logIndex && (
            <DescriptionListGroup>
              <DescriptionListTermHelpText>Log Index</DescriptionListTermHelpText>
              <DescriptionListDescription>{rekorEntry.logIndex}</DescriptionListDescription>
            </DescriptionListGroup>
          )}
          {rekorEntry.verification.inclusionProof.treeSize && (
            <DescriptionListGroup>
              <DescriptionListTermHelpText>Tree Size</DescriptionListTermHelpText>
              <DescriptionListDescription>{rekorEntry.verification.inclusionProof.treeSize}</DescriptionListDescription>
            </DescriptionListGroup>
          )}
          {rekorEntry.verification.inclusionProof.hashes &&
            rekorEntry.verification.inclusionProof.hashes.length > 0 && (
              <DescriptionListGroup>
                <DescriptionListTermHelpText>Proof Depth</DescriptionListTermHelpText>
                <DescriptionListDescription>
                  {rekorEntry.verification.inclusionProof.hashes.length}
                </DescriptionListDescription>
              </DescriptionListGroup>
            )}
          {setBytes && (
            <DescriptionListGroup>
              <DescriptionListTermHelpText>Signed Entry Timestamp</DescriptionListTermHelpText>
              <DescriptionListDescription>
                {/* probably better to show base64 or hex string rather than raw bytes array */}
                <ClipboardCopy isReadOnly hoverTip="Copy SET" clickTip="Copied">
                  {rekorEntry.verification.signedEntryTimestamp}
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
                href={`/rekor-search?uuid=${rekorEntry.uuid}`}
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
