import {
  Button,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTermHelpText,
  DescriptionListTermHelpTextButton,
  PageSection,
  Popover,
} from "@patternfly/react-core";

import PlusCircleIcon from "@patternfly/react-icons/dist/esm/icons/plus-circle-icon";
import { formatDate } from "@app/utils/utils";
import TrustRootNotFound from "../TrustRootNotFound";
import type { TrustRootKind } from "../../data/TrustRoots.data";

interface TrustRootInfoTabProps {
  trustRoot?: TrustRootKind;
}

const TrustRootInfoTab: React.FC<TrustRootInfoTabProps> = ({ trustRoot }) => {
  return trustRoot ? (
    <>
      <PageSection>
        <DescriptionList>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>
              <Popover headerContent={<div>ID</div>} bodyContent={<div>Additional info</div>}>
                <DescriptionListTermHelpTextButton> ID </DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>{trustRoot.id}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>
              <Popover headerContent={<div>Source</div>} bodyContent={<div>Additional source info</div>}>
                <DescriptionListTermHelpTextButton> Source </DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>
              <a href="#">{trustRoot.source}</a>
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>
              <Popover headerContent={<div>Last Updated</div>} bodyContent={<div>Additional info</div>}>
                <DescriptionListTermHelpTextButton> Last Updated </DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>{formatDate(trustRoot.lastUpdated)}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>
              <Popover headerContent={<div>Type</div>} bodyContent={<div>Additional info</div>}>
                <DescriptionListTermHelpTextButton> Type </DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>
              <Button variant="link" isInline icon={<PlusCircleIcon />}>
                {trustRoot.type}
              </Button>
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>
              <Popover headerContent={<div>Certificates</div>} bodyContent={<div>Additional info</div>}>
                <DescriptionListTermHelpTextButton> Certificates </DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>{trustRoot.certificates.length} Certificate(s)</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>
              <Popover headerContent={<div>TUF Metadata</div>} bodyContent={<div>Additional info</div>}>
                <DescriptionListTermHelpTextButton> TUF Metadata </DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>{trustRoot.tufMetadata.length} Metadata File(s)</DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </PageSection>
    </>
  ) : (
    <TrustRootNotFound />
  );
};

export default TrustRootInfoTab;
