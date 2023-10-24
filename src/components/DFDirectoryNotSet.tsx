import { Component } from 'solid-js';
import { useDirectoryProvider } from '../providers/DirectoryProvider';

const DFDirectoryNotSet: Component = () => {
  const directoryContext = useDirectoryProvider();

  return (
    <div class='hero min-h-screen bg-base-200'>
      <div class='hero-content flex-col md:flex-row'>
        <img src='/icon.png' class='max-w-sm rounded-lg shadow-2xl shadow-primary' />
        <div>
          <h1 class='text-5xl font-bold'>Overseer's Reference Manual</h1>
          <p class='py-6'>
            Welcome! This is a utility to help you be informed when making decisions in Dwarf Fortress. It is currently
            in development, and more features will be added over time. Before it can do anything, you need to set the
            path to your Dwarf Fortress game.
          </p>
          <p>
            To set the path to your Dwarf Fortress game, drag and drop the <code>gamelog.txt</code> file from the dwarf
            fortress directory onto this window, or use the button below to pull up a folder selection dialog.
          </p>
          <div class='float-right'>
            <button
              class='btn btn-primary'
              onClick={() => {
                directoryContext.activateManualDirectorySelection(true);
              }}>
              Set Directory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DFDirectoryNotSet;
