import { IoCogSharp } from 'solid-icons/io';
import { Component } from 'solid-js';
import { useSettingsContext } from '../../providers/SettingsProvider';

const OpenSettingsButton: Component = () => {
  const [_settings, { handleOpen }] = useSettingsContext();
  return (
    <div class='tooltip tooltip-left' data-tip='Open Settings'>
      <button class='btn btn-sm btn-circle btn-ghost fill-secondary' onClick={handleOpen}>
        <IoCogSharp size={'1.5rem'} />
      </button>
    </div>
  );
};

export default OpenSettingsButton;
