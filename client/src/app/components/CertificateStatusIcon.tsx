import React from "react";

import { Icon, type IconComponentProps } from "@patternfly/react-core";

import { BanIcon, CheckCircleIcon, MinusIcon, TimesCircleIcon, WarningTriangleIcon } from "@patternfly/react-icons";

interface ICertificateStatusIconProps {
  status: string;
  iconProps?: IconComponentProps;
}

export const CertificateStatusIcon: React.FC<ICertificateStatusIconProps> = ({ status, iconProps }) => {
  const statusLowerCase = status.toLocaleLowerCase();

  if (statusLowerCase === "active" || statusLowerCase === "valid") {
    return (
      <Icon status="success" {...iconProps}>
        <CheckCircleIcon />
      </Icon>
    );
  } else if (statusLowerCase === "expiring") {
    return (
      <Icon status="warning" {...iconProps}>
        <WarningTriangleIcon />
      </Icon>
    );
  } else if (statusLowerCase === "revoked") {
    return (
      <Icon status="info" {...iconProps}>
        <BanIcon />
      </Icon>
    );
  } else if (statusLowerCase === "expired") {
    return (
      <Icon status="danger" {...iconProps}>
        <TimesCircleIcon />
      </Icon>
    );
  } else {
    return (
      <Icon size="xl">
        <MinusIcon />
      </Icon>
    );
  }
};
