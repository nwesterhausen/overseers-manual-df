import { Store } from './plugins/store';
import { DIR_DF, DIR_NONE, DIR_RAWS, DIR_SAVE } from './providers/DirectoryProvider';

const store = new Store('settings.json');
const CURRENT_VERSION = 3;

const DATA_VERSION = 'dataVersion';
export const PATH_STRING = 'dfDirPath';
export const PATH_TYPE = 'pathType';
export const DISPLAY_GRAPHICS = 'displayGraphics';
export const LAYOUT_AS_GRID = 'layoutAsGrid';
export const INCLUDE_VANILLA = 'includeVanilla';
export const INCLUDE_MODS = 'includeMods';
export const INCLUDE_INSTALLED = 'includeInstalled';

const ValidKeys = [
  DATA_VERSION,
  PATH_STRING,
  PATH_TYPE,
  DISPLAY_GRAPHICS,
  LAYOUT_AS_GRID,
  INCLUDE_VANILLA,
  INCLUDE_MODS,
  INCLUDE_INSTALLED,
];
const BooleanKeys = [DISPLAY_GRAPHICS, LAYOUT_AS_GRID, INCLUDE_VANILLA, INCLUDE_MODS, INCLUDE_INSTALLED];

/**
 * Initializes the store. This creates any missing values after checking that the `DATA_VERSION` matches our current version.
 */
export async function init() {
  await store.load();
  const keys = await store.keys();
  console.log(keys);
  let reSave = false;
  // Settings Version
  if (keys.indexOf(DATA_VERSION) === -1) {
    console.log('Missing', DATA_VERSION);
    await store.set(DATA_VERSION, CURRENT_VERSION);
    reSave = true;
  }
  // String Values
  if (keys.indexOf(PATH_STRING) === -1) {
    console.log('Missing', PATH_STRING);
    await store.set(PATH_STRING, '');
    reSave = true;
  }
  if (keys.indexOf(PATH_TYPE) === -1) {
    console.log('Missing', PATH_TYPE);
    await store.set(PATH_TYPE, '');
    reSave = true;
  }
  // Boolean Values
  if (keys.indexOf(DISPLAY_GRAPHICS) === -1) {
    console.log('Missing', DISPLAY_GRAPHICS);
    await store.set(DISPLAY_GRAPHICS, true);
    reSave = true;
  }
  if (keys.indexOf(LAYOUT_AS_GRID) === -1) {
    console.log('Missing', LAYOUT_AS_GRID);
    await store.set(LAYOUT_AS_GRID, true);
    reSave = true;
  }
  if (keys.indexOf(INCLUDE_VANILLA) === -1) {
    console.log('Missing', INCLUDE_VANILLA);
    await store.set(INCLUDE_VANILLA, true);
    reSave = true;
  }
  if (keys.indexOf(INCLUDE_MODS) === -1) {
    console.log('Missing', INCLUDE_MODS);
    await store.set(INCLUDE_MODS, false);
    reSave = true;
  }
  if (keys.indexOf(INCLUDE_INSTALLED) === -1) {
    console.log('Missing', INCLUDE_INSTALLED);
    await store.set(INCLUDE_INSTALLED, true);
    reSave = true;
  }
  if (reSave) {
    // Set Defaults if version number increased
    const version = await store.get<number>(DATA_VERSION);
    if (version !== CURRENT_VERSION) {
      console.log('Version mismatch, resetting settings');
      await store.set(DATA_VERSION, CURRENT_VERSION);
      await store.set(PATH_STRING, '');
      await store.set(PATH_TYPE, '');
      await store.set(DISPLAY_GRAPHICS, true);
      await store.set(LAYOUT_AS_GRID, true);
      await store.set(INCLUDE_VANILLA, true);
      await store.set(INCLUDE_MODS, false);
      await store.set(INCLUDE_INSTALLED, true);
    }
    // Save the store if we had to create any missing values
    await store.save();
  }
}

/**
 * Function to store a value in the settings.json file.
 *
 * This function does nothing if the key is not considered valid.
 *
 * @param key - The key to store the data under.
 * @param value - The data to be stored
 */
export async function set(key: string, value: string | boolean) {
  if (ValidKeys.indexOf(key) === -1) {
    return;
  }
  if (typeof value === 'boolean') {
    // Only store boolean values for boolean keys
    if (BooleanKeys.indexOf(key) === -1) {
      return;
    }
  } else if (!value || value.length === 0) {
    return;
  }
  console.log(`Set ${key} to ${value} in store`);
  await store.set(key, value);
  await store.save();
}

/**
 * Function to clear a stored value in the settings.json file.
 *
 * This function does nothing if the key is not considered valid.
 *
 * @param key - The key to erase data under.
 */
export async function clear(key: string) {
  if (ValidKeys.indexOf(key) === -1) {
    return;
  }
  console.log(`Erase stored value from ${key} in store`);
  await store.set(key, '');
  await store.save();
}

/**
 * Returns the value stored under a specified key.
 *
 * If the key is invalid, it returns an empty string.
 *
 * @param key - The key to retrieve data from.
 * @returns The value stored under that key
 */
export async function get(key: string): Promise<string | boolean> {
  if (ValidKeys.indexOf(key) === -1) {
    return '';
  }
  if (store.has(key)) {
    console.log(`Retrieve ${key} from store`);
    if (BooleanKeys.indexOf(key) !== -1) {
      const val = await store.get<boolean>(key);
      console.log(val);
      return val;
    }
    const val = await store.get<string>(key);
    console.log(val);
    return val;
  }
}

/**
 * Returns the value stored under a key as a symbol if possible.
 *
 * If the key is invalid, it returns DIR_NONE.
 *
 * @param key - The key to retrieve data from.
 * @returns The value stored under that key
 */
export async function getSymbol(key: string): Promise<symbol> {
  if (ValidKeys.indexOf(key) === -1) {
    return DIR_NONE;
  }
  if (store.has(key)) {
    console.log(`Retrieve ${key} from store`);
    const val = await store.get<string>(key);
    let symbolVal = DIR_NONE;
    switch (val) {
      case 'Symbol(df)':
        symbolVal = DIR_DF;
        break;
      case 'Symbol(saves)':
        symbolVal = DIR_SAVE;
        break;
      case 'Symbol(raws)':
        symbolVal = DIR_RAWS;
        break;
    }
    console.log(symbolVal);
    return symbolVal;
  }
}
