import React from "react";

import {
  Bullseye,
  Card,
  CardBody,
  CardTitle,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTermHelpText,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  Gallery,
  GalleryItem,
} from "@patternfly/react-core";

import type { MetadataInfo, MetadataInfoResponse } from "@app/client";
import { CertificateStatusIcon } from "@app/components/CertificateStatusIcon";
import { capitalizeFirstLetter, formatDate } from "@app/utils/utils";
import { createComparator } from "@app/utils/utils";

interface IRootDetailsProps {
  metadataInfo: MetadataInfoResponse;
}

const comparator = createComparator();

const ROLE_LABELS: Record<string, string> = {
  root: "Root",
  targets: "Targets",
  snapshot: "Snapshot",
  timestamp: "Timestamp",
};

const ROLE_ORDER = ["root", "targets", "snapshot", "timestamp"];

function getLatestEntry(entries: MetadataInfo[]): MetadataInfo | null {
  if (!entries || entries.length === 0) return null;
  const sorted = [...entries].sort((a, b) => comparator(a.version, b.version)).reverse();
  return sorted[0] ?? null;
}

export const RootDetails: React.FC<IRootDetailsProps> = ({ metadataInfo }) => {
  const roles = React.useMemo(() => {
    return ROLE_ORDER.filter((role) => metadataInfo.data[role]?.length).map((role) => ({
      key: role,
      label: ROLE_LABELS[role] ?? role,
      latest: getLatestEntry(metadataInfo.data[role]),
    }));
  }, [metadataInfo]);

  if (roles.length === 0) {
    return (
      <Bullseye>
        <EmptyState variant={EmptyStateVariant.sm} titleText="No metadata available" headingLevel="h4">
          <EmptyStateBody>No TUF role metadata was found for this repository.</EmptyStateBody>
        </EmptyState>
      </Bullseye>
    );
  }

  return (
    <Gallery hasGutter minWidths={{ default: "300px" }}>
      {roles.map(({ key, label, latest }) => (
        <GalleryItem key={key}>
          <Card isFullHeight>
            <CardTitle>{label}</CardTitle>
            <CardBody>
              {latest ? (
                <DescriptionList aria-label={`${label} metadata`}>
                  <DescriptionListGroup>
                    <DescriptionListTermHelpText>Version</DescriptionListTermHelpText>
                    <DescriptionListDescription>{latest.version}</DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTermHelpText>Expires</DescriptionListTermHelpText>
                    <DescriptionListDescription>{formatDate(latest.expires)}</DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTermHelpText>Status</DescriptionListTermHelpText>
                    <DescriptionListDescription>
                      <CertificateStatusIcon status={latest.status} /> {capitalizeFirstLetter(latest.status)}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                </DescriptionList>
              ) : null}
            </CardBody>
          </Card>
        </GalleryItem>
      ))}
    </Gallery>
  );
};
