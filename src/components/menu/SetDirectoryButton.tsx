import { IoFolderOpenSharp } from 'solid-icons/io';
import { Component } from 'solid-js';
import { useDirectoryProvider } from '../../providers/DirectoryProvider';

const SetDirectoryButton: Component<{ disabled: boolean }> = (props) => {
  const directoryContext = useDirectoryProvider();
  return (
    <div
      class='tooltip tooltip-right'
      data-tip={(directoryContext.currentDirectory().path.length > 0 ? 'Change ' : 'Set ') + ' game directory'}>
      <button
        class='btn btn-ghost btn-sm btn-circle fill-secondary'
        classList={{ disabled: props.disabled }}
        onClick={() => {
          directoryContext.activateManualDirectorySelection(true);
        }}>
        <IoFolderOpenSharp size={'1.5rem'} />
      </button>
    </div>
  );
};

export default SetDirectoryButton;
