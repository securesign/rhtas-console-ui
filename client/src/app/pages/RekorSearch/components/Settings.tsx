import { useRekorBaseUrl } from "@app/pages/RekorSearch/api/context";
import {
  Button,
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  Popover,
  TextInput,
  ValidatedOptions,
} from "@patternfly/react-core";
import { ExclamationCircleIcon, HelpIcon } from "@patternfly/react-icons";
import styles from "@patternfly/react-styles/css/components/Form/form";
import { type FormEvent, useCallback, useState } from "react";
import { validateUrl } from "../utils/validateUrl";

export function Settings({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [baseUrl, setBaseUrl] = useRekorBaseUrl();
  const [localBaseUrl, setLocalBaseUrl] = useState(baseUrl);
  const [showValidation, setShowValidation] = useState(false);

  const handleChangeBaseUrl = useCallback((e: FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.value.length === 0) {
      setLocalBaseUrl(undefined);
    } else {
      setLocalBaseUrl(e.currentTarget.value);
    }
  }, []);

  const handleClose = useCallback(() => {
    setLocalBaseUrl(baseUrl);
    setShowValidation(false);
    onClose();
  }, [baseUrl, onClose]);

  const onSave = useCallback(() => {
    if (!validateUrl(localBaseUrl)) {
      setShowValidation(true);
      return;
    } else {
      setBaseUrl(localBaseUrl);
      setShowValidation(false);
    }

    onClose();
  }, [localBaseUrl, onClose, setBaseUrl]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave();
  };

  return (
    <Modal variant={ModalVariant.small} isOpen={open} onClose={handleClose} data-testid="settings-modal">
      <ModalHeader>Settings</ModalHeader>
      <ModalBody>
        <Form id="settings-form" onSubmit={handleSubmit}>
          <FormGroup
            label="Override Rekor Endpoint"
            labelHelp={
              <Popover bodyContent={"Specify your private Rekor endpoint URL."}>
                <Button
                  variant="plain"
                  type="button"
                  aria-label="More info for endpoint field"
                  onClick={(e) => e.preventDefault()}
                  aria-describedby="form-group-label-info"
                  data-testid={"rekor-endpoint-help-button"}
                  className={styles.formGroupLabelHelp}
                >
                  <HelpIcon />
                </Button>
              </Popover>
            }
            isRequired
            fieldId="rekor-endpoint-override"
          >
            <TextInput
              value={localBaseUrl ?? baseUrl}
              type="text"
              onChange={handleChangeBaseUrl}
              placeholder={baseUrl ?? "https://private.rekor.example.com"}
              label={"name"}
              aria-label="override rekor endpoint"
              id={"rekor-endpoint-override"}
              validated={showValidation ? ValidatedOptions.error : undefined}
              aria-invalid={showValidation}
              data-testid={"rekor-endpoint-override"}
              isRequired
            />
            {showValidation && (
              <FormHelperText>
                <HelperText>
                  <HelperTextItem icon={<ExclamationCircleIcon />} variant={"error"}>
                    To continue, specify an endpoint in https://xxxx format
                  </HelperTextItem>
                </HelperText>
              </FormHelperText>
            )}
          </FormGroup>
          <button type="submit" style={{ display: "none" }}></button>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button key="confirm" variant="primary" onClick={onSave} data-testid={"settings-confirm-button"}>
          Confirm
        </Button>
        <Button key="cancel" variant="link" onClick={handleClose} data-testid={"settings-close-button"}>
          Cancel
        </Button>
        ,
      </ModalFooter>
    </Modal>
  );
}
