import { IoCogSharp } from 'solid-icons/io';
import { Component } from 'solid-js';

const OpenSettingsButton: Component = () => {
  return (
    <div class='tooltip tooltip-left' data-tip='Open Settings'>
      <button
        class='btn btn-sm btn-circle btn-ghost fill-secondary'
        onClick={() => {
          const dialog = document.getElementById('settingsModal') as HTMLDialogElement;
          dialog.showModal();
        }}>
        <IoCogSharp size={'1.5rem'} />
      </button>
    </div>
  );
};

export default OpenSettingsButton;
