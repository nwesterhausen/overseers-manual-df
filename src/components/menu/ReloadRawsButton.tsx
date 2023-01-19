import { Button, OverlayTrigger, Tooltip } from 'solid-bootstrap';
import { IoRefreshSharp } from 'solid-icons/io';
import { Component } from 'solid-js';
import { useRawsProvider } from '../../providers/RawsProvider';

const ReloadRawsButton: Component<{ disabled: boolean }> = (props) => {
  const rawsContext = useRawsProvider();
  return (
    <OverlayTrigger placement='auto' overlay={<Tooltip id='refresh-button-tooltip'>Re-read Raw Modules</Tooltip>}>
      <Button
        class='border-0 p-1'
        variant='outline-secondary'
        disabled={props.disabled}
        onClick={() => rawsContext.setLoadRaws(true)}>
        <IoRefreshSharp size={'1.5rem'} />
      </Button>
    </OverlayTrigger>
  );
};

export default ReloadRawsButton;
