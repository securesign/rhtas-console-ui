import { dump } from "js-yaml";
import { Link } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { type IntotoV002Schema } from "rekor";
import { decodex509 } from "./x509/decode";
import { Panel } from "@patternfly/react-core";
import { Paths } from "@app/Routes";

export function IntotoViewer002({ intoto }: { intoto: IntotoV002Schema }) {
  const signature = intoto.content.envelope?.signatures[0];
  const certContent = window.atob(signature?.publicKey || "");

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
      <h5 style={{ paddingTop: "1.5em", paddingBottom: "1.5em" }}>
        <Link
          to={{
            pathname: Paths.rekorSearch,
            search: `?hash=${intoto.content.payloadHash?.algorithm}:${intoto.content.payloadHash?.value}`,
          }}
        >
          Hash
        </Link>
      </h5>

      <SyntaxHighlighter language="text" style={atomDark}>
        {`${intoto.content.payloadHash?.algorithm}:${intoto.content.payloadHash?.value}`}
      </SyntaxHighlighter>

      <h5 style={{ paddingTop: "1.5em", paddingBottom: "1.5em" }}>Signature</h5>
      <SyntaxHighlighter language="text" style={atomDark}>
        {window.atob(signature?.sig || "")}
      </SyntaxHighlighter>
      <h5 style={{ paddingTop: "1.5em", paddingBottom: "1.5em" }}>{publicKey.title}</h5>
      <SyntaxHighlighter language="yaml" style={atomDark}>
        {publicKey.content}
      </SyntaxHighlighter>
    </Panel>
  );
}
