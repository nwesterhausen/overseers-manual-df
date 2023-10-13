import { createContextProvider } from '@solid-primitives/context';
import { Event, listen } from '@tauri-apps/api/event';
import { OpenDialogOptions, open as tauriOpen } from '@tauri-apps/plugin-dialog';
import { readDir } from '@tauri-apps/plugin-fs';
import { createMemo, createResource, createSignal } from 'solid-js';
import { splitPathAgnostically } from '../lib/Utils';
import { PATH_STRING, PATH_TYPE, get as getFromStore, getSymbol, init as initStore, set } from '../settings';

export const DIR_NONE = Symbol('none'),
  DIR_DF = Symbol('df'),
  DIR_SAVE = Symbol('saves'),
  DIR_RAWS = Symbol('raws');

export interface DirectorySelection {
  path: string[];
  type: symbol;
}

/**
 * Dialog options for the select directory window
 */
const openDialogOptions: OpenDialogOptions = {
  title: 'Select your Dwarf Fortress install Directory',
};

export const [DirectoryProvider, useDirectoryProvider] = createContextProvider(() => {
  // Signal to open the directory open dialog, change to true to open it
  const [activateManualDirectorySelection, setManualDirectorySelection] = createSignal(false);
  // Helper function to reset manual selection
  const resetManualDirectorySelection = () => setManualDirectorySelection(false);

  // Array to just hold recently selected directories and our evaluations of them
  const [directoryHistory, setDirectoryHistory] = createSignal<DirectorySelection[]>([]);

  // Helper accessor for 'current' directory
  const currentDirectory = createMemo(() => {
    if (directoryHistory().length === 0) {
      return {
        path: [],
        type: DIR_NONE,
      };
    }
    console.info(`Current directory ${directoryHistory()[0].path.join('/')}`);
    return directoryHistory()[0];
  });

  // This resource calls the Tauri API to open a file dialog
  createResource(
    activateManualDirectorySelection,
    async () => {
      try {
        const folderPath = await tauriOpen({
          ...openDialogOptions,
          multiple: false,
          directory: true,
        });
        processDirectoryPath(folderPath);

        // Re-arm the directory selection action after 50ms
        setTimeout(resetManualDirectorySelection, 50);
      } catch (error) {
        console.debug(error);
        setManualDirectorySelection(false);
        return [];
      }
    },
    {
      initialValue: [],
    },
  );

  // Listen for a file being dropped on the window to change the save location.
  listen('tauri://file-drop', (event: Event<string[]>) => {
    if (event.payload.length > 0) {
      const file = event.payload[0];
      if (file.endsWith('gamelog.txt')) {
        processDirectoryPath(splitPathAgnostically(file).slice(0, -1).join('/'));
      }
    }
  });

  async function processDirectoryPath(directoryPath: string | string[]) {
    console.debug(directoryPath);

    // Split the path into an array of strings
    let splitPath: string[];
    if (Array.isArray(directoryPath)) {
      splitPath = splitPathAgnostically(directoryPath[0]);
    } else {
      splitPath = splitPathAgnostically(directoryPath);
    }

    // If we have a zero length path array, quit early
    if (splitPath.length === 0) {
      return;
    }

    let dirType: symbol = DIR_NONE;

    // Determine what kind of path it is
    try {
      // Use the tauri fs.readDir API
      const dirContents = await readDir(splitPath.join('/'), { recursive: true });

      console.debug(`Read ${dirContents.length} children of ${splitPath.join('/')}`);

      const hasGamelogTxt = dirContents.filter((v) => v.name === 'gamelog.txt').length > 0;
      if (hasGamelogTxt) {
        console.debug('Matched a gamelog.txt file');
        dirType = DIR_DF;
      } else {
        dirType = DIR_NONE;
      }
    } catch (e) {
      console.error(e);
      return;
    }

    // We have to already have determined the path type by here..
    setDirectoryHistory([
      {
        path: splitPath,
        type: dirType,
      },
      ...directoryHistory(),
    ]);

    // Save to store
    set(PATH_STRING, splitPath.join('/'));
    set(PATH_TYPE, dirType.toString());
  }

  // Setting up the settings storage.
  initStore()
    // After its setup, try to get the save directory from the settings
    .then(() => {
      return getFromStore(PATH_STRING);
    })
    // With the save folder, set it as the drag and drop path, since that's the path we set programmatically
    // and let the effects do the rest.
    .then((val) => {
      const value = '' + val;
      console.log('Setting initial value for directory to', value);
      const dirPath = splitPathAgnostically(value);
      setDirectoryHistory([{ path: dirPath, type: DIR_NONE }]);
      return getSymbol(PATH_TYPE);
    })
    .then((dirType) => {
      if (directoryHistory().length > 0 && dirType !== DIR_NONE) {
        setDirectoryHistory([{ path: directoryHistory()[0].path, type: dirType }]);
      } else {
        console.log('Not updating history from store:', directoryHistory().length, dirType);
      }
    })
    .catch((err) => {
      console.debug('Error when init the store!');
      console.debug(err);
    });

  return {
    activateManualDirectorySelection: setManualDirectorySelection,
    currentDirectory,
  };
});
