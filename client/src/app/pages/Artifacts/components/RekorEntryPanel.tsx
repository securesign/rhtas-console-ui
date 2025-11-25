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
  console.table(rekorEntry);
  const entryType = getRekorEntryType(rekorEntry.body);
  const setBytes = getRekorSetBytes(rekorEntry.verification.signedEntryTimestamp);

  return (
    <Card>
      <CardTitle>Rekor Entry</CardTitle>
      <CardBody>
        <DescriptionList aria-label="Certificate chain details" isCompact isHorizontal>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>UUID</DescriptionListTermHelpText>
            <DescriptionListDescription>
              <ClipboardCopy isReadOnly hoverTip="Copy UUID" clickTip="Copied">
                {rekorEntry.uuid}
              </ClipboardCopy>
            </DescriptionListDescription>
          </DescriptionListGroup>
          {entryType && (
            <DescriptionListGroup>
              <DescriptionListTermHelpText>Entry Type</DescriptionListTermHelpText>
              <DescriptionListDescription>{entryType}</DescriptionListDescription>
            </DescriptionListGroup>
          )}
          <DescriptionListGroup>
            <DescriptionListTermHelpText>Integrated Time</DescriptionListTermHelpText>
            <DescriptionListDescription>{formatIntegratedTime(rekorEntry.integratedTime)}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>Log ID</DescriptionListTermHelpText>
            <DescriptionListDescription>{rekorEntry.logID}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>Log Index</DescriptionListTermHelpText>
            <DescriptionListDescription>{rekorEntry.logIndex}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>Tree Size</DescriptionListTermHelpText>
            <DescriptionListDescription>{rekorEntry.verification.inclusionProof.treeSize}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>Proof Depth</DescriptionListTermHelpText>
            <DescriptionListDescription>{rekorEntry.verification.inclusionProof.hashes}</DescriptionListDescription>
          </DescriptionListGroup>
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
