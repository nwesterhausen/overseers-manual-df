import { createContextProvider } from '@solid-primitives/context';
import { invoke } from '@tauri-apps/api';
import { appWindow } from '@tauri-apps/api/window';
import MiniSearch from 'minisearch';
import { createEffect, createMemo, createResource, createSignal } from 'solid-js';
import { RawsOnlyWithTagsOrAll, RawsOnlyWithoutModules, UniqueSort } from '../definitions/Raw';
import type { DFGraphic, DFInfoFile, DFTilePage, ProgressPayload, Raw, SpriteGraphic } from '../definitions/types';
import { DIR_DF, DIR_NONE, useDirectoryProvider } from './DirectoryProvider';
import { useSearchProvider } from './SearchProvider';
import { useSettingsContext } from './SettingsProvider';

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
  const [settings] = useSettingsContext();

  const searchDatabase = new MiniSearch({
    idField: 'objectId',
    fields: ['name', 'searchString', 'identifier'],
    searchOptions: {
      boost: {
        name: 2,
      },
      fuzzy: false,
      prefix: true,
      weights: {
        prefix: 2,
        fuzzy: 1,
      },
    },
  });

  // Signal for tracking number of mods
  const [vanillaRawCount, setVanillaRawCount] = createSignal(0);
  const [installedModRawCount, setInstalledModRawCount] = createSignal(0);
  const [downloadedModRawCount, setDownloadedModRawCount] = createSignal(0);

  // Signal for setting raw parse status
  const [parsingStatus, setParsingStatus] = createSignal(STS_IDLE);

  // Signal for loading raws
  const [loadRaws, setLoadRaws] = createSignal(false);

  // Provide "helper" for loading raws
  function forceLoadRaws() {
    // Reset total tracked number of raws when loading new ones
    setVanillaRawCount(0);
    setInstalledModRawCount(0);
    setDownloadedModRawCount(0);
    // Reset loadRaws
    setLoadRaws(true);
  }

  // Resource for raws (actually loads raws into the search database)
  const [parsedRaws] = createResource(loadRaws, parseRaws, {
    initialValue: {
      graphics: [],
      tilePages: [],
      objects: [],
    },
  });

  const [pageNum, setPageNum] = createSignal(1);
  const [totalPages, setTotalPages] = createSignal(1);

  const nextPage = () => {
    if (pageNum() >= totalPages()) {
      setPageNum(totalPages());
    } else {
      setPageNum(pageNum() + 1);
    }
  };
  const prevPage = () => {
    if (pageNum() < 1) {
      setPageNum(1);
    } else {
      setPageNum(pageNum() - 1);
    }
  };
  const gotoPage = (page: number) => {
    if (page > totalPages()) {
      setPageNum(totalPages());
    } else if (page <= 0) {
      setPageNum(0);
    } else {
      setPageNum(page);
    }
  };
  createEffect(() => {
    console.log(`Traveling to page ${pageNum()}`);
  });
  // Resource for accessing the raws via search filtering
  const searchFilteredRaws = createMemo<Raw[]>(() => {
    console.log(loadRaws());
    if (typeof parsedRaws.latest === 'undefined') {
      return [];
    }

    // Reset
    parsedRaws.latest.objects.forEach((r) => {
      r.resultScore = undefined;
    });

    let searchFiltered: Raw[] = [];
    // check if there was something searched for, if there isn't then return all.
    // otherwise, perform a search and assign resultScore to sort results.
    if (searchContext.searchString().length === 0) {
      searchFiltered = parsedRaws.latest.objects;
    } else {
      const searchResults = searchDatabase.search(searchContext.searchString());

      searchResults.forEach((result) => {
        const matchingRaw = parsedRaws.latest.objects.find((r) => r.objectId === result.id);
        if (typeof matchingRaw === 'undefined') {
          return;
        }
        if (typeof result.score !== 'number') {
          return;
        }
        matchingRaw.resultScore = result.score;
        searchFiltered.push(matchingRaw);
      });
    }

    const moduleFiltered = RawsOnlyWithoutModules(searchFiltered, searchContext.filteredModules());
    const tagFiltered = RawsOnlyWithTagsOrAll(moduleFiltered, searchContext.requiredTags());

    const finalResult = tagFiltered.filter((raw, idx, self) => {
      if (!(self.findIndex((v) => v.identifier === raw.identifier) === idx)) {
        return false;
      }
      if (searchContext.requireCreature() && raw.rawType === 'Creature') {
        return true;
      }
      if (searchContext.requirePlant() && raw.rawType === 'Plant') {
        return true;
      }
      if (searchContext.requireInorganic() && raw.rawType === 'Inorganic') {
        return true;
      }
      return false;
    });

    if (searchContext.searchString().length === 0) {
      finalResult.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1));
    } else {
      finalResult.sort((a, b) => {
        if (typeof a.resultScore !== 'number') {
          return 1;
        }

        if (typeof b.resultScore !== 'number') {
          return -1;
        }
        return a.resultScore > b.resultScore ? -1 : 1;
      });
    }

    setTotalPages(Math.floor(finalResult.length / MAX_RESULTS));
    console.log({
      MAX_RESULTS,
      total: finalResult.length,
      pages: totalPages(),
    });

    const firstResult = (pageNum() - 1) * MAX_RESULTS;
    return finalResult.slice(firstResult, firstResult + MAX_RESULTS);
  });

  // Resource for raws info files
  const [allRawsInfosJsonArray] = createResource(loadRaws, parseRawsInfo, {
    initialValue: [],
  });

  const totalRawCount = createMemo(() => {
    return parsedRaws.latest.objects.length;
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
        // console.debug(payload);
      },
    )
    .then(() => {
      console.log('Listening for progress updates from backend.');
    })
    .catch(console.error);

  // Signal no set directory
  createEffect(() => {
    if (directoryContext.currentDirectory().type !== DIR_DF) {
      setParsingStatus(STS_EMPTY);
    } else {
      setLoadRaws(true);
    }
  });

  async function parseRaws() {
    // Don't parse when set as DIR_NONE
    if (directoryContext.currentDirectory().type === DIR_NONE) {
      console.info('Skipped parsing because directory type is DIR_NONE');
      setTotalPages(1);
      setPageNum(1);
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
      const raw_file_data: Raw[][] = [];
      if (settings.includeLocationVanilla) {
        const raw_file_json_string: string = await invoke('parse_raws_in_module_location', {
          moduleLocation: dir + '/data/vanilla',
          window: appWindow,
        });

        await new Promise((resolve) => setTimeout(resolve, 1));
        const allVanillaRaws = JSON.parse(raw_file_json_string);
        setVanillaRawCount(allVanillaRaws.length);
        raw_file_data.push(allVanillaRaws);
      }

      if (settings.includeLocationMods) {
        const raw_file_json_string: string = await invoke('parse_raws_in_module_location', {
          moduleLocation: dir + '/mods',
          window: appWindow,
        });

        await new Promise((resolve) => setTimeout(resolve, 1));
        raw_file_data.push(await JSON.parse(raw_file_json_string));
        const allDownloadedMods = JSON.parse(await raw_file_json_string);
        setDownloadedModRawCount(allDownloadedMods.length);
        raw_file_data.push(allDownloadedMods);
      }

      if (settings.includeLocationInstalledMods) {
        const raw_file_json_string: string = await invoke('parse_raws_in_module_location', {
          moduleLocation: dir + '/data/installed_mods',
          window: appWindow,
        });

        await new Promise((resolve) => setTimeout(resolve, 1));
        const allInstalledMods = JSON.parse(await raw_file_json_string);
        setInstalledModRawCount(allInstalledMods.length);
        raw_file_data.push(allInstalledMods);
      }
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

      // Empty search database
      searchDatabase.removeAll();
      // Add to database
      searchDatabase
        .addAllAsync(sortResult)
        .then(() => console.log('Finished indexing raws into search database.'))
        .catch(console.error);
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
    // Don't parse when set as DIR_NONE
    if (directoryContext.currentDirectory().type === DIR_NONE) {
      console.info('Skipped parsing module infos because directory type is DIR_NONE');
      return [];
    }
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
      (v) => v.targetIdentifier.toLowerCase() === identifier.toLowerCase(),
    );
    if (typeof graphic === 'undefined') {
      return undefined;
    }
    if (graphic.graphics.length === 0) {
      return undefined;
    }
    const sprite = graphic.graphics.find(
      (v) =>
        v.primaryCondition === 'Default' ||
        v.primaryCondition === 'Shrub' ||
        v.primaryCondition === 'Crop' ||
        v.primaryCondition === 'Picked' ||
        v.primaryCondition === 'Seed' ||
        v.primaryCondition === 'Sapling' ||
        v.primaryCondition === 'None',
    );
    if (typeof sprite === 'undefined') {
      return undefined;
    }
    const tilePage = parsedRaws.latest.tilePages.find(
      (v) => v.identifier.toLowerCase() === sprite.tilePageId.toLowerCase(),
    );
    if (typeof tilePage === 'undefined') {
      return undefined;
    }
    return {
      graphic: sprite,
      tilePage,
    };
  };
  const allGraphicsFor = (identifier: string): DFGraphic | undefined => {
    return parsedRaws.latest.graphics.find((v) => v.targetIdentifier.toLowerCase() === identifier.toLowerCase());
  };

  return {
    parsingStatus,
    forceLoadRaws,
    parsingProgress,
    rawModulesInfo: allRawsInfosJsonArray,
    rawModules,
    searchFilteredRaws,
    tryGetGraphicFor,
    allGraphicsFor,
    nextPage,
    prevPage,
    pageNum,
    totalPages,
    gotoPage,
    vanillaRawCount,
    installedModRawCount,
    downloadedModRawCount,
    totalRawCount,
  };
});
