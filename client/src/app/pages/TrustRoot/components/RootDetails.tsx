import React from "react";

import {
  Card,
  CardBody,
  CardTitle,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTermHelpText,
} from "@patternfly/react-core";

import type { RootMetadataInfoList } from "@app/client";
import { CertificateStatusIcon } from "@app/components/CertificateStatusIcon";
import { capitalizeFirstLetter, formatDate, universalComparator } from "@app/utils/utils";

interface IRootDetailsProps {
  rootMetadataList: RootMetadataInfoList;
}

export const RootDetails: React.FC<IRootDetailsProps> = ({ rootMetadataList }) => {
  const latestMetadataInfo = React.useMemo(() => {
    // Sort:desc of metadata by version
    const metadataInfo = [...rootMetadataList.data]
      .sort((a, b) => universalComparator(a.version, b.version, "en"))
      .reverse();
    return metadataInfo[0] ? metadataInfo[0] : null;
  }, [rootMetadataList]);

  return (
    <Card isPlain>
      <CardTitle>Metadata</CardTitle>
      <CardBody>
        <DescriptionList
          aria-label="Metadata"
          columnModifier={{
            default: "2Col",
          }}
        >
          <DescriptionListGroup>
            <DescriptionListTermHelpText>Version</DescriptionListTermHelpText>
            <DescriptionListDescription>{latestMetadataInfo?.version}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>Expires</DescriptionListTermHelpText>
            <DescriptionListDescription>{formatDate(latestMetadataInfo?.expires)}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>Status</DescriptionListTermHelpText>
            <DescriptionListDescription>
              {latestMetadataInfo && <CertificateStatusIcon status={latestMetadataInfo?.status} />}{" "}
              {capitalizeFirstLetter(latestMetadataInfo?.status ?? "")}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </CardBody>
    </Card>
  );
};
