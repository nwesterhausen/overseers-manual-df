import { Store } from 'tauri-plugin-store-api';

const store = new Store('settings.json');
const CURRENT_VERSION = 2;

const DATA_VERSION = 'dataVersion';
export const PATH_STRING = 'dfDirPath';
export const LAST_SAVE = 'lastSaveUsed';
export const PATH_TYPE = 'pathType';

const ValidKeys = [DATA_VERSION, PATH_STRING, LAST_SAVE, PATH_TYPE];

/**
 * Initializes the store. This creates any missing values after checking that the `DATA_VERSION` matches our current version.
 */
export async function init() {
  await store.load();
  const keys = await store.keys();
  console.log(keys);
  let reSave = false;
  if (keys.indexOf(DATA_VERSION) === -1) {
    console.log('Missing', DATA_VERSION);
    await store.set(DATA_VERSION, CURRENT_VERSION);
    reSave = true;
  }
  if (keys.indexOf(PATH_STRING) === -1) {
    console.log('Missing', PATH_STRING);
    await store.set(PATH_STRING, '');
    reSave = true;
  }
  if (keys.indexOf(LAST_SAVE) === -1) {
    console.log('Missing', LAST_SAVE);
    await store.set(LAST_SAVE, '');
    reSave = true;
  }
  if (keys.indexOf(PATH_TYPE) === -1) {
    console.log('Missing', PATH_TYPE);
    await store.set(PATH_TYPE, '');
    reSave = true;
  }
  if (reSave) {
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
export async function set(key: string, value: string) {
  if (ValidKeys.indexOf(key) === -1) {
    return;
  }
  if (!value || value.length === 0) {
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
export async function get(key: string): Promise<string> {
  if (ValidKeys.indexOf(key) === -1) {
    return '';
  }
  if (store.has(key)) {
    console.log(`Retrieve ${key} from store`);
    return await store.get<string>(key);
  }
}
