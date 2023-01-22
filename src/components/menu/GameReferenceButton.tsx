import { Button, Modal, OverlayTrigger, Tooltip } from 'solid-bootstrap';
import { IoHelpCircleSharp } from 'solid-icons/io';
import { Component, createSignal } from 'solid-js';
import ZoneOverview from '../quickReference/ZoneOverview';

const GameReferenceButton: Component<{ disabled: boolean }> = (props) => {
  const [showHelp, setShowHelp] = createSignal(false);
  const handleCloseHelp = () => setShowHelp(false);
  const handleOpenHelp = () => setShowHelp(true);
  return (
    <>
      <OverlayTrigger placement='auto' overlay={<Tooltip>Quick Reference</Tooltip>}>
        <Button disabled={props.disabled} class='border-0 p-1' variant='outline-secondary' onClick={handleOpenHelp}>
          <IoHelpCircleSharp size={'1.5rem'} />
        </Button>
      </OverlayTrigger>

      <Modal fullscreen onHide={handleCloseHelp} show={showHelp()}>
        <Modal.Header closeButton>Quick Game Reference</Modal.Header>
        <Modal.Body class='px-3'>
          <ZoneOverview />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default GameReferenceButton;
