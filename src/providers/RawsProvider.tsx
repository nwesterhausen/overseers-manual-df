import { createContextProvider } from '@solid-primitives/context';
import { invoke } from '@tauri-apps/api';
import { createEffect, createMemo, createResource, createSignal, JSX } from 'solid-js';
import { AssignBasedOn, Creature, GenerateSearchString } from '../definitions/Creature';
import { FilterInvalidRaws, Raw, RawsFirstLetters } from '../definitions/Raw';
import { useDirectoryProvider } from './DirectoryProvider';
import { readDir } from '@tauri-apps/api/fs';
import { ProgressBar } from 'solid-bootstrap';
import { useSearchProvider } from './SearchProvider';

// Statuses for the parsing status
export const STS_PARSING = 'Parsing Raws',
  STS_LOADING = 'Loading Raws',
  STS_IDLE = 'Idle',
  STS_EMPTY = 'Idle/No Raws';

export const [RawsProvider, useRawsProvider] = createContextProvider(() => {
  const directoryContext = useDirectoryProvider();
  const searchContext = useSearchProvider();

  // Signal for setting raw parse status
  const [parsingStatus, setParsingStatus] = createSignal(STS_IDLE);

  // Log the effect changes
  createEffect(() => {
    console.log(parsingStatus());
  });

  // Signal for loading raws
  const [loadRaws, setLoadRaws] = createSignal(false);
  // Resource for raws
  const [jsonRawsResource] = createResource(loadRaws, parseRawsInSave, {
    initialValue: [],
  });

  // Raws after filtering by the search
  const rawsJson = createMemo(() => {
    if (searchContext.searchString() === '') {
      return jsonRawsResource();
    }
    const searchTerms = searchContext.searchString().split(' ');
    return jsonRawsResource().filter((raw) => {
      return (
        // Filter the object based on the searchableString value
        raw.searchString &&
        searchTerms.filter((v) => {
          for (const term of raw.searchString) {
            if (term.indexOf(v) !== -1) return true;
          }
          return false;
        }).length === searchTerms.length
      );
    });
  });

  // The alphabet but only the letters for which we have entries.
  const rawsAlphabet = createMemo((): string[] => {
    return RawsFirstLetters(rawsJson() as Raw[]);
  });

  // Signal for raw parsing progress
  const [parsingProgress, setParsingProgress] = createSignal(100);
  const parsingProgressBar = createMemo((): JSX.Element => {
    const perc = Math.floor(100 * parsingProgress());
    return <ProgressBar now={perc} label={`${perc}%`} />;
  });

  // Signal no chose save file
  createEffect(() => {
    if (directoryContext.currentSave().length === 0 || directoryContext.directoryPath.length === 0) {
      setParsingStatus(STS_EMPTY);
    }
  });

  // React to changing the save directory
  createEffect(() => {
    setLoadRaws(directoryContext.currentSave() !== '');
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

    if (Array.isArray(result)) {
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

  return { currentStatus: parsingStatus, rawsJson, setLoadRaws, parsingProgressBar, rawsAlphabet };
});

/**
 * Returns an array of paths for the raw files in a directory
 *
 * @param basepath - Directory to find raw files under
 * @returns array of paths to raw files
 */
const ReadAllRawFilePaths = async (basepath: string): Promise<string[]> => {
  const possibleRaws: string[] = [];

  try {
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
  } catch (err) {
    console.warn(err);
  }

  return possibleRaws;
};
