import { Button, OverlayTrigger, Tooltip } from 'solid-bootstrap';
import { IoCogSharp } from 'solid-icons/io';
import { Component } from 'solid-js';
import { useSettingsContext } from '../../providers/SettingsProvider';

const OpenSettingsButton: Component = () => {
  const [settings, { handleOpen }] = useSettingsContext();
  return (
    <OverlayTrigger placement='auto' overlay={<Tooltip>Settings</Tooltip>}>
      <Button class='border-0 p-1' variant='outline-secondary' onClick={handleOpen}>
        <IoCogSharp size={'1.5rem'} />
      </Button>
    </OverlayTrigger>
  );
};

export default OpenSettingsButton;
