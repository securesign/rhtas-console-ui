import { dump } from "js-yaml";
import Link from "next/link";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { type RekorSchema } from "rekor";
import { decodex509 } from "../Template/x509/decode";
import { Panel } from "@patternfly/react-core";

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
        <Link href={`/?hash=${hashedRekord.data.hash?.algorithm}:${hashedRekord.data.hash?.value}`} passHref>
          Hash
        </Link>
      </h5>
      <SyntaxHighlighter language="text" style={atomDark}>
        {`${hashedRekord.data.hash?.algorithm}:${hashedRekord.data.hash?.value}`}
      </SyntaxHighlighter>

      <h5 style={{ margin: "1em auto" }}>Signature</h5>
      <SyntaxHighlighter language="text" style={atomDark}>
        {hashedRekord.signature.content ?? ""}
      </SyntaxHighlighter>

      <h5 style={{ margin: "1em auto" }}>{publicKey.title}</h5>
      <SyntaxHighlighter language="yaml" style={atomDark}>
        {publicKey.content}
      </SyntaxHighlighter>
    </Panel>
  );
}
