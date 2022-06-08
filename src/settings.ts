import { Store } from 'tauri-plugin-store-api';

const store = new Store('settings.json');
await store.load();
const CURRENT_VERSION = 1;

const DATA_VERSION = 'dataVersion';
export const SAVES_PATH = 'dfSavesPath';
export const LAST_SAVE = 'lastSaveUsed';

export async function init() {
  const keys = await store.keys();
  console.log(keys);
  let resave = false;
  if (keys.indexOf(DATA_VERSION) === -1) {
    console.log('Missing', DATA_VERSION);
    await store.set(DATA_VERSION, CURRENT_VERSION);
    resave = true;
  }
  if (keys.indexOf(SAVES_PATH) === -1) {
    console.log('Missing', SAVES_PATH);
    await store.set(SAVES_PATH, '');
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

export async function set(key: string, value: string) {
  console.log(`Set ${key} to ${value} in store`);
  await store.set(key, value);
  await store.save();
}

export async function get(key: string): Promise<string> {
  console.log(`Retrieve ${key} from store`);
  return await store.get<string>(key);
}

export default {
  init,
  set,
  get,
};
