import { Button, Modal, OverlayTrigger, Tooltip } from 'solid-bootstrap';
import { IoCogSharp, IoFolderOpenSharp, IoInformationCircleSharp, IoRefreshSharp } from 'solid-icons/io';
import { Component, Show, createSignal } from 'solid-js';
import { useDirectoryProvider } from '../providers/DirectoryProvider';
import { STS_IDLE, STS_LOADING, STS_PARSING, useRawsProvider } from '../providers/RawsProvider';
import ParsedModInfo from './ParsedModInfo';

const MenuBar: Component = () => {
  const directoryContext = useDirectoryProvider();
  const rawsContext = useRawsProvider();

  const [showInfoModal, setShowInfoModal] = createSignal(false);
  const handleHideInfoModal = () => setShowInfoModal(false);
  const handleShowInfoModal = () => setShowInfoModal(true);

  return (
    <div class='hstack gap-2 px-2'>
      <div>
        <OverlayTrigger
          placement='auto'
          overlay={
            <Tooltip>{directoryContext.directoryPath().length > 0 ? 'Change ' : 'Set '} game directory</Tooltip>
          }>
          <Button
            class='border-0 p-1'
            disabled={rawsContext.parsingStatus() === STS_PARSING && rawsContext.parsingStatus() === STS_LOADING}
            variant='outline-primary'
            onClick={() => {
              directoryContext.setManualFolderSelect(true);
            }}>
            <IoFolderOpenSharp size={'1.5rem'} />
          </Button>
        </OverlayTrigger>
      </div>

      <Show when={directoryContext.directoryPath().length > 0}>
        <div>
          <OverlayTrigger
            placement='auto'
            overlay={<Tooltip id='directory-type-details'>Directory set as Dwarf Fortress Directory</Tooltip>}>
            <span
              style={{
                'min-width': '0px',
                width: 'calc(100vw - 12rem)',
                'max-width': `${directoryContext.directoryPath().join('/').length * 10}px`,
                display: 'inline-block',
              }}
              class='btn btn-secondary disabled text-truncate'>
              {directoryContext.directoryPath().join('/')}
            </span>
          </OverlayTrigger>
        </div>
      </Show>

      <div>
        <OverlayTrigger placement='auto' overlay={<Tooltip id='refresh-button-tooltip'>Re-read Raw Modules</Tooltip>}>
          <Button
            class='border-0 p-1'
            variant='outline-success'
            disabled={rawsContext.parsingStatus() !== STS_IDLE}
            onClick={() => rawsContext.setLoadRaws(true)}>
            <IoRefreshSharp size={'1.5rem'} />
          </Button>
        </OverlayTrigger>
      </div>

      <div>
        <OverlayTrigger placement='auto' overlay={<Tooltip>Raw Modules Details</Tooltip>}>
          <Button
            class='border-0 p-1'
            variant='outline-info'
            disabled={rawsContext.parsingStatus() !== STS_IDLE}
            onClick={handleShowInfoModal}>
            <IoInformationCircleSharp size={'1.5rem'} />
          </Button>
        </OverlayTrigger>
      </div>

      <div class='ms-auto'>
        <OverlayTrigger placement='auto' overlay={<Tooltip>Settings</Tooltip>}>
          <Button disabled class='border-0 p-1' variant='outline-warning' onClick={() => window.alert('hi')}>
            <IoCogSharp size={'1.5rem'} />
          </Button>
        </OverlayTrigger>
      </div>

      <Modal dialogClass='modal90w' show={showInfoModal()} onHide={handleHideInfoModal}>
        <Modal.Header closeButton>
          <Modal.Title>Details about the parsed raws</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ParsedModInfo />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MenuBar;
