import { dump, load } from "js-yaml";
import { Convert } from "pvtsutils";
import { Fragment, type ReactNode, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import {
  type DSSEV001Schema,
  type IntotoV001Schema,
  type IntotoV002Schema,
  type LogEntry,
  type RekorSchema,
} from "rekor";
import { toRelativeDateString } from "../utils/date";
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
  Grid,
  GridItem,
  Panel,
} from "@patternfly/react-core";
import { IntotoViewer001 } from "../Template/Intoto001";
import { IntotoViewer002 } from "../Template/Intoto002";
import { DSSEViewer } from "./DSSEViewer";
import { HashedRekordViewer } from "./HashedRekord";
import { Link } from "react-router-dom";
import { Paths } from "@app/Routes";

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

  let parsed: ReactNode | undefined;
  switch (body.kind) {
    case "hashedrekord":
      parsed = <HashedRekordViewer hashedRekord={body.spec as RekorSchema} />;
      break;
    case "intoto":
      if (body.apiVersion == "0.0.1") {
        parsed = <IntotoViewer001 intoto={body.spec as IntotoV001Schema} />;
        break;
      } else {
        parsed = <IntotoViewer002 intoto={body.spec as IntotoV002Schema} />;
        break;
      }
    case "dsse":
      parsed = <DSSEViewer dsse={body.spec as DSSEV001Schema} />;
      break;
  }

  return (
    <Card style={{ margin: "1.5em auto 2em", overflowY: "hidden" }}>
      <CardBody>
        <h2
          style={{
            margin: "1.25em auto",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Entry UUID: <Link to={{ pathname: Paths.rekorSearch, search: `?uuid=${uuid}` }}>{uuid}</Link>
        </h2>
        <Divider />
        <Grid hasGutter={true}>
          <GridItem sm={3}>
            <EntryCard title="Type" content={body.kind} dividerProps={{ display: "none" }} />
          </GridItem>
          <GridItem sm={3}>
            <EntryCard
              title="Log Index"
              content={
                <Link to={{ pathname: Paths.rekorSearch, search: `?logIndex=${obj.logIndex}` }}>{obj.logIndex}</Link>
              }
            />
          </GridItem>
          <GridItem sm={6}>
            <EntryCard title="Integrated time" content={toRelativeDateString(new Date(obj.integratedTime * 1000))} />
          </GridItem>
        </Grid>
        <Divider />
        {parsed}
        <Panel
          style={{
            margin: "0.75em auto",
          }}
        >
          <Fragment>
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
                    <b>Raw Body</b>
                  </AccordionToggle>
                  <AccordionContent>
                    <SyntaxHighlighter language="yaml" style={atomDark}>
                      {dump(body, DUMP_OPTIONS)}
                    </SyntaxHighlighter>
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
                      <SyntaxHighlighter language="yaml" style={atomDark}>
                        {dump(attestation)}
                      </SyntaxHighlighter>
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
                      <SyntaxHighlighter language="yaml" style={atomDark}>
                        {dump(obj.verification)}
                      </SyntaxHighlighter>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </>
            </Accordion>
          </Fragment>
        </Panel>
      </CardBody>
    </Card>
  );
}
