import { Fragment } from "react";
import { Tab, Tabs, TabTitleText } from "@patternfly/react-core";
import { exampleTrustRoots } from "../data/TrustRoots.data";
import TrustRootMetadataTab from "./DrawerContents/TrustRootMetadataTab";
import TrustRootCertificateTab from "./DrawerContents/TrustRootCertificateTab";
import TrustRootInfoTab from "./DrawerContents/TrustRootInfoTab";

interface TrustRootDrawerContentProps {
  trustRootId: string;
}

const TrustRootsDrawerContent: React.FC<TrustRootDrawerContentProps> = ({ trustRootId }) => {
  const trustRoot = exampleTrustRoots.find((tr) => tr.id === trustRootId);
  return (
    <Fragment>
      <Tabs defaultActiveKey={0} aria-label="Trust roots tabs" role="region">
        <Tab eventKey={0} title={<TabTitleText>Metadata</TabTitleText>} aria-label="Metadata">
          <TrustRootMetadataTab trustRoot={trustRoot} />
        </Tab>
        <Tab eventKey={1} title={<TabTitleText>Certificates</TabTitleText>} aria-label="Certificates">
          <TrustRootCertificateTab trustRoot={trustRoot} />
        </Tab>
        <Tab eventKey={2} title={<TabTitleText>Info</TabTitleText>}>
          <TrustRootInfoTab trustRoot={trustRoot} />
        </Tab>
      </Tabs>
    </Fragment>
  );
};

export { TrustRootsDrawerContent };
