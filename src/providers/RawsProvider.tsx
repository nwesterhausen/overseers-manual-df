import { create, insertBatch, search } from '@lyrasearch/lyra';
import { createContextProvider } from '@solid-primitives/context';
import { invoke } from '@tauri-apps/api';
import { appWindow } from '@tauri-apps/api/window';
import { createEffect, createMemo, createResource, createSignal } from 'solid-js';
import {
  RawsOnlyWithTagsOrAll,
  RawsOnlyWithoutModules,
  UniqueSort
} from '../definitions/Raw';
import type { DFInfoFile, ProgressPayload, Raw } from '../definitions/types';
import { useDirectoryProvider } from './DirectoryProvider';
import { useSearchProvider } from './SearchProvider';

// Statuses for the parsing status
export const STS_PARSING = 'Parsing Raws',
  STS_LOADING = 'Loading Raws',
  STS_IDLE = 'Idle',
  STS_EMPTY = 'Idle/No Raws';

// Default amount of results to return on no-search term
const MAX_RESULTS = 50;

export const [RawsProvider, useRawsProvider] = createContextProvider(() => {
  const directoryContext = useDirectoryProvider();
  const searchContext = useSearchProvider();

  const searchDatabase = create({
    schema: {
      identifier: 'string',
      name: 'string',
      parentRaw: 'string',
      rawModule: 'string',
      rawType: 'string',

      // Added types for this app
      searchString: 'string',
    }
  })

  // Signal for setting raw parse status
  const [parsingStatus, setParsingStatus] = createSignal(STS_IDLE);

  // Signal for loading raws
  const [loadRaws, setLoadRaws] = createSignal(false);

  // Resource for raws
  const [allRawsJsonArray] = createResource(loadRaws, parseRaws, {
    initialValue: [],
  });

  // Resource for accessing the raws via search filtering
  const searchFilteredRaws = createMemo<Raw[]>(() => {

    /*
    
        // Filter by modules first (easiest wide amount to filter). We pre-sort the raws in one step here.
        const moduleFiltered = RawsOnlyWithoutModules(
          allRawsJsonArray.latest.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1)),
          searchContext.filteredModules()
        );
        // Filter by required tags (somewhat expensive)
        const tagFiltered = RawsOnlyWithTagsOrAll(moduleFiltered, searchContext.requiredTags());
        // Filter remaining by search tags (most expensive)
        const searchFiltered = RawsMatchingSearchString(tagFiltered, searchContext.searchString());
        */

    console.log(loadRaws());

    const searchResult = search(searchDatabase, {
      term: searchContext.searchString()
    });

    const searchFiltered: Raw[] = searchResult.count === 0 ?
      Object.values(searchDatabase.docs) as Raw[] :
      searchResult.hits.map(h => h.document as Raw);

    const moduleFiltered = RawsOnlyWithoutModules(searchFiltered, searchContext.filteredModules());
    const tagFiltered = RawsOnlyWithTagsOrAll(moduleFiltered, searchContext.requiredTags());

    return tagFiltered.filter(r => {
      if (searchContext.requireCreature() && r.rawType === 'Creature') {
        return true;
      }
      if (searchContext.requirePlant() && r.rawType === 'Plant') {
        return true;
      }
      if (searchContext.requireInorganic() && r.rawType === 'Inorganic') {
        return true;
      }
      return false;
    }).slice(0, MAX_RESULTS);
  });

  // Resource for raws info files
  const [allRawsInfosJsonArray] = createResource(loadRaws, parseRawsInfo, {
    initialValue: [],
  });

  const rawModules = createMemo(() => {
    const modules = [...new Set(allRawsInfosJsonArray.latest.map((v) => v.objectId))];
    return modules.sort((a, b) => {
      const nameA = allRawsInfosJsonArray.latest.find((v) => v.objectId === a) || { name: a };
      const nameB = allRawsInfosJsonArray.latest.find((v) => v.objectId === b) || { name: b };

      return nameA.name.toLowerCase() < nameB.name.toLowerCase() ? -1 : 1;
    });
  });

  // Signal for raw parsing progress
  const [parsingProgress, setParsingProgress] = createSignal<ProgressPayload>({ currentModule: '', percentage: 0.0 });

  // Listen to window events from Tauri
  appWindow
    .listen(
      'PROGRESS',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ event, payload }) => {
        const progress = payload as ProgressPayload;
        setParsingProgress(progress);
        console.debug(payload);
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

  async function parseRaws() {
    const dir = directoryContext.directoryPath().join('/');

    setParsingStatus(STS_PARSING);

    try {
      const raw_file_json_string: string = await invoke('parse_raws_at_game_path', { path: dir, window: appWindow });

      await new Promise((resolve) => setTimeout(resolve, 1));
      const raw_file_data: Raw[][] = await JSON.parse(raw_file_json_string);
      setParsingStatus(STS_LOADING);

      await new Promise((resolve) => setTimeout(resolve, 1));
      setParsingProgress({ currentModule: '', percentage: 0.0 });

      // Flatten the array of arrays
      const result = raw_file_data.flat();

      const sortResult = UniqueSort(result);

      // Based on the number of results, set raws as EMPTY or IDLE
      if (sortResult.length === 0) {
        setParsingStatus(STS_EMPTY);
      } else {
        setParsingStatus(STS_IDLE);
      }

      insertBatch(searchDatabase, sortResult);

      // Reset the trigger after 50ms
      setTimeout(() => {
        setLoadRaws(false);
      }, 50);

      // return sortResult;
      return [];
    } catch (e) {
      console.error(e);
      setParsingProgress({ currentModule: '', percentage: 0.0 });
      setParsingStatus(STS_EMPTY);
    }
  }

  async function parseRawsInfo(): Promise<DFInfoFile[]> {
    const dir = directoryContext.directoryPath().join('/');

    try {
      const raw_file_data: DFInfoFile[] = JSON.parse(await invoke('parse_raws_info_at_game_path', { path: dir }));

      return raw_file_data.sort((a, b) => (a.identifier < b.identifier ? -1 : 1));
    } catch (e) {
      console.error(e);
    }
  }

  return {
    parsingStatus,
    setLoadRaws,
    parsingProgress,
    rawModulesInfo: allRawsInfosJsonArray,
    rawModules,
    searchFilteredRaws,
  };
});
