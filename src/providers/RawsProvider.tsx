import { createContextProvider } from '@solid-primitives/context';
import { invoke } from '@tauri-apps/api';
import { createEffect, createMemo, createResource, createSignal, JSX } from 'solid-js';
import { AssignBasedOn, Creature, GenerateSearchString } from '../definitions/Creature';
import { FilterInvalidRaws } from '../definitions/Raw';
import { useDirectoryProvider } from './DirectoryProvider';
import { readDir } from '@tauri-apps/api/fs';
import { ProgressBar } from 'solid-bootstrap';

// Statuses for the parsing status
export const STS_PARSING = 'Parsing Raws',
  STS_LOADING = 'Loading Raws',
  STS_IDLE = 'Idle',
  STS_EMPTY = 'Idle/No Raws';

export const [RawsProvider, useRawsProvider] = createContextProvider(() => {
  const directoryContext = useDirectoryProvider();

  // Signal for setting raw parse status
  const [parsingStatus, setParsingStatus] = createSignal(STS_IDLE);
  const currentStatus = createMemo(() => {
    console.log(parsingStatus());
    return parsingStatus();
  });

  // Signal for loading raws
  const [loadRaws, setLoadRaws] = createSignal(false);
  // Resource for raws
  const [jsonRawsResource] = createResource(loadRaws, parseRawsInSave, {
    initialValue: [],
  });

  // Signal for raw parsing progress
  const [parsingProgress, setParsingProgress] = createSignal(100);
  const parsingProgressBar = createMemo((): JSX.Element => {
    const perc = Math.floor(100 * parsingProgress());
    return <ProgressBar now={perc} label={`${perc}%`} />;
  });

  // React to changing the save directory
  createEffect(() => {
    if (directoryContext.currentSave() !== '') {
      setLoadRaws(true);
    }
  });

  /**
   * This calls the parse function in our rust code and gets the JSON response
   * back. Currently we only parse creature raws, so this is set to return
   * creature objects. But in the future we will probably have to use a few different
   * functions or at least handle them differently.
   */
  async function parseRawsInSave(): Promise<Creature[]> {
    setParsingProgress(0);
    setParsingStatus(STS_PARSING);

    const dir = [...directoryContext.saveFolderPath(), directoryContext.currentSave(), 'raw'].join('/');
    const rawFiles = await ReadAllRawFilePaths(dir);
    console.log(rawFiles.length, 'raw files to parse.');
    const rawsArr = [];

    for (let i = 0; i < rawFiles.length; i++) {
      setParsingProgress((i + 1) / rawFiles.length);
      const v = rawFiles[i];
      const strRaw = await invoke('parse_raws_in_file', { path: v });
      if (typeof strRaw === 'string') {
        const jsonRaw = await JSON.parse(strRaw);
        if (Array.isArray(jsonRaw)) {
          rawsArr.push(jsonRaw);
        }
      }
    }

    setParsingProgress(100);
    setParsingStatus(STS_LOADING);

    const result = rawsArr.flat();

    if (result.length > 0) {
      const sortResult = result.filter(FilterInvalidRaws).sort((a, b) => (a.name < b.name ? -1 : 1));

      for (let i = 0; i < sortResult.length; i++) {
        const val: Creature = sortResult[i];
        if (val.based_on && val.based_on.length) {
          const matches = sortResult.filter((c) => c.objectId === val.based_on);
          if (matches.length === 1) {
            sortResult[i] = AssignBasedOn(val, matches[0]);
          } else {
            console.warn(`${matches.length} matches for ${val.based_on}`);
          }
        }
        sortResult[i].searchString = GenerateSearchString(sortResult[i]);
      }
      if (sortResult.length === 0) {
        setParsingStatus(STS_EMPTY);
      } else {
        setParsingStatus(STS_IDLE);
      }
      setTimeout(() => {
        setLoadRaws(false);
      }, 50);
      return sortResult;
    }

    console.debug(result);
    console.error('Result was not an array');
    setParsingStatus(STS_IDLE);
    setLoadRaws(false);
    return [];
  }

  return { currentStatus, jsonRawsResource, setLoadRaws, parsingProgressBar };
});

const ReadAllRawFilePaths = async (basepath: string): Promise<string[]> => {
  const possibleRaws: string[] = [];

  const entries = await readDir(basepath, { recursive: true });

  for (const entry of entries) {
    console.log(entry);
    if (entry.children && entry.name === 'objects') {
      for (const e of entry.children) {
        if (e.name.endsWith('.txt')) {
          possibleRaws.push(e.path);
        }
      }
    }
  }

  return possibleRaws;
};
