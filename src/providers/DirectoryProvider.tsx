import { createContextProvider } from '@solid-primitives/context';
import { open as tauriOpen, OpenDialogOptions } from '@tauri-apps/api/dialog';
import { Event, listen } from '@tauri-apps/api/event';
import { readDir } from '@tauri-apps/api/fs';
import { createEffect, createResource, createSignal } from 'solid-js';
import {
  get as getFromStore,
  init as initStore,
  LAST_SAVE,
  PATH_STRING,
  PATH_TYPE,
  set as saveToStore,
} from '../settings';

export const DIR_NONE = Symbol('none'),
  DIR_DF = Symbol('df'),
  DIR_SAVE = Symbol('saves');

/**
 * Dialog options for the select directory window
 */
const openDialogOptions: OpenDialogOptions = {
  directory: true,
  title: 'Select your current Dwarf Fortress Directory',
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
  let pathDelimation = '/';
  if (path.indexOf('\\') !== -1) {
    pathDelimation = '\\';
  }
  const pathArr = path.split(pathDelimation);
  console.debug(`Saving ${pathArr} as path`);
  return pathArr;
}

export const [DirectoryProvider, useDirectoryProvider] = createContextProvider(() => {
  // Directory type, so we can be flexible
  const [directoryType, setDirectoryType] = createSignal<symbol>(DIR_NONE);
  // Signal to open the directory open dialog, change to true to open it
  const [activateManualDirectorySelection, setManualDirectorySelection] = createSignal(false);
  // Path to the dropped file location
  const [directoryPath, setDirectoryPath] = createSignal([]);
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
      saveToStore(PATH_STRING, directoryPath().join('/')); // Decided to deliminate with `/` in the settings file
      saveToStore(PATH_TYPE, directoryType().toString());
      setTimeout(() => {
        setManualDirectorySelection(false);
      }, 10);
    }
  });
  // List of possible save folders (each can have their own raws)
  const [saveDirectoryOptions, setSaveDirectoryOptions] = createSignal<string[]>([]);
  // Currently selected save signal
  const [currentSave, setCurrentSave] = createSignal<string>('');

  // When we update the save directory, we need to update the list of possible saves
  createEffect(async () => {
    console.log('directoryPath effect', directoryPath());
    refreshValidDirectories(false);
  });

  // Save the current save to store when it changes
  createEffect(() => {
    if (currentSave() !== '') {
      saveToStore(LAST_SAVE, currentSave());
    }
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
      const validSaveOptions: string[] = [];

      try {
        // Combine the save folder path (stored as array) into a path string
        let savePath = directoryPath().join('/');

        // Use the tauri fs.readDir API
        let dirContents = await readDir(savePath, { recursive: true });

        console.debug(`Read ${dirContents.length} children of ${savePath}`);

        const hasGamelogTxt = dirContents.filter((v) => v.name === 'gamelog.txt').length > 0;
        if (hasGamelogTxt) {
          console.debug('Matched a gamelog.txt file');
          setDirectoryType(DIR_DF);
          // Update the save path to reflect data/save
          console.debug(directoryPath());
          savePath = [...directoryPath(), 'data', 'save'].join('/');

          // reload dirContents
          dirContents = await readDir(savePath, { recursive: true });
        } else {
          setDirectoryType(DIR_SAVE);
        }

        // For each entry in the directory, push only options which have children into an array to check
        for (const entry of dirContents) {
          console.debug(`into ${entry.name}`);
          // Check if the entry is a directory. If it is, look inside and see if it has what we want
          if (entry.children) {
            // Check if this entry has a raw directory inside of it (which is where we look for raws)
            if (entry.children.filter((v) => v.children && v.name === 'raw').length > 0) {
              validSaveOptions.push(entry.name);
            } else {
              console.log(`${entry.name} has no 'raw' directory, can't parse`);
            }
          }
        }
      } catch (err) {
        console.debug(err);
      } finally {
        if (validSaveOptions.length === 0) {
          console.log('Invalid option for saveDirectory');
          setDirectoryType(DIR_NONE);
          setSaveDirectoryOptions([]);
          setManualDirectorySelection(false);
        }
      }
      setSaveDirectoryOptions(validSaveOptions);
    } else {
      setDirectoryType(DIR_NONE);
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
      } else if (val === DIR_SAVE.toString()) {
        setDirectoryType(DIR_SAVE);
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
    currentSave,
    saveDirectoryOptions,
    setCurrentSave,
    refreshSaveDirs: () => refreshValidDirectories(true),
  };
});
