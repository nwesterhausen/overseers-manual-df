import { createContextProvider } from '@solid-primitives/context';
import { open as tauriOpen, OpenDialogOptions } from '@tauri-apps/api/dialog';
import { listen } from '@tauri-apps/api/event';
import { createEffect, createMemo, createResource, createSignal } from 'solid-js';
import { readDir } from '@tauri-apps/api/fs';
import { set as saveToStore, SAVES_PATH } from '../settings';

/**
 * Dialog options for the select directory window
 */
const openDialogOptions: OpenDialogOptions = {
  directory: true,
  title: 'Select your current DF Save Folder (e.g. ...DF/data/saves)',
};

/**
 * Helper function to turn the path from a drag and dropped file OR the manually selected save folder
 * into an array of directories ending with the Dwarf Fortress save folder. This is done pretty crudely,
 * it splits the path based on `/` unless if finds `\` in the path, then it spits by `\`. After splitting
 * the path, keeps removing indeces at the end of the array until the final index is 'save' (or the array
 * is empty).
 * @param dadpath - path from drag-and-dropped file
 * @param manpath - path from the open directory dialog
 * @returns array of directories leading to the save directory
 */
function getSavePathFromWorldDat(dadpath: string, manpath: string): string[] {
  let targetPath = dadpath;
  if (manpath && manpath !== '') {
    targetPath = manpath;
  }
  let pathDelimation = '/';
  if (targetPath.indexOf('\\') !== -1) {
    pathDelimation = '\\';
  }
  let pathArr = targetPath.split(pathDelimation);
  while (pathArr[pathArr.length - 1] !== 'save') {
    pathArr = pathArr.slice(0, -1);
    if (pathArr.length === 0) {
      return [];
    }
  }
  return pathArr;
}

/**
 * This opens a directory selection dialog using the settings defined earlier.
 * @returns The selected path (or first selected path if more than one is chosen). Returns an empty string if it
 * encounters an error.
 */
async function performTauriOpenDiaglog(): Promise<string> {
  // setManualFolderSelect(false);
  try {
    const folderPath = await tauriOpen(openDialogOptions);
    if (Array.isArray(folderPath)) {
      return folderPath[0];
    }
    return folderPath;
  } catch (error) {
    console.error(error);
    return '';
  }
}

export const [DirectoryProvider, useDirectoryProvider] = createContextProvider(() => {
  // Path to the dropped file location
  const [dragAndDropPath, setDragAndDropPath] = createSignal('');
  // Signal to open the directory open dialog, change to true to open it
  const [doManualFolderSelect, setManualFolderSelect] = createSignal(false);
  // This resource calls the Tauri API to open a file dialog
  const [manuallySpecifiedPath] = createResource(doManualFolderSelect, performTauriOpenDiaglog);
  // Since we are splitting (and verifying) the path, we use a memo which reacts if either a file is dropped or if the
  // resource is updated
  const saveFolderPath = createMemo(() => getSavePathFromWorldDat(dragAndDropPath(), manuallySpecifiedPath()));
  // Based on the memo changing, we update the save folder path (and save it to our settings storage)
  createEffect(() => {
    if (saveFolderPath().length) {
      saveToStore(SAVES_PATH, saveFolderPath().join('/')); // Decided to deliminate with `/` in the settings file
    }
  });
  // List of possible save folders (each can have their own raws)
  const [saveDirectoryOptions, setSaveDirectoryOptions] = createSignal<string[]>([]);
  // Currently selected save signal
  const [currentSave, setCurrentSave] = createSignal<string>('');
  // When we update the save directory, we need to update the list of possible saves
  createEffect(() => {
    if (saveFolderPath().length) {
      readDir(saveFolderPath().join('/'))
        .then((values) => {
          console.log(values);
          const saveArr = [];
          values.forEach((fileEntry) => {
            saveArr.push(fileEntry.name);
          });
          setSaveDirectoryOptions(saveArr);
        })
        .catch(console.error);
    } else {
      setManualFolderSelect(false);
    }
  });

  // Listen for a file being dropped on the window to change the save location.
  listen('tauri://file-drop', (event) => {
    setDragAndDropPath(event.payload[0]);
  });
  return {
    setManualFolderSelect,
    saveFolderPath,
    currentSave,
    saveDirectoryOptions,
    setCurrentSave,
    setDragAndDropPath,
  };
});
