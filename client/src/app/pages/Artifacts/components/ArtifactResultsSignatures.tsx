import { Content, ContentVariants, DataList } from "@patternfly/react-core";
import { ArtifactSignatureItem } from "./ArtifactSignatureItem";

export const ArtifactResultsSignatures = ({ signatures }: { signatures: string[] }) => {
  console.table(signatures);

  return (
    <>
      <Content component={ContentVariants.h6} style={{ margin: "2em auto 1.5em", overflowY: "hidden" }}>
        Signatures
      </Content>
      <DataList aria-label="Signatures list" isCompact>
        {signatures.map((signature, id) => (
          <ArtifactSignatureItem signature={signature} key={id} />
        ))}
      </DataList>
    </>
  );
};
