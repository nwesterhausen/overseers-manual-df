import { Store } from 'tauri-plugin-store-api';

const store = new Store('settings.json');
const CURRENT_VERSION = 2;

const DATA_VERSION = 'dataVersion';
export const DF_PATH = 'dfDirPath';
export const LAST_SAVE = 'lastSaveUsed';

const ValidKeys = [DATA_VERSION, DF_PATH, LAST_SAVE];

/**
 * Initializes the store. This creates any missing values after checking that the `DATA_VERSION` matches our current version.
 */
export async function init() {
  await store.load();
  const keys = await store.keys();
  console.log(keys);
  let resave = false;
  if (keys.indexOf(DATA_VERSION) === -1) {
    console.log('Missing', DATA_VERSION);
    await store.set(DATA_VERSION, CURRENT_VERSION);
    resave = true;
  }
  if (keys.indexOf(DF_PATH) === -1) {
    console.log('Missing', DF_PATH);
    await store.set(DF_PATH, '');
    resave = true;
  }
  if (keys.indexOf(LAST_SAVE) === -1) {
    console.log('Missing', LAST_SAVE);
    await store.set(LAST_SAVE, '');
    resave = true;
  }
  if (resave) {
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
 * Returns the value stored under a specified key.
 *
 * If the key is invalid, it returns an empty string.
 *
 * @param key - The key to retreive data from.
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
