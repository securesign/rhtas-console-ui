import { dump } from "js-yaml";
import { Link } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { type DSSEV001Schema } from "rekor";
import { Panel } from "@patternfly/react-core";
import { decodex509 } from "../Template/x509/decode";
import { Paths } from "@app/Routes";

export function DSSEViewer({ dsse }: { dsse: DSSEV001Schema }) {
  const sig = dsse.signatures?.[0];
  const certContent = window.atob(sig?.verifier ?? "");

  const publicKey = {
    title: "Public Key",
    content: certContent,
  };
  if (certContent.includes("BEGIN CERTIFICATE")) {
    publicKey.title = "Public Key Certificate";
    publicKey.content = dump(decodex509(certContent), {
      noArrayIndent: true,
      lineWidth: -1,
    });
  }

  return (
    <Panel>
      <h5 style={{ paddingTop: "1em" }}>
        <Link
          to={{
            pathname: Paths.rekorSearch,
            search: `?hash=${dsse.payloadHash?.algorithm}:${dsse.payloadHash?.value}`,
          }}
        >
          Hash
        </Link>
      </h5>

      <SyntaxHighlighter language="text" style={atomDark}>
        {`${dsse.payloadHash?.algorithm}:${dsse.payloadHash?.value}`}
      </SyntaxHighlighter>

      <h5 style={{ paddingTop: "1em" }}>Signature</h5>
      <SyntaxHighlighter language="text" style={atomDark}>
        {sig?.signature ?? ""}
      </SyntaxHighlighter>
      <h5 style={{ paddingTop: "1em" }}>{publicKey.title}</h5>
      <SyntaxHighlighter language="yaml" style={atomDark}>
        {publicKey.content}
      </SyntaxHighlighter>
    </Panel>
  );
}
