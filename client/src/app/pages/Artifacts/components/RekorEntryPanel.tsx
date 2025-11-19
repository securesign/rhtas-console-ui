import type { RekorEntry } from "@app/client";
import { Button, CodeBlock, CodeBlockAction, CodeBlockCode, Content, Panel } from "@patternfly/react-core";
import { ExternalLinkAltIcon } from "@patternfly/react-icons";

export const RekorEntryPanel = ({ rekorEntry }: { rekorEntry: RekorEntry | undefined }) => {
  const rekorEntryLabel = rekorEntry ? `Entry #${rekorEntry.logIndex} (UUID ${rekorEntry.uuid})` : "No Rekor entry";

  const codeBlockActions = rekorEntry ? (
    <>
      <CodeBlockAction>
        <Button
          component="a"
          variant="link"
          href={`/rekor-search?uuid=${rekorEntry.uuid}`}
          target="_blank"
          rel="noopener noreferrer"
          icon={<ExternalLinkAltIcon />}
          iconPosition="right"
          aria-label={`rekorlink`}
        >
          Open in Rekor Search
        </Button>
      </CodeBlockAction>
    </>
  ) : null;

  return (
    <Panel>
      <Content>Rekor Entry</Content>
      <CodeBlock actions={codeBlockActions}>
        <CodeBlockCode id="code-content">{rekorEntryLabel}</CodeBlockCode>
      </CodeBlock>
    </Panel>
  );
};
