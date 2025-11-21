import { Card, CardBody, CardTitle, TreeView } from "@patternfly/react-core";
import { buildCertificateTree } from "../utils/helpers";
import type { ParsedCertificate } from "@app/queries/artifacts.view-model";

export const CertificateChain = ({ certificateChain }: { certificateChain: ParsedCertificate[] }) => {
  return (
    <Card style={{ overflow: "visible" }}>
      <CardTitle>Certificate Chain</CardTitle>
      <CardBody>
        <TreeView
          hasAnimations
          hasGuides
          aria-label="Certificate chain"
          data={buildCertificateTree(certificateChain)}
        />
      </CardBody>
    </Card>
  );
};
