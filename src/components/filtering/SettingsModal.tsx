import { Modal } from "solid-bootstrap";
import { Component } from "solid-js";
import { useSettingsContext } from "../../providers/SettingsProvider";

const SettingsModal: Component = () => {
    const [settings, { handleClose }] = useSettingsContext();

    return (
        <Modal fullscreen onHide={handleClose} show={settings.show}>
            <Modal.Header closeButton>Settings</Modal.Header>
        </Modal>
    )
}

export default SettingsModal;