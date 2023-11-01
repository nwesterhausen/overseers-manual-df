import { createContextProvider } from '@solid-primitives/context';
import { Event, listen } from '@tauri-apps/api/event';
import { OpenDialogOptions, open as tauriOpen } from '@tauri-apps/plugin-dialog';
import { readDir } from '@tauri-apps/plugin-fs';
import { createEffect, createMemo, createResource, createSignal } from 'solid-js';
import { splitPathAgnostically } from '../lib/Utils';
import { useSettingsContext } from './SettingsProvider';

export interface DirectorySelection {
  path: string[];
}

/**
 * Dialog options for the select directory window
 */
const openDialogOptions: OpenDialogOptions = {
  title: 'Select your Dwarf Fortress install Directory',
};

export const [DirectoryProvider, useDirectoryProvider] = createContextProvider(() => {
  // Settings which will hold all the information.
  const [settings, { setDirectoryPath }] = useSettingsContext();
  // Signal to open the directory open dialog, change to true to open it
  const [activateManualDirectorySelection, setManualDirectorySelection] = createSignal(false);
  // Helper function to reset manual selection
  const resetManualDirectorySelection = () => setManualDirectorySelection(false);

  // Array to just hold recently selected directories and our evaluations of them
  const [directoryHistory, setDirectoryHistory] = createSignal<DirectorySelection[]>([]);

  createEffect(() => {
    if (settings.directoryPath !== '' && directoryHistory().length === 0) {
      // Set initial directory from settings
      setDirectoryHistory([
        {
          path: settings.directoryPath.split('/'),
        },
      ]);
    }
  });

  // Helper accessor for 'current' directory
  const currentDirectory = createMemo(() => {
    if (directoryHistory().length === 0) {
      return {
        path: [],
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

    // Determine what kind of path it is
    try {
      // Use the tauri fs.readDir API
      const dirContents = await readDir(splitPath.join('/'), { recursive: true });

      console.debug(`Read ${dirContents.length} children of ${splitPath.join('/')}`);

      const hasGamelogTxt = dirContents.filter((v) => v.name === 'gamelog.txt').length > 0;
      if (hasGamelogTxt) {
        console.debug('Matched a gamelog.txt file');
      } else {
        return;
      }
    } catch (e) {
      console.error(e);
      return;
    }

    // We have to already have determined the path type by here..
    setDirectoryHistory([
      {
        path: splitPath,
      },
      ...directoryHistory(),
    ]);

    // Save to store
    setDirectoryPath(splitPath.join('/'));
  }

  return {
    activateManualDirectorySelection: setManualDirectorySelection,
    currentDirectory,
    resetDirectory: () => {
      setDirectoryHistory([]);
      setDirectoryPath('');
    },
  };
});
