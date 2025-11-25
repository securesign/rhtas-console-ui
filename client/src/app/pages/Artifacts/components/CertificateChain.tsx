import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  Card,
  CardBody,
  CardTitle,
  ClipboardCopy,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTermHelpText,
} from "@patternfly/react-core";
import type { ParsedCertificate } from "@app/queries/artifacts.view-model";
import { useState } from "react";
import { capitalizeFirstLetter, formatDate } from "@app/utils/utils";

export const CertificateChain = ({ certificateChain }: { certificateChain: ParsedCertificate[] }) => {
  const [expanded, setExpanded] = useState("");

  const onToggle = (id: string) => {
    if (id === expanded) {
      setExpanded("");
    } else {
      setExpanded(id);
    }
  };

  return (
    <Card style={{ overflow: "visible" }}>
      <CardTitle>Certificate Chain</CardTitle>
      <CardBody>
        <Accordion>
          {certificateChain.map((cert, idx) => {
            return (
              <AccordionItem isExpanded={expanded === `cert-chain-toggle-${idx}`} key={idx}>
                <AccordionToggle
                  onClick={() => {
                    onToggle(`cert-chain-toggle-${idx}`);
                  }}
                  id={`cert-chain-toggle-${idx}`}
                >
                  {capitalizeFirstLetter(cert.role)}
                </AccordionToggle>
                <AccordionContent id={`cert-chain-expand-${idx}`}>
                  <DescriptionList aria-label="Certificate chain details" isCompact isHorizontal>
                    <DescriptionListGroup>
                      <DescriptionListTermHelpText>Subject</DescriptionListTermHelpText>
                      <DescriptionListDescription>{cert.subject}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTermHelpText>Issuer</DescriptionListTermHelpText>
                      <DescriptionListDescription>{cert.issuer}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTermHelpText>Not Before</DescriptionListTermHelpText>
                      <DescriptionListDescription>{formatDate(cert.notBefore)}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTermHelpText>Not After</DescriptionListTermHelpText>
                      <DescriptionListDescription>{formatDate(cert.notAfter)}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTermHelpText>SANs</DescriptionListTermHelpText>
                      <DescriptionListDescription>{cert.sans.join(", ")}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTermHelpText>Serial Number</DescriptionListTermHelpText>
                      <DescriptionListDescription>{cert.serialNumber}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTermHelpText>Is CA</DescriptionListTermHelpText>
                      <DescriptionListDescription>{cert.isCa}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTermHelpText>PEM</DescriptionListTermHelpText>
                      <DescriptionListDescription>
                        <ClipboardCopy isReadOnly hoverTip="Copy PEM" clickTip="Copied">
                          {cert.pem}
                        </ClipboardCopy>
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardBody>
    </Card>
  );
};
