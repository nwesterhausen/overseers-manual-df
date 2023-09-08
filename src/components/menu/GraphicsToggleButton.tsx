import { TbPhoto, TbPhotoOff } from 'solid-icons/tb';
import { Component } from 'solid-js';
import { useSettingsContext } from '../../providers/SettingsProvider';

const GraphicsToggleButton: Component<{ disabled: boolean }> = (props) => {
  const [currentSettings, { toggleDisplayGraphics }] = useSettingsContext();
  return (
    <div class='tooltip tooltip-bottom' data-tip={currentSettings.displayGraphics ? 'Hide graphics' : 'Show graphics'}>
      <button
        onClick={toggleDisplayGraphics}
        class='btn btn-sm btn-ghost btn-circle  text-secondary'
        classList={{ disabled: props.disabled }}>
        {currentSettings.displayGraphics ? <TbPhotoOff size={'1.5rem'} /> : <TbPhoto size={'1.5rem'} />}
      </button>
    </div>
  );
};

export default GraphicsToggleButton;
