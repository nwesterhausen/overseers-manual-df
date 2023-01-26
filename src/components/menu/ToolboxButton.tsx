import { Dropdown, Modal, OverlayTrigger, Tooltip } from 'solid-bootstrap';
import { FaSolidToolbox } from 'solid-icons/fa';
import { Component, createSignal } from 'solid-js';
import AnnouncementsEditor from '../AnnouncementsEditor';
import ZoneOverview from '../quickReference/ZoneOverview';

const ToolboxButton: Component<{ disabled: boolean }> = (props) => {
  const [showZonesHelp, setShowZonesHelp] = createSignal(false);
  const handleCloseZonesHelp = () => setShowZonesHelp(false);
  const handleOpenZonesHelp = () => setShowZonesHelp(true);
  const [showAnnouncements, setShowAnnouncements] = createSignal(false);
  const handleCloseAnnouncements = () => setShowAnnouncements(false);
  const handleOpenAnnouncements = () => setShowAnnouncements(true);
  return (
    <>
      <OverlayTrigger placement='auto' overlay={<Tooltip>Overseer's Toolbox</Tooltip>}>
        <Dropdown autoClose='outside'>
          <Dropdown.Toggle
            variant='outline-secondary'
            class='border-0 p-1 ms-1'
            id='dropdown-basic'
            disabled={props.disabled}>
            <FaSolidToolbox size={'1.5rem'} />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href='#' onClick={handleOpenZonesHelp}>
              Zones Reference
            </Dropdown.Item>
            <Dropdown.Item href='#' onClick={handleOpenAnnouncements}>
              Announcements.txt Editor
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </OverlayTrigger>

      <Modal fullscreen onHide={handleCloseZonesHelp} show={showZonesHelp()}>
        <Modal.Header closeButton>Quick Game Reference</Modal.Header>
        <Modal.Body class='px-3'>
          <ZoneOverview />
        </Modal.Body>
      </Modal>
      <Modal fullscreen onHide={handleCloseAnnouncements} show={showAnnouncements()}>
        <Modal.Header closeButton>Announcements.txt Editor</Modal.Header>
        <Modal.Body class='px-3'>
          <AnnouncementsEditor />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ToolboxButton;
