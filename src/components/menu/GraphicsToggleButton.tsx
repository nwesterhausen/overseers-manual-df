import { Button, OverlayTrigger, Tooltip } from 'solid-bootstrap';
import { TbPhoto, TbPhotoOff } from 'solid-icons/tb';
import { Component } from 'solid-js';
import { useSettingsContext } from '../../providers/SettingsProvider';

const GraphicsToggleButton: Component<{ disabled: boolean }> = (props) => {
  const [currentSettings, { toggleDisplayGraphics }] = useSettingsContext();
  return (
    <OverlayTrigger
      placement='bottom'
      overlay={<Tooltip>{currentSettings.displayGraphics ? 'Hide any graphics' : 'Display any graphics'}</Tooltip>}>
      <Button
        disabled={props.disabled}
        onClick={toggleDisplayGraphics}
        variant='outline-secondary'
        class='border-0 p-1 ms-1'>
        {currentSettings.displayGraphics ? <TbPhotoOff size={'1.5rem'} /> : <TbPhoto size={'1.5rem'} />}
      </Button>
    </OverlayTrigger>
  );
};

export default GraphicsToggleButton;
