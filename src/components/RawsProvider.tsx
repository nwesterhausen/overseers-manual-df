import { createContextProvider } from '@solid-primitives/context';
import { invoke } from '@tauri-apps/api';
import { createResource, createSignal } from 'solid-js';
import { AssignBasedOn, Creature, GenerateSearchString } from '../definitions/Creature';
import { FilterInvalidRaws } from '../definitions/Raw';
import { useDirectoryProvider } from './DirectoryProvider';

// Statuses for the parsing status
export const STS_PARSING = 'Parsing',
  STS_LOADING = 'Loading',
  STS_IDLE = 'Idle',
  STS_EMPTY = 'Idle/No Raws';

export const [RawsProvider, useRawsProvider] = createContextProvider(() => {
  const directoryContext = useDirectoryProvider();

  // Signal for setting raw parse status
  const [parsingStatus, setParsingStatus] = createSignal(STS_IDLE);

  // Signal for loading raws
  const [loadRaws, setLoadRaws] = createSignal(false);
  // Resource for raws
  const [jsonRawsResource] = createResource(loadRaws, parseRawsInSave, {
    initialValue: [],
  });

  /**
   * This calls the parse function in our rust code and gets the JSON response
   * back. Currently we only parse creature raws, so this is set to return
   * creature objects. But in the future we will probably have to use a few different
   * functions or at least handle them differently.
   */
  async function parseRawsInSave(): Promise<Creature[]> {
    // setLoadRaws(false);
    const dir = [...directoryContext.saveFolderPath(), directoryContext.currentSave(), 'raw'].join('/');
    console.log(`Sending ${dir} to be parsed.`);
    setParsingStatus(STS_PARSING);
    const jsonStr = await invoke('parse_raws_at_path', {
      path: dir,
    });
    setParsingStatus(STS_LOADING);
    if (typeof jsonStr !== 'string') {
      console.debug(jsonStr);
      console.error("Did not get 'string' back");
      setParsingStatus(STS_IDLE);
      setLoadRaws(false);
      return [];
    }
    const result = JSON.parse(jsonStr);
    if (Array.isArray(result)) {
      const sortResult = result.filter(FilterInvalidRaws).sort((a, b) => (a.name < b.name ? -1 : 1));
      const mergedResult = sortResult.map((val: Creature, i, a: Creature[]) => {
        if (val.based_on && val.based_on.length) {
          const matches = a.filter((c) => c.objectId === val.based_on);
          if (matches.length === 1) {
            return AssignBasedOn(val, matches[0]);
          }
          console.warn(`${matches.length} matches for ${val.based_on}`);
        }
        return val;
      });
      const searchableResult = mergedResult.map((v: Creature) => {
        v.searchString = GenerateSearchString(v);
        return v;
      });
      console.log('raws parsed', searchableResult.length);
      if (searchableResult.length === 0) {
        setParsingStatus(STS_EMPTY);
      } else {
        setParsingStatus(STS_IDLE);
      }
      setTimeout(() => {
        setLoadRaws(false);
      }, 50);
      return searchableResult;
    }
    console.debug(result);
    console.error('Result was not an array');
    setParsingStatus(STS_IDLE);
    setLoadRaws(false);
    return [];
  }

  return { parsingStatus, jsonRawsResource, setLoadRaws };
});
