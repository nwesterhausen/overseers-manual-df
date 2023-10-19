import { IoGridOutline, IoListOutline } from 'solid-icons/io';
import { Component } from 'solid-js';
import { useSettingsContext } from '../../providers/SettingsProvider';

const DisplayStyleButton: Component<{ disabled: boolean }> = (props) => {
  const [currentSettings, { toggleLayoutAsGrid }] = useSettingsContext();
  return (
    <div
      class='tooltip tooltip-bottom'
      data-tip={currentSettings.layoutAsGrid ? 'Display using accordion list' : 'Display using card grid'}>
      <button
        classList={{ disabled: props.disabled }}
        class='btn btn-sm btn-ghost btn-circle  text-secondary'
        onclick={toggleLayoutAsGrid}>
        {currentSettings.layoutAsGrid ? <IoListOutline size={'1.5rem'} /> : <IoGridOutline size={'1.5rem'} />}
      </button>
    </div>
  );
};

export default DisplayStyleButton;
