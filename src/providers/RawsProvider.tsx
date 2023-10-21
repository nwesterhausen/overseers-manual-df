import { createContextProvider } from '@solid-primitives/context';
import { invoke } from '@tauri-apps/api/primitives';
import { getCurrent } from '@tauri-apps/api/window';
import { createEffect, createMemo, createResource, createSignal } from 'solid-js';
import { Graphic } from '../definitions/Graphic';
import { ModuleInfoFile } from '../definitions/ModuleInfoFile';
import { ParserOptions } from '../definitions/ParserOptions';
import { ProgressPayload } from '../definitions/ProgressPayload';
import { SearchResults } from '../definitions/SearchResults';
import { SpriteGraphic } from '../definitions/SpriteGraphic';
import { TilePage } from '../definitions/TilePage';
import { DIR_NONE, useDirectoryProvider } from './DirectoryProvider';
import { useSearchProvider } from './SearchProvider';
import { useSettingsContext } from './SettingsProvider';

// TODO:
// - [ ] Setup a separate "resource" that tells the backend to parse the raws
// - [ ] Update our parse raws resource to execute the search_raws functions
// - [ ] Update the calls that require raws to be reloaded (change types/locations/etc)

// Statuses for the parsing status
export const STS_PARSING = 'Parsing Raws',
  STS_LOADING = 'Loading Raws',
  STS_IDLE = 'Idle',
  STS_EMPTY = 'Idle/No Raws';

const emptySearchResults: SearchResults = {
  results: [],
  totalPages: 1,
  totalResults: 0,
};
const emptyParsingStatus: ProgressPayload = {
  currentModule: '',
  currentFile: '',
  currentLocation: '',
  currentTask: '',
  percentage: 0.0,
  runningTotal: 0,
};

export const [RawsProvider, useRawsProvider] = createContextProvider(() => {
  const appWindow = getCurrent();

  const directoryContext = useDirectoryProvider();
  const searchContext = useSearchProvider();
  const [settings, { setCurrentResultsPage }] = useSettingsContext();

  // Signal for setting raw parse status
  const [parsingStatus, setParsingStatus] = createSignal(STS_IDLE);

  // Signal for loading raws
  const [loadRaws, setLoadRaws] = createSignal(false);

  // Provide "helper" for loading raws
  function forceLoadRaws() {
    // Reset loadRaws
    setLoadRaws(true);
  }

  // Resource for raws (actually loads raws into the search database)
  const [_parsedRaws] = createResource(loadRaws, parseRaws);
  const [searchResults, { refetch }] = createResource(searchContext.searchOptions, updateDisplayedRaws, {
    name: 'pageOfParsedRaws',
    initialValue: emptySearchResults,
  });

  const nextPage = () => {
    if (settings.currentPage >= searchResults.latest.totalPages) {
      setCurrentResultsPage(searchResults.latest.totalPages);
    } else {
      setCurrentResultsPage(settings.currentPage + 1);
    }
  };
  const prevPage = () => {
    if (settings.currentPage < 1) {
      setCurrentResultsPage(1);
    } else {
      setCurrentResultsPage(settings.currentPage - 1);
    }
  };
  const gotoPage = (page: number) => {
    if (page > searchResults.latest.totalPages) {
      setCurrentResultsPage(searchResults.latest.totalPages);
    } else if (page <= 0) {
      setCurrentResultsPage(0);
    } else {
      setCurrentResultsPage(page);
    }
  };
  createEffect(() => {
    console.log(`Traveling to page ${settings.currentPage}`);
  });

  // Resource for raws info files
  const [allRawsInfosJsonArray] = createResource(loadRaws, parseRawsInfo, {
    initialValue: [],
  });

  const rawModules = createMemo(() => {
    const modules = [...new Set(allRawsInfosJsonArray.latest.map((v) => v.identifier))];
    return modules.sort((a, b) => {
      const nameA = allRawsInfosJsonArray.latest.find((v) => v.identifier === a) || { name: a };
      const nameB = allRawsInfosJsonArray.latest.find((v) => v.identifier === b) || { name: b };

      return nameA.name.toLowerCase() < nameB.name.toLowerCase() ? -1 : 1;
    });
  });

  // Signal for raw parsing progress
  const [parsingProgress, setParsingProgress] = createSignal<ProgressPayload>(emptyParsingStatus);

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

  const resetPage = () => {
    setCurrentResultsPage(1);
  };

  createEffect(() => {
    if (settings.directoryPath !== '') {
      setLoadRaws(true);
      resetPage();
    } else {
      setParsingStatus(STS_EMPTY);
      setParsingProgress(emptyParsingStatus);
    }
  });

  async function parseRaws(): Promise<void> {
    // Don't parse when empty directory
    if (settings.directoryPath === '') {
      console.info('Skipped parsing because directory type is DIR_NONE');
      resetPage();
      // Reset the trigger after 50ms
      setTimeout(() => {
        setLoadRaws(false);
      }, 5);
      return;
    }

    // Update parsing status
    setParsingStatus(STS_PARSING);

    try {
      // See the function in dfraw_json_parser/src/lib.rs for more info
      // The function in our lib.rs simply passes this through (more or less)

      const parsingOptions: ParserOptions = {
        targetPath: settings.directoryPath,
        attachMetadataToRaws: true,
        skipApplyCopyTagsFrom: false,
        skipApplyCreatureVariations: false,
        rawsToParse: [],
        locationsToParse: [],
        job: 'All',
        serializeResultToJson: false,
        outputPath: '',
        outputToFile: false,
      };

      if (settings.includeLocationVanilla) {
        parsingOptions.locationsToParse.push('Vanilla');
      }
      if (settings.includeLocationInstalledMods) {
        parsingOptions.locationsToParse.push('InstalledMods');
      }
      if (settings.includeLocationMods) {
        parsingOptions.locationsToParse.push('Mods');
      }
      // Shortcut the parsing if there are no locations to parse
      if (parsingOptions.locationsToParse.length === 0) {
        return;
      }
      // Update the job if there is only one location to parse
      if (parsingOptions.locationsToParse.length === 1) {
        parsingOptions.job = 'SingleLocation';
      }

      console.log('Parsing options', parsingOptions);

      // Have the backend parse the raws
      await invoke('parse_and_store_raws', {
        options: parsingOptions,
        window: appWindow,
      });

      // Wait for 1ms to allow the progress bar to update (hack)
      await new Promise((resolve) => setTimeout(resolve, 1));

      // Update parsing status
      setParsingStatus(STS_LOADING);

      // Wait for 1ms to allow the progress bar to update (hack)
      await new Promise((resolve) => setTimeout(resolve, 1));

      // Update parsing status (reset it)
      setParsingProgress(emptyParsingStatus);
      setParsingStatus(STS_IDLE);

      // Update the search results
      refetch();
    } catch (e) {
      console.error(e);
      setParsingProgress(emptyParsingStatus);
      setParsingStatus(STS_EMPTY);
    }
  }

  async function updateDisplayedRaws(): Promise<SearchResults> {
    // Get the raws that we care about (page 1 basically)
    return await invoke('search_raws', {
      window: appWindow,
      searchOptions: searchContext.searchOptions(),
    });
  }

  async function parseRawsInfo(): Promise<ModuleInfoFile[]> {
    // Don't parse when empty directory
    if (settings.directoryPath === '') {
      return [];
    }

    try {
      const raw_file_data: ModuleInfoFile[] = await invoke('parse_all_raws_info', { path: settings.directoryPath });

      // Filter unknown raw info stuff..
      const flat_raw_info = raw_file_data.flat().filter((dfi) => dfi.identifier !== 'unknown');

      return flat_raw_info.sort((a, b) => (a.identifier < b.identifier ? -1 : 1));
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  const tryGetGraphicFor = (identifier: string): { graphic: SpriteGraphic; tilePage: TilePage } | undefined => {
    // Todo: replace with a tauri invoke to get the graphic...
    identifier.toLowerCase();
    return undefined;
  };
  const allGraphicsFor = (identifier: string): Graphic | undefined => {
    // Todo: replace with a tauri invoke to get all the graphic...
    identifier.toLowerCase();
    return undefined;
  };

  // We can check if the directory is valid and if so, load the raws
  createEffect(() => {
    if (directoryContext.currentDirectory().type !== DIR_NONE) {
      forceLoadRaws();
    }
  });

  return {
    parsingStatus,
    forceLoadRaws,
    parsingProgress,
    rawModulesInfo: allRawsInfosJsonArray,
    rawModules,
    tryGetGraphicFor,
    allGraphicsFor,
    nextPage,
    prevPage,
    gotoPage,
    parsedRaws: searchResults,
  };
});
