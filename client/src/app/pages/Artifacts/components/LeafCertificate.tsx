import type { ParsedCertificate } from "@app/queries/artifacts.view-model";
import { formatDate, sha256FingerprintFromPem } from "@app/utils/utils";
import {
  DropdownItem,
  Dropdown,
  type MenuToggleElement,
  MenuToggle,
  DropdownList,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTermHelpText,
  Card,
  CardBody,
  CardTitle,
  CardHeader,
} from "@patternfly/react-core";
import { EllipsisVIcon } from "@patternfly/react-icons";
import { useEffect, useState } from "react";

export const LeafCertificate = ({ leafCert }: { leafCert: ParsedCertificate }) => {
  const [leafCertFingerprint, setLeafCertFingerprint] = useState<string>("");
  const leafCertValidity = leafCert ? `${formatDate(leafCert.notBefore)} → ${formatDate(leafCert.notAfter)}` : "N/A";
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onSelect = () => {
    setIsOpen(!isOpen);
  };

  // track async operation until this becomes a static value
  // provided by the backend
  useEffect(() => {
    if (leafCert.pem) {
      sha256FingerprintFromPem(leafCert.pem)
        .then(setLeafCertFingerprint)
        .catch(() => setLeafCertFingerprint("N/A"));
    }
    console.log(leafCert.pem);
  }, [leafCert.pem]);

  const leafCertActionItems = (
    <>
      <DropdownItem key="copy-pem">Copy PEM</DropdownItem>
    </>
  );

  const leafCertActions = (
    <>
      <Dropdown
        onSelect={onSelect}
        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
          <MenuToggle
            ref={toggleRef}
            isExpanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            variant="plain"
            aria-label="Leaf certificate actions toggle"
            icon={<EllipsisVIcon />}
          />
        )}
        isOpen={isOpen}
        onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
      >
        <DropdownList>{leafCertActionItems}</DropdownList>
      </Dropdown>
    </>
  );

  return (
    <Card>
      <CardHeader actions={{ actions: leafCertActions }}>
        <CardTitle>Leaf Certificate</CardTitle>
      </CardHeader>
      <CardBody>
        <DescriptionList aria-label="Leaf certificate details" isCompact isHorizontal>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>SAN</DescriptionListTermHelpText>
            <DescriptionListDescription>{leafCert.sans.join(", ")}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>Issuer</DescriptionListTermHelpText>
            <DescriptionListDescription>{leafCert.issuer}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>Validity</DescriptionListTermHelpText>
            <DescriptionListDescription>{leafCertValidity}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>Serial</DescriptionListTermHelpText>
            <DescriptionListDescription>{leafCert.serialNumber}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>Fingerprint</DescriptionListTermHelpText>
            <DescriptionListDescription>
              {leafCert.pem ? leafCertFingerprint || "..." : "N/A"}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </CardBody>
    </Card>
  );
};
