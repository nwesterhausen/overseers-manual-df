import { Button, OverlayTrigger, Tooltip } from 'solid-bootstrap';
import { HiSolidViewGrid, HiSolidViewList } from 'solid-icons/hi';
import { Component } from 'solid-js';
import { useSettingsContext } from '../../providers/SettingsProvider';

const DisplayStyleButton: Component<{ disabled: boolean }> = (props) => {
  const [currentSettings, { toggleDisplayGrid }] = useSettingsContext();
  return (
    <OverlayTrigger
      placement='bottom'
      overlay={
        <Tooltip>
          {currentSettings.displayStyleGrid ? 'Display using accordion list' : 'Display using card grid'}
        </Tooltip>
      }>
      <Button
        disabled={props.disabled}
        onClick={toggleDisplayGrid}
        variant='outline-secondary'
        class='border-0 p-1 ms-1'>
        {currentSettings.displayStyleGrid ? <HiSolidViewList size={'1.5rem'} /> : <HiSolidViewGrid size={'1.5rem'} />}
      </Button>
    </OverlayTrigger>
  );
};

export default DisplayStyleButton;
