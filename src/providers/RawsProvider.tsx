import { createContextProvider } from '@solid-primitives/context';
import { invoke } from '@tauri-apps/api';
import { appWindow } from '@tauri-apps/api/window';
import { createEffect, createMemo, createResource, createSignal } from 'solid-js';
import { RawsMatchingSearchString, RawsOnlyWithTagsOrAll, RawsOnlyWithoutModules, UniqueSort, labelForModule } from '../definitions/Raw';
import type { Creature, DFInfoFile, ProgressPayload, Raw } from '../definitions/types';
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

  // Signal for loading raws
  const [loadRaws, setLoadRaws] = createSignal(false);
  // Resource for raws
  const [allRawsJsonArray] = createResource(loadRaws, parseRaws, {
    initialValue: [],
  });
  // Resource for raws info files
  const [allRawsInfosJsonArray] = createResource(loadRaws, parseRawsInfo, {
    initialValue: [],
  });
  const allRawInfoNames = createMemo<{ [module: string]: string }>(() => {
    const labeled = {};
    for (const module of allRawsInfosJsonArray.latest) {
      labeled[module.identifier] = labelForModule(module);
    }
    return labeled;
  })

  const rawModules = createMemo(() => {
    const modules = [...new Set(allRawsJsonArray.latest.map((v) => v.raw_module))];
    return modules.sort((a, b) => {
      const nameA = allRawsInfosJsonArray.latest.find(v => v.identifier === a) || { name: a };
      const nameB = allRawsInfosJsonArray.latest.find(v => v.identifier === b) || { name: b };

      return (nameA.name.toLowerCase() < nameB.name.toLowerCase()) ? -1 : 1;
    })
  });
  const [rawModuleFilters, setRawModuleFilters] = createSignal<string[]>([]);

  const addRawModuleFilter = (module: string) => {
    if (rawModuleFilters().indexOf(module) === -1) {
      setRawModuleFilters([...rawModuleFilters(), module]);
    }
  };
  const removeRawModuleFilter = (module: string) => {
    if (rawModuleFilters().indexOf(module) !== -1) {
      setRawModuleFilters(rawModuleFilters().filter((v) => v !== module));
    }
  };
  const removeAllRawModuleFilters = () => {
    setRawModuleFilters([]);
  };
  const addAllRawModuleFilters = () => {
    setRawModuleFilters(rawModules());
  };

  // Raws after filtering by the search
  const allRawsJsonSearchFiltered = createMemo(() => {

    // Filter by modules first (easiest wide amount to filter). We pre-sort the raws in one step here.
    const moduleFiltered = RawsOnlyWithoutModules(
      allRawsJsonArray.latest.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1),
      rawModuleFilters()
    );
    // Filter by required tags (somewhat expensive)
    const tagFiltered = RawsOnlyWithTagsOrAll(moduleFiltered, searchContext.requiredTagFilters());
    // Filter remaining by search tags (most expensive)
    const searchFiltered = RawsMatchingSearchString(tagFiltered, searchContext.searchString());

    return searchFiltered;
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

  // Provide access to only Creatures
  const creatureRaws = createMemo(
    () => allRawsJsonSearchFiltered().filter((x) => x.raw_type === 'Creature') as Creature[]
  );

  async function parseRaws(): Promise<Raw[]> {
    const dir = directoryContext.directoryPath().join('/');

    setParsingStatus(STS_PARSING);

    try {
      const raw_file_json_string: string = await invoke('parse_raws_at_game_path', { path: dir, window: appWindow });

      await new Promise((resolve) => setTimeout(resolve, 1));
      const raw_file_data: Raw[][] = await JSON.parse(raw_file_json_string);
      setParsingStatus(STS_LOADING);

      await new Promise((resolve) => setTimeout(resolve, 1));
      setParsingProgress({ current_module: '', percentage: 0.0 });

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
    allRawsJsonSearchFiltered,
    setLoadRaws,
    parsingProgress,
    creatureRaws,
    rawModules,
    rawModuleFilters,
    addRawModuleFilter,
    removeRawModuleFilter,
    removeAllRawModuleFilters,
    addAllRawModuleFilters,
    rawsInfo: allRawsInfosJsonArray,
  };
});
