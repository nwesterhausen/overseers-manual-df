import { createContextProvider } from '@solid-primitives/context';
import { open as tauriOpen, OpenDialogOptions } from '@tauri-apps/api/dialog';
import { listen } from '@tauri-apps/api/event';
import { createEffect, createMemo, createResource, createSignal } from 'solid-js';
import { readDir } from '@tauri-apps/api/fs';
import {
  init as initStore,
  get as getFromStore,
  set as saveToStore,
  PATH_STRING,
  LAST_SAVE,
  PATH_TYPE,
  clear,
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
  return pathArr;
}

export const [DirectoryProvider, useDirectoryProvider] = createContextProvider(() => {
  // Directory type, so we can be flexible
  const [directoryType, setDirectoryType] = createSignal<symbol>(DIR_NONE);
  // Signal to open the directory open dialog, change to true to open it
  const [activateManualDirectorySelection, setManualDirectorySelection] = createSignal(false);
  // Path to the dropped file location
  const [dragAndDropPath, setDragAndDropPath] = createSignal([]);
  // This resource calls the Tauri API to open a file dialog
  const [manuallySpecifiedPath] = createResource(
    activateManualDirectorySelection,
    async (): Promise<string[]> => {
      try {
        const folderPath = await tauriOpen(openDialogOptions);
        if (Array.isArray(folderPath)) {
          return splitPathAgnostically(folderPath[0]);
        }
        return splitPathAgnostically(folderPath);
      } catch (error) {
        console.debug(error);
        return [];
      }
    },
    {
      initialValue: [],
    }
  );
  // Directory path, but more generic so we can be flexible
  const directoryPath = createMemo((): string[] => {
    if (directoryType() === DIR_NONE) return [];
    if (manuallySpecifiedPath().length > 0) return manuallySpecifiedPath();
    if (dragAndDropPath().length > 0) return dragAndDropPath();
    return [];
  });
  // Based on the path and path type, we can expose the save directory
  const saveFolderPath = createMemo((): string[] => {
    if (directoryType() === DIR_DF) {
      return directoryPath().concat('data', 'save');
    }
    if (directoryType() === DIR_SAVE) {
      return directoryPath();
    }
    return [];
  });
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
  // If the directory is determined to be "NONE" then we need to clear out any saved directory
  createEffect(() => {
    if (directoryType() !== DIR_NONE) {
      setCurrentSave('');
      setDragAndDropPath([]);
      setManualDirectorySelection(false);
    }
  });
  // When we update the save directory, we need to update the list of possible saves
  createEffect(() => {
    if (directoryPath().join('').length > 0) {
      const savePath = saveFolderPath().join('/');
      readDir(savePath)
        .then((values) => {
          console.log(values);
          const saveArr = [];
          values.forEach((fileEntry) => {
            saveArr.push(fileEntry.name);
          });
          const validSaveOptions: Promise<string>[] = saveArr.map((v) => {
            if (directoryType() === DIR_SAVE || directoryType() === DIR_DF) {
              return new Promise<string>((resolve) => {
                const subpath = `${savePath}/${v}`;
                readDir(subpath)
                  .then((values) => {
                    let fail = true;
                    values.forEach((fileEntry) => {
                      if (fileEntry.name === 'raw') {
                        fail = false;
                      }
                    });
                    if (fail) {
                      console.debug(`${v} determined invalid (no raw folder)`);
                      return resolve('');
                    }
                    return resolve(v);
                  })
                  .catch((err) => {
                    console.debug(err);
                    return resolve('');
                  });
              });
            } else {
              return new Promise<string>((res) => {
                return res('');
              });
            }
          });
          return Promise.all(validSaveOptions);
        })
        .then((validSaves) => {
          const saveArr = [...new Set(validSaves)].filter((v) => v.length > 0);
          console.log(saveArr);
          if (saveArr.length === 0) {
            setDirectoryType(DIR_NONE);
            setDragAndDropPath([]);
          }
          setSaveDirectoryOptions(saveArr);
        })
        .then(() => getFromStore(LAST_SAVE))
        .then((last_save) => {
          if (last_save.length === 0) {
            setCurrentSave('');
            return;
          }
          console.log(`Checking for ${last_save} within valid options.`);
          if (saveDirectoryOptions().indexOf(last_save) > -1) {
            setCurrentSave(last_save);
          } else {
            console.log(`${last_save} is invalid option`);
            setCurrentSave('');
            return clear(LAST_SAVE);
          }
        })
        .catch((err) => {
          console.debug('Invalid option for saveDirectory');
          setDirectoryType(DIR_NONE);
          setSaveDirectoryOptions([]);
          setManualDirectorySelection(false);
          console.debug(err);
        });
    }
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
  listen('tauri://file-drop', (event) => {
    setDirectoryType(DIR_DF);
    setDragAndDropPath(event.payload[0]);
  });

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
        setDragAndDropPath(splitPathAgnostically(val));
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
    setDragAndDropPath,
    saveFolderPath,
    setDirectoryType,
  };
});
