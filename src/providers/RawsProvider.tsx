import { create, insertBatch, search } from '@lyrasearch/lyra';
import { createContextProvider } from '@solid-primitives/context';
import { invoke } from '@tauri-apps/api';
import { appWindow } from '@tauri-apps/api/window';
import { createEffect, createMemo, createResource, createSignal } from 'solid-js';
import { RawsOnlyWithTagsOrAll, RawsOnlyWithoutModules, UniqueSort } from '../definitions/Raw';
import type { DFGraphic, DFInfoFile, DFTilePage, ProgressPayload, Raw, SpriteGraphic } from '../definitions/types';
import { DIR_DF, DIR_NONE, useDirectoryProvider } from './DirectoryProvider';
import { useSearchProvider } from './SearchProvider';

export interface RawStorage {
  graphics: DFGraphic[];
  tilePages: DFTilePage[];
  raws: Raw[];
}

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
    },
  });

  // Signal for setting raw parse status
  const [parsingStatus, setParsingStatus] = createSignal(STS_IDLE);

  // Signal for loading raws
  const [loadRaws, setLoadRaws] = createSignal(false);

  // Resource for raws (actually loads raws into the search database)
  const [parsedRaws] = createResource(loadRaws, parseRaws, {
    initialValue: {
      graphics: [],
      tilePages: [],
      objects: [],
    },
  });

  // Resource for accessing the raws via search filtering
  const searchFilteredRaws = createMemo<Raw[]>(() => {
    console.log(loadRaws());

    const searchResult = search(searchDatabase, {
      term: searchContext.searchString(),
    });

    const searchFiltered: Raw[] =
      searchResult.count === 0
        ? (Object.values(searchDatabase.docs) as Raw[])
        : searchResult.hits.map((h) => h.document as Raw);

    const moduleFiltered = RawsOnlyWithoutModules(searchFiltered, searchContext.filteredModules());
    const tagFiltered = RawsOnlyWithTagsOrAll(moduleFiltered, searchContext.requiredTags());

    return tagFiltered
      .filter((r) => {
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
      })
      .sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1))
      .slice(0, MAX_RESULTS);
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
  const [parsingProgress, setParsingProgress] = createSignal<ProgressPayload>({
    currentModule: '',
    currentFile: '',
    currentLocation: '',
    currentTask: '',
    percentage: 0.0,
  });

  // Effect to parse raws when directory is changed
  createEffect(() => {
    if (directoryContext.currentDirectory().type === DIR_DF) {
      setLoadRaws(true);
    }
  });

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
    if (directoryContext.directoryHistory().length === 0) {
      setParsingStatus(STS_EMPTY);
    } else {
      setLoadRaws(true);
    }
  });

  async function parseRaws() {
    // Don't parse when set as DIR_NONE
    if (directoryContext.currentDirectory().type === DIR_NONE) {
      console.info('Skipped parsing because directory type is DIR_NONE');
      // Reset the trigger after 50ms
      setTimeout(() => {
        setLoadRaws(false);
      }, 5);
      return;
    }

    const dir = directoryContext.currentDirectory().path.join('/');

    setParsingStatus(STS_PARSING);

    const graphics: DFGraphic[] = [];
    const tilePages: DFTilePage[] = [];
    const objectRaws: Raw[] = [];

    try {
      const raw_file_json_string: string = await invoke('parse_all_raws', { gamePath: dir, window: appWindow });

      await new Promise((resolve) => setTimeout(resolve, 1));
      const raw_file_data: Raw[][] = await JSON.parse(raw_file_json_string);
      setParsingStatus(STS_LOADING);

      await new Promise((resolve) => setTimeout(resolve, 1));
      setParsingProgress({ currentModule: '', currentFile: '', currentLocation: '', currentTask: '', percentage: 0.0 });

      // Flatten and first-pass sort results by identifier.
      const raw_array = raw_file_data.flat(5).sort((a, b) => (a.identifier < b.identifier ? -1 : 1));
      console.log(`Got ${raw_array.length} raws back`);

      // Extract the graphics and tilepages
      raw_array.forEach((raw) => {
        if (raw.rawType === 'GraphicsTilePage') {
          tilePages.push(raw as DFTilePage);
        } else if (raw.rawType === 'Graphics') {
          graphics.push(raw as DFGraphic);
        } else {
          objectRaws.push(raw);
        }
      });

      const sortResult = UniqueSort(objectRaws);

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

      return {
        graphics,
        tilePages,
        objects: sortResult,
      };
    } catch (e) {
      console.error(e);
      setParsingProgress({ currentModule: '', currentFile: '', currentLocation: '', currentTask: '', percentage: 0.0 });
      setParsingStatus(STS_EMPTY);
    }

    return {
      graphics,
      tilePages,
      objects: objectRaws,
    };
  }

  async function parseRawsInfo(): Promise<DFInfoFile[]> {
    const dir = directoryContext.currentDirectory().path.join('/');

    try {
      const raw_file_data: DFInfoFile[][] = JSON.parse(await invoke('parse_all_raws_info', { path: dir }));

      // Filter unknown raw info stuff..
      const flat_raw_info = raw_file_data.flat().filter((dfi) => dfi.identifier !== 'unknown');

      return flat_raw_info.sort((a, b) => (a.identifier < b.identifier ? -1 : 1));
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  const tryGetGraphicFor = (identifier: string): { graphic: SpriteGraphic; tilePage: DFTilePage } | undefined => {
    const graphic = parsedRaws.latest.graphics.find(
      (v) => v.targetIdentifier.toLowerCase() === identifier.toLowerCase()
    );
    if (typeof graphic === 'undefined') {
      return undefined;
    }
    if (graphic.graphics.length === 0) {
      return undefined;
    }
    const sprite = graphic.graphics.find((v) => v.primaryCondition === 'Default' || v.primaryCondition === 'None');
    if (typeof sprite === 'undefined') {
      return undefined;
    }
    const tilePage = parsedRaws.latest.tilePages.find(
      (v) => v.identifier.toLowerCase() === sprite.tilePageId.toLowerCase()
    );
    if (typeof tilePage === 'undefined') {
      return undefined;
    }
    return {
      graphic: sprite,
      tilePage,
    };
  };

  return {
    parsingStatus,
    setLoadRaws,
    parsingProgress,
    rawModulesInfo: allRawsInfosJsonArray,
    rawModules,
    searchFilteredRaws,
    tryGetGraphicFor,
  };
});
