import type { ParsedCertificate } from "@app/queries/artifacts.view-model";
import type { TreeViewDataItem } from "@patternfly/react-core";

export function buildCertificateTree(certificateChain: ParsedCertificate[]): TreeViewDataItem[] {
  return certificateChain.map((cert, index) => {
    const baseId = `cert-${index}`;

    return {
      id: baseId,
      name: cert.role,
      children: [
        { id: `${baseId}-subject`, name: `subject: ${cert.subject}` },
        { id: `${baseId}-issuer`, name: `issuer: ${cert.issuer}` },
        { id: `${baseId}-notBefore`, name: `notBefore: ${cert.notBefore}` },
        { id: `${baseId}-notAfter`, name: `notAfter: ${cert.notAfter}` },
        { id: `${baseId}-isCa`, name: `isCa: ${cert.isCa}` },
        { id: `${baseId}-serial`, name: `serialNumber: ${cert.serialNumber}` },
        {
          id: `${baseId}-sans`,
          name: "sans",
          children: cert.sans.map((san, i) => ({
            id: `${baseId}-sans-${i}`,
            name: san,
          })),
        },
        {
          id: `${baseId}-pem`,
          name: "pem",
          children: [
            {
              id: `${baseId}-pem-text`,
              name: cert.pem,
            },
          ],
        },
      ],
    };
  });
}
