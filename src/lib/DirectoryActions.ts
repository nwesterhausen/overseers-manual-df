import { open as tauriOpen } from '@tauri-apps/plugin-dialog';
import { readDir } from '@tauri-apps/plugin-fs';

/**
 * Get the path to the Dwarf Fortress directory. This is done by opening a file dialog and
 * asking the user to select the Dwarf Fortress directory. This function will then check
 * if the directory contains a `gamelog.txt` file, and if it does, it will return the path
 * to the directory. If it does not, it will return an empty array.
 *
 * @returns The path to the Dwarf Fortress directory, or an empty array if the directory does not contain a `gamelog.txt` file.
 */
export async function getDwarfDirectoryPath(presetPath?: string | string[]): Promise<string[]> {
  // If we have a preset path, use that instead of opening a dialog
  const directoryPath: string | string[] =
    typeof presetPath !== 'undefined'
      ? presetPath
      : await tauriOpen({
          title: 'Select your Dwarf Fortress game directory',
          multiple: false,
          directory: true,
        });

  // Split the path into an array of strings
  let splitPath: string[];
  if (Array.isArray(directoryPath)) {
    splitPath = splitPathAgnostically(directoryPath[0]);
  } else {
    splitPath = splitPathAgnostically(directoryPath);
  }

  // If we have a zero length path array, quit early
  if (splitPath.length === 0) {
    return [];
  }

  // Determine what kind of path it is
  try {
    // Use the tauri fs.readDir API
    const dirContents = await readDir(splitPath.join('/'), { recursive: true });

    console.debug(`Read ${dirContents.length} children of ${splitPath.join('/')}`);

    const hasGamelogTxt = dirContents.filter((v) => v.name === 'gamelog.txt').length > 0;
    if (hasGamelogTxt) {
      console.debug('Found a gamelog.txt file');
      return splitPath;
    } else {
      return [];
    }
  } catch (e) {
    console.error(e);
    return [];
  }
}

/**
 * Helper function to turn the path from a drag and dropped file or the manually selected save folder
 * into an array of directories. This is done pretty crudely, it splits the path based on `/` unless if
 * finds `\` in the path, then it spits by `\`.
 *
 * @param path - path to split
 * @returns array of directories
 */
export function splitPathAgnostically(path: string): string[] {
  if (!path) {
    console.debug('Caught an empty path length');
    return [];
  }
  let pathDelineation = '/';
  if (path.indexOf('\\') !== -1) {
    pathDelineation = '\\';
  }
  const pathArr = path.split(pathDelineation);
  console.debug(`Path delineated to [${pathArr.join(', ')}]`);
  return pathArr;
}
