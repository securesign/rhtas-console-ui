import type { PrismTheme } from "types/prism-theme";
import { dump } from "js-yaml";
import { Link } from "react-router-dom";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism";
import { atomDark as darkTheme } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { type RekorSchema } from "rekor";
import { decodex509 } from "../x509/decode";
import { Panel } from "@patternfly/react-core";
import { Paths } from "@app/Routes";

export function HashedRekordViewer({ hashedRekord }: { hashedRekord: RekorSchema }) {
  const certContent = window.atob(hashedRekord.signature.publicKey?.content ?? "");

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
    <Panel style={{ marginTop: "1.25em" }}>
      <h5 style={{ margin: "1em auto" }}>
        <Link
          to={{
            pathname: Paths.rekorSearch,
            search: `?hash=${hashedRekord.data.hash?.algorithm}:${hashedRekord.data.hash?.value}`,
          }}
        >
          Hash
        </Link>
      </h5>
      <SyntaxHighlighter language="text" style={darkTheme as unknown as PrismTheme}>
        {`${hashedRekord.data.hash?.algorithm}:${hashedRekord.data.hash?.value}`}
      </SyntaxHighlighter>

      <h5 style={{ margin: "1em auto" }}>Signature</h5>
      <SyntaxHighlighter language="text" style={darkTheme as unknown as PrismTheme}>
        {hashedRekord.signature.content ?? ""}
      </SyntaxHighlighter>

      <h5 style={{ margin: "1em auto" }}>{publicKey.title}</h5>
      <SyntaxHighlighter language="yaml" style={darkTheme as unknown as PrismTheme}>
        {publicKey.content}
      </SyntaxHighlighter>
    </Panel>
  );
}
