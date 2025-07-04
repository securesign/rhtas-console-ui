import { Icon } from "@patternfly/react-core";
import * as React from "react";
import CheckCircleIcon from "@patternfly/react-icons/dist/esm/icons/check-circle-icon";
import TimesCircleIcon from "@patternfly/react-icons/dist/esm/icons/times-circle-icon";
import { MinusIcon } from "@patternfly/react-icons";

interface StatusIconProps {
  status: string;
}

const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
  if (status === "success") {
    return (
      <Icon size="xl" status="success">
        <CheckCircleIcon />
      </Icon>
    );
  } else if (status === "error") {
    return (
      <Icon size="xl" status="danger">
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

export default StatusIcon;
