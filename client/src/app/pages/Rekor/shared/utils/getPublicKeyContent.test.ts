import { describe, it, expect } from "vitest";
import "@app/dayjs";
import { trustTargetCertificatesMock } from "@app/queries/mocks/trust.mock";
import { getPublicKeyContent } from "./spec";

// Uses a real certificate (no x509 mock) so YAML serialization of the decoded certificate is exercised
const intermediate = trustTargetCertificatesMock.data.find((cert) => cert.target === "fulcio_v1.crt.pem")!;

describe("getPublicKeyContent", () => {
  it("renders a decoded certificate as YAML", () => {
    const content = getPublicKeyContent({
      type: "hashedrekord",
      spec: { signature: { publicKey: { content: window.btoa(intermediate.pem) } } },
    });

    expect(content).toContain("Issuer: O=sigstore.dev, CN=sigstore");
    expect(content).toContain("Subject: O=sigstore.dev, CN=sigstore-intermediate");
  });
});
