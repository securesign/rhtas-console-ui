import type React from "react";

import { certificates, columns } from "./Certificates.data";
import { CertificatesPage } from "./CertificatesPage";

export const Certificates: React.FC = () => {
  return <CertificatesPage certificates={certificates} columns={columns} />;
};
