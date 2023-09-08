import { Component } from 'solid-js';
import { useDirectoryProvider } from '../providers/DirectoryProvider';

const DFDirectoryNotSet: Component = () => {
  const directoryContext = useDirectoryProvider();

  return (
    <div class='join join-vertical gap-4'>
      <h2>No valid path is set!</h2>
      <p>
        To set the path to your Dwarf Fortress game, drag and drop the <code>gamelog.txt</code> file from the dwarf
        fortress directory onto this window, or use a button below to pull up a folder selection dialog.
      </p>
      <p>
        Valid choices for a directory are the Dwarf Fortress folder, where the <code>gamelog.txt</code> file exists or
        the equivalent of <code>data/saves</code> from the Dwarf Fortress directory (where each subdirectory of the
        chosen directory is a save file).
      </p>
      <div class='join gap-3 p-3'>
        <button
          class='btn btn-primary'
          onClick={() => {
            directoryContext.activateManualDirectorySelection(true);
          }}>
          Set Directory
        </button>
      </div>
    </div>
  );
};

export default DFDirectoryNotSet;
