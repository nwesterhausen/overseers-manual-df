import { createContextProvider } from '@solid-primitives/context';
import { OpenDialogOptions, open as tauriOpen } from '@tauri-apps/api/dialog';
import { Event, listen } from '@tauri-apps/api/event';
import { readDir } from '@tauri-apps/api/fs';
import { createEffect, createResource, createSignal } from 'solid-js';
import { PATH_STRING, PATH_TYPE, get as getFromStore, init as initStore, set as saveToStore } from '../settings';

export const DIR_NONE = Symbol('none'),
  DIR_DF = Symbol('df'),
  DIR_SAVE = Symbol('saves');

/**
 * Dialog options for the select directory window
 */
const openDialogOptions: OpenDialogOptions = {
  directory: true,
  title: 'Select your Dwarf Fortress install Directory',
};

/**
 * Helper function to turn the path from a drag and dropped file or the manually selected save folder
 * into an array of directories. This is done pretty crudely, it splits the path based on `/` unless if
 * finds `\` in the path, then it spits by `\`.
 *
 * @param path - path to split
 * @returns array of directories
 */
function splitPathAgnostically(path: string): string[] {
  if (!path) {
    console.debug('Caught an empty path length');
    return [];
  }
  let pathDelineation = '/';
  if (path.indexOf('\\') !== -1) {
    pathDelineation = '\\';
  }
  const pathArr = path.split(pathDelineation);
  console.debug(`Saving ${pathArr} as path`);
  return pathArr;
}

export const [DirectoryProvider, useDirectoryProvider] = createContextProvider(() => {
  // Directory type, so we can be flexible
  const [directoryType, setDirectoryType] = createSignal<symbol>(DIR_NONE);
  // Signal to open the directory open dialog, change to true to open it
  const [activateManualDirectorySelection, setManualDirectorySelection] = createSignal(false);
  // Path to the dropped file location
  const [directoryPath, setDirectoryPath] = createSignal<string[]>([]);
  // This resource calls the Tauri API to open a file dialog
  const [manuallySpecifiedPath] = createResource(
    activateManualDirectorySelection,
    async (): Promise<string[]> => {
      try {
        const folderPath = await tauriOpen(openDialogOptions);
        console.debug(folderPath);
        if (Array.isArray(folderPath)) {
          return splitPathAgnostically(folderPath[0]);
        }
        return splitPathAgnostically(folderPath);
      } catch (error) {
        console.debug(error);
        setManualDirectorySelection(false);
        return [];
      }
    },
    {
      initialValue: [],
    }
  );

  // When a path is manually specified, update the stored path
  createEffect(() => setDirectoryPath(manuallySpecifiedPath.latest));

  // Based on the memo changing, we update the save folder path (and save it to our settings storage)
  createEffect(() => {
    if (directoryPath().length > 0) {
      saveToStore(PATH_STRING, directoryPath().join('/')); // Decided to delineate with `/` in the settings file
      saveToStore(PATH_TYPE, directoryType().toString());
    }
    setTimeout(() => {
      setManualDirectorySelection(false);
    }, 10);
  });

  // When we update the save directory, we need to update the list of possible saves
  createEffect(async () => {
    console.log('directoryPath effect', directoryPath());
    refreshValidDirectories(false);
  });

  // Some extra logging
  createEffect(() => {
    console.debug(`Manual folder selection ${activateManualDirectorySelection() ? 'activated' : 'reset'}`);
  });

  // Listen for a file being dropped on the window to change the save location.
  listen('tauri://file-drop', (event: Event<string[]>) => {
    if (event.payload.length > 0) {
      const file = event.payload[0];
      if (file.endsWith('gamelog.txt')) {
        setDirectoryPath(splitPathAgnostically(file).slice(0, -1));
      }
    }
  });

  /**
   * Read the save dir and find any valid save files
   * @param forced - whether this is a forced refresh or not
   */
  const refreshValidDirectories = async (forced: boolean) => {
    console.debug(`Forced refresh: ${forced}`);
    if (directoryPath().length > 0) {
      try {
        // Use the tauri fs.readDir API
        const dirContents = await readDir(directoryPath().join('/'), { recursive: true });

        console.debug(`Read ${dirContents.length} children of ${directoryPath().join('/')}`);

        const hasGamelogTxt = dirContents.filter((v) => v.name === 'gamelog.txt').length > 0;
        if (hasGamelogTxt) {
          console.debug('Matched a gamelog.txt file');
          setDirectoryType(DIR_DF);
        } else {
          setDirectoryType(DIR_NONE);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Setting up the settings storage.
  initStore()
    // After its setup, try to get the save directory from the settings
    .then(() => {
      return getFromStore(PATH_STRING);
    })
    // With the save folder, set it as the drag and drop path, since that's the path we set programmatically
    // and let the effects do the rest.
    .then((val) => {
      if (val.length > 0) {
        console.log('Setting initial value for directory to', val);
        setDirectoryPath(splitPathAgnostically(val));
      }
      return getFromStore(PATH_TYPE);
    })
    .then((val) => {
      if (val === DIR_DF.toString()) {
        setDirectoryType(DIR_DF);
      } else {
        setDirectoryType(DIR_NONE);
        saveToStore(PATH_TYPE, DIR_NONE.toString());
      }
    })
    .catch((err) => {
      console.debug('Error when init the store!');
      console.debug(err);
    });

  return {
    setManualFolderSelect: setManualDirectorySelection,
    directoryPath,
    directoryType,
    refreshSaveDirs: () => refreshValidDirectories(true),
  };
});
