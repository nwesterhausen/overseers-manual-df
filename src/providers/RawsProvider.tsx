import { createContextProvider } from '@solid-primitives/context';
import { invoke } from '@tauri-apps/api';
import { appWindow } from '@tauri-apps/api/window';
import { createEffect, createMemo, createResource, createSignal } from 'solid-js';
import { RawsFirstLetters, UniqueSort } from '../definitions/Raw';
import type { Creature, ProgressPayload, Raw } from '../definitions/types';
import { useDirectoryProvider } from './DirectoryProvider';
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
  const [allRawsJsonArray] = createResource(loadRaws, parseRaws, {
    initialValue: [],
  });

  // Raws after filtering by the search
  const allRawsJsonSearchFiltered = createMemo(() => {
    // Search filtering
    if (searchContext.searchString() === '') {
      return allRawsJsonArray();
    }
    const searchTerms = searchContext.searchString().split(' ');

    return allRawsJsonArray().filter((raw) => {
      return (
        // Filter the object based on the searchableString value
        raw.searchString &&
        searchTerms.filter((v) => {
          for (const term of raw.searchString) {
            if (term.indexOf(v.toLowerCase()) !== -1) return true;
          }
          return false;
        }).length === searchTerms.length
      );
    });
  });

  // The alphabet but only the letters for which we have entries.
  const allRawsAlphabet = createMemo((): string[] => {
    return RawsFirstLetters(allRawsJsonSearchFiltered() as Raw[]);
  });

  // Signal for raw parsing progress
  const [parsingProgress, setParsingProgress] = createSignal<ProgressPayload>({ current_module: '', percentage: 0.0 });

  // Listen to window events from Tauri
  appWindow
    .listen(
      'PROGRESS',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ event, payload }) => {
        const progress = payload as ProgressPayload;
        setParsingProgress(progress);
        console.log(payload);
      }
    )
    .then(() => {
      console.log('Listening for progress updates from backend.');
    })
    .catch(console.error);

  // Signal no set directory
  createEffect(() => {
    if (directoryContext.directoryPath().length === 0) {
      setParsingStatus(STS_EMPTY);
    } else {
      setLoadRaws(true);
    }
  });

  // Provide access to only Creatures
  const creatureRaws = createMemo(
    () => allRawsJsonSearchFiltered().filter((x) => x.raw_type === 'Creature') as Creature[]
  );

  const creatureRawsAlphabet = createMemo(() => RawsFirstLetters(creatureRaws()));

  async function parseRaws(): Promise<Raw[]> {
    const dir = directoryContext.directoryPath().join('/');

    setParsingStatus(STS_PARSING);

    try {
      const raw_file_data: Raw[][] = JSON.parse(
        await invoke('parse_raws_at_game_path', { path: dir, window: appWindow })
      );

      setParsingStatus(STS_LOADING);
      setParsingProgress({ current_module: '', percentage: 1.0 });

      // Flatten the array of arrays
      const result = raw_file_data.flat();

      const sortResult = UniqueSort(result);

      // Based on the number of results, set raws as EMPTY or IDLE
      if (sortResult.length === 0) {
        setParsingStatus(STS_EMPTY);
      } else {
        setParsingStatus(STS_IDLE);
      }

      // Reset the trigger after 50ms
      setTimeout(() => {
        setLoadRaws(false);
      }, 50);

      return sortResult;
    } catch (e) {
      console.error(e);
      setParsingProgress({ current_module: '', percentage: 0.0 });
      setParsingStatus(STS_EMPTY);
    }
  }

  return {
    parsingStatus,
    allRawsJsonSearchFiltered,
    setLoadRaws,
    parsingProgress,
    allRawsAlphabet,
    creatureRaws,
    creatureRawsAlphabet,
  };
});
