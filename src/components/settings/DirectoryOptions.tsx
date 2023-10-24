import { Component } from 'solid-js';
import { useDirectoryProvider } from '../../providers/DirectoryProvider';

const DirectoryOptions: Component = () => {
  const directoryContext = useDirectoryProvider();
  return (
    <div>
      <div class='flex flex-row gap-3'>
        <span class='label'>Current Dwarf Fortress Directory:</span>
        <input
          type='text'
          placeholder={directoryContext.currentDirectory().path.join('/')}
          class='input input-primary input-ghost grow'
          disabled
        />
      </div>
      <div class='flex justify-around my-2'>
        <button
          class='btn btn-sm btn-error btn-outline'
          onClick={async () => {
            directoryContext.resetDirectory();
          }}>
          Clear Dwarf Fortress Directory
        </button>
        <button
          class='btn btn-sm btn-primary'
          onClick={async () => {
            directoryContext.activateManualDirectorySelection();
          }}>
          Change Dwarf Fortress Directory
        </button>
      </div>
    </div>
  );
};

export default DirectoryOptions;
