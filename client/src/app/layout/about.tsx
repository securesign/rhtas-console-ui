import type React from "react";

import { AboutModal, Content, ContentVariants } from "@patternfly/react-core";
import spacing from "@patternfly/react-styles/css/utilities/Spacing/spacing";

import ENV from "@app/env";
import useBranding from "@app/hooks/useBranding";
import { useIsDarkMode } from "@app/hooks/useDarkMode.tsx";

interface IButtonAboutAppProps {
  isOpen: boolean;
  onClose: () => void;
}

const TRANSPARENT_1x1_GIF = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw== ";

export const AboutApp: React.FC<IButtonAboutAppProps> = ({ isOpen, onClose }) => {
  const { about } = useBranding();
  const isDark = useIsDarkMode();

  // NOTE: A masthead-logo-dark.svg file exists.
  // Toggle files based on theme.
  const logoSrc = about.imageSrc
    ? isDark
      ? about.imageSrc.replace(".svg", "-dark.svg")
      : about.imageSrc
    : TRANSPARENT_1x1_GIF;

  return (
    <AboutModal
      isOpen={isOpen}
      onClose={onClose}
      productName={about.displayName}
      brandImageAlt="Logo"
      brandImageSrc={logoSrc}
      trademark={`COPYRIGHT © 2025, ${new Date().getFullYear()}`}
    >
      <Content>
        <Content component={ContentVariants.p}>
          {about.displayName} is a web-based UI for interacting with the Red Hat Trusted Artifact Signer (TAS)
          ecosystem. It provides user-friendly workflows for retrieving, verifying, and monitoring signed software
          artifacts, integrating with Sigstore services like Rekor, Fulcio, and TUF.
        </Content>

        {about.documentationUrl ? (
          <Content component={ContentVariants.p}>
            For more information refer to{" "}
            <Content component={ContentVariants.a} href={about.documentationUrl} target="_blank">
              {about.displayName} documentation
            </Content>
          </Content>
        ) : null}
      </Content>
      <Content className={spacing.pyXl}>
        <Content>
          <Content component="dl">
            <Content component="dt">Version</Content>
            <Content component="dd">{ENV.VERSION}</Content>
          </Content>
        </Content>
      </Content>
    </AboutModal>
  );
};
