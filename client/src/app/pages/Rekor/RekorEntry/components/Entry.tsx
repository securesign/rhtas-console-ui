import { dump, load } from "js-yaml";
import { Convert } from "pvtsutils";
import { type ReactNode, useState } from "react";
import { type LogEntry } from "rekor";
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionToggle,
  Card,
  CardBody,
  Divider,
  Flex,
  FlexItem,
  CardHeader,
  CardTitle,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTermHelpText,
  DescriptionListDescription,
  Content,
} from "@patternfly/react-core";
import { formatIntegratedTime } from "@app/utils/utils";
import { Hash } from "../../shared/components/Hash";
import { Signature } from "../../shared/components/Signature";
import { PublicKey } from "../../shared/components/PublicKey";

const DUMP_OPTIONS: jsyaml.DumpOptions = {
  replacer: (_key, value: string) => {
    if (Convert.isBase64(value)) {
      try {
        const decodedVal = window.atob(value);
        if (decodedVal.startsWith("-----BEGIN")) {
          return decodedVal;
        }
        return load(decodedVal);
      } catch (_e) {
        return value;
      }
    }
    return value;
  },
};

/**
 * Return a parsed JSON object of the provided content.
 * If an error occurs, the provided content is returned as a raw string.
 */
function tryJSONParse(content?: string): unknown {
  if (!content) {
    return content;
  }
  try {
    return JSON.parse(content);
  } catch (_e) {
    return content;
  }
}

export function EntryCard({
  title,
  content,
  dividerProps = {},
}: {
  title: ReactNode;
  content: ReactNode;
  dividerProps?: { display?: string };
}) {
  return (
    <Flex style={{ padding: "1em" }}>
      <Divider
        orientation={{
          default: "vertical",
        }}
        style={{ margin: "inherit 1em", ...dividerProps }}
      />
      <FlexItem>
        <h3>{title}</h3>
        <p
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
          }}
        >
          {content}
        </p>
      </FlexItem>
    </Flex>
  );
}

export function Entry({ entry }: { entry: LogEntry }) {
  const [uuid, obj] = Object.entries(entry)[0];

  type PanelId = "body-content" | "attestation-content" | "verification-content";
  const [expanded, setExpanded] = useState<PanelId[]>([]);

  const toggle = (id: PanelId) => {
    const index = expanded.indexOf(id);
    const newExpanded: PanelId[] =
      index >= 0 ? [...expanded.slice(0, index), ...expanded.slice(index + 1, expanded.length)] : [...expanded, id];
    setExpanded(newExpanded);
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const body = JSON.parse(window.atob(obj.body)) as {
    kind: string;
    apiVersion: string;
    spec: unknown;
  };

  // Extract the JSON payload of the attestation. Some attestations appear to be
  // double Base64 encoded. This loop will attempt to extract the content, with
  // a max depth as a safety gap.
  let rawAttestation = obj.attestation?.data as string | undefined;

  for (let i = 0; Convert.isBase64(rawAttestation) && i < 3; i++) {
    rawAttestation = window.atob(rawAttestation);
  }
  const attestation = tryJSONParse(rawAttestation);

  return (
    <Flex direction={{ default: "column" }} spaceItems={{ default: "spaceItemsXl" }}>
      <FlexItem>
        <Card>
          <CardHeader>
            <CardTitle>Log details</CardTitle>
          </CardHeader>
          <CardBody>
            <DescriptionList columnModifier={{ default: "1Col" }}>
              <DescriptionList columnModifier={{ default: "3Col" }}>
                <DescriptionListGroup>
                  <DescriptionListTermHelpText>Type</DescriptionListTermHelpText>
                  <DescriptionListDescription>{body.kind}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTermHelpText>Log index</DescriptionListTermHelpText>
                  <DescriptionListDescription>{obj.logIndex}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTermHelpText>Integrated time</DescriptionListTermHelpText>
                  <DescriptionListDescription>{formatIntegratedTime(obj.integratedTime)}</DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
              <DescriptionList columnModifier={{ default: "1Col" }}>
                <DescriptionListGroup>
                  <DescriptionListTermHelpText>Entry UUID</DescriptionListTermHelpText>
                  <DescriptionListDescription>{uuid}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTermHelpText>Hash</DescriptionListTermHelpText>
                  <DescriptionListDescription>
                    <Hash type={body.kind} apiVersion={body.apiVersion} spec={body.spec} />
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTermHelpText>Signature</DescriptionListTermHelpText>
                  <DescriptionListDescription>
                    <Signature type={body.kind} apiVersion={body.apiVersion} spec={body.spec} />
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </DescriptionList>
          </CardBody>
        </Card>
      </FlexItem>
      <FlexItem>
        <Card>
          <CardHeader>
            <CardTitle>Public Key Certificate</CardTitle>
          </CardHeader>
          <CardBody>
            <PublicKey type={body.kind} apiVersion={body.apiVersion} spec={body.spec} />
          </CardBody>
        </Card>
      </FlexItem>
      <FlexItem>
        <Card>
          <CardHeader>
            <CardTitle>Recommended safety guardrails</CardTitle>
          </CardHeader>
          <CardBody>
            <Accordion>
              <>
                <AccordionItem isExpanded={expanded.includes("body-content")}>
                  <AccordionToggle
                    id={"body-header"}
                    aria-controls="body-content"
                    onClick={() => {
                      toggle("body-content");
                    }}
                  >
                    Raw Body
                  </AccordionToggle>
                  <AccordionContent>
                    <Content style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                      {dump(body, DUMP_OPTIONS)}
                    </Content>
                  </AccordionContent>
                </AccordionItem>
                {attestation && (
                  <AccordionItem isExpanded={expanded.includes("attestation-content")}>
                    <AccordionToggle
                      aria-controls="attestation-content"
                      id="attestation-header"
                      onClick={() => {
                        toggle("attestation-content");
                      }}
                    >
                      <b>Attestation</b>
                    </AccordionToggle>
                    <AccordionContent>
                      <Content style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{dump(attestation)}</Content>
                    </AccordionContent>
                  </AccordionItem>
                )}
                {obj.verification && (
                  <AccordionItem isExpanded={expanded.includes("verification-content")}>
                    <AccordionToggle
                      aria-controls="verification-content"
                      id={"verification-header"}
                      onClick={() => {
                        toggle("verification-content");
                      }}
                    >
                      <h3>Verification</h3>
                    </AccordionToggle>
                    <AccordionContent>
                      <Content style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                        {dump(obj.verification)}
                      </Content>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </>
            </Accordion>
          </CardBody>
        </Card>
      </FlexItem>
    </Flex>
  );
}
