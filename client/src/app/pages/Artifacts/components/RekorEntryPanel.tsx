import type { TransparencyLogEntry, SignatureStatus } from "@app/client";
import { formatIntegratedTime, getRekorEntryType, getRekorSetBytes } from "@app/utils/utils";
import {
  Button,
  Card,
  CardBody,
  ClipboardCopy,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTermHelpText,
} from "@patternfly/react-core";
import { ExternalLinkAltIcon } from "@patternfly/react-icons";
import { Link } from "react-router-dom";
import { StatusCardHeader } from "./StatusCardHeader";

export const RekorEntryPanel = ({
  rekorEntry,
  status,
}: {
  rekorEntry: TransparencyLogEntry | undefined;
  status: SignatureStatus["rekor"];
}) => {
  if (!rekorEntry) return <></>;
  const entryType = getRekorEntryType(rekorEntry.canonicalizedBody);
  const setBytes = getRekorSetBytes(rekorEntry.inclusionPromise?.signedEntryTimestamp);

  return (
    <Card>
      <StatusCardHeader title="Rekor Entry" status={status} />
      <CardBody>
        <DescriptionList aria-label="Certificate chain details" isCompact>
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
              <Link to={`/rekor-search?logIndex=${rekorEntry.logIndex}`} target="_blank" rel="noopener noreferrer">
                <Button variant="link" icon={<ExternalLinkAltIcon />} iconPosition="right" aria-label={`rekorlink`}>
                  Open in Rekor Search
                </Button>
              </Link>
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </CardBody>
    </Card>
  );
};
