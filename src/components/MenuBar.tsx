import { Button, OverlayTrigger, Tooltip } from 'solid-bootstrap';
import { IoCogSharp, IoFolderOpenSharp, IoRefreshSharp } from 'solid-icons/io';
import { Component } from 'solid-js';
import { useDirectoryProvider } from '../providers/DirectoryProvider';
import { STS_IDLE, STS_LOADING, STS_PARSING, useRawsProvider } from '../providers/RawsProvider';
import SearchBox from './SearchBox';
import ThemeChangeButton from './ThemeChangeButton';

const MenuBar: Component = () => {
  const directoryContext = useDirectoryProvider();
  const rawsContext = useRawsProvider();

  return (
    <div class='hstack gap-2 px-2 menu-bar'>
      <div class='me-auto'>
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

      <div class='hstack gap-2 px-2'>
        <SearchBox />
      </div>

      <div class='ms-auto'>
        <ThemeChangeButton />

        <OverlayTrigger placement='auto' overlay={<Tooltip>Settings</Tooltip>}>
          <Button disabled class='border-0 p-1' variant='outline-secondary' onClick={() => window.alert('hi')}>
            <IoCogSharp size={'1.5rem'} />
          </Button>
        </OverlayTrigger>
      </div>
    </div>
  );
};

export default MenuBar;
