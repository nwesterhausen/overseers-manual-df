import { Button, OverlayTrigger, Tooltip } from 'solid-bootstrap';
import { AiTwotoneFolderAdd } from 'solid-icons/ai';
import { HiOutlineRefresh } from 'solid-icons/hi';
import { Component, Show } from 'solid-js';
import { useDirectoryProvider } from '../providers/DirectoryProvider';
import { STS_IDLE, useRawsProvider } from '../providers/RawsProvider';

const MenuBar: Component = () => {
  const directoryContext = useDirectoryProvider();
  const rawsContext = useRawsProvider();

  return (
    <div class='hstack gap-2 px-2'>
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
        <OverlayTrigger
          placement='auto'
          overlay={
            <Tooltip>
              {directoryContext.directoryPath().length > 0 ? 'Change ' : 'Set '}Dwarf Fortress Game Directory
            </Tooltip>
          }>
          <Button
            variant='secondary'
            onClick={() => {
              directoryContext.setManualFolderSelect(true);
            }}>
            <AiTwotoneFolderAdd />
          </Button>
        </OverlayTrigger>
      </div>

      <Show when={rawsContext.parsingStatus() === STS_IDLE}>
        <div>
          <OverlayTrigger placement='auto' overlay={<Tooltip id='refresh-button-tooltip'>Re-read Raw Modules</Tooltip>}>
            <Button variant='secondary' onClick={() => rawsContext.setLoadRaws(true)}>
              <HiOutlineRefresh />
            </Button>
          </OverlayTrigger>
        </div>
      </Show>
    </div>
  );
};

export default MenuBar;
