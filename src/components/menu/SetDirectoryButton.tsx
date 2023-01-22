import { Button, OverlayTrigger, Tooltip } from 'solid-bootstrap';
import { IoFolderOpenSharp } from 'solid-icons/io';
import { Component } from 'solid-js';
import { useDirectoryProvider } from '../../providers/DirectoryProvider';

const SetDirectoryButton: Component<{ disabled: boolean }> = (props) => {
  const directoryContext = useDirectoryProvider();
  return (
    <OverlayTrigger
      placement='auto'
      overlay={
        <Tooltip>{directoryContext.currentDirectory().path.length > 0 ? 'Change ' : 'Set '} game directory</Tooltip>
      }>
      <Button
        class='border-0 p-1'
        disabled={props.disabled}
        variant='outline-secondary'
        onClick={() => {
          directoryContext.activateManualDirectorySelection(true);
        }}>
        <IoFolderOpenSharp size={'1.5rem'} />
      </Button>
    </OverlayTrigger>
  );
};

export default SetDirectoryButton;
