/**
 * RawsProvider is a context provider that handles loading (and parsing) raws and exposing
 * them to the rest of the application.
 *
 * It relies on the SearchProvider to get the search options.
 *
 * It also relies on the SettingsProvider to get the directory path and the parsing options.
 * Settings also provides the number of results per page and the current page.
 */
import { createContextProvider } from '@solid-primitives/context';
import { invoke } from '@tauri-apps/api/primitives';
import { getCurrent } from '@tauri-apps/api/window';
import { createEffect, createResource, createSignal } from 'solid-js';
import { ModuleInfoFile } from '../definitions/ModuleInfoFile';
import { ObjectType } from '../definitions/ObjectType';
import { ParserOptions } from '../definitions/ParserOptions';
import { ProgressPayload } from '../definitions/ProgressPayload';
import { SearchResults } from '../definitions/SearchResults';
import {
  COMMAND_PARSE_AND_STORE_RAWS,
  COMMAND_PARSE_RAWS_INFO,
  COMMAND_SEARCH_RAWS,
  DEFAULT_PARSING_STATUS,
  DEFAULT_SEARCH_RESULT,
  PARSING_PROGRESS_EVENT,
  STS_EMPTY,
  STS_IDLE,
  STS_PARSING,
} from '../lib/Constants';
import { useSearchProvider } from './SearchProvider';
import { useSettingsContext } from './SettingsProvider';

// TODO:
// - [ ] Setup a separate "resource" that tells the backend to parse the raws
// - [ ] Update our parse raws resource to execute the search_raws functions
// - [ ] Update the calls that require raws to be reloaded (change types/locations/etc)

export const [RawsProvider, useRawsProvider] = createContextProvider(() => {
  /**
   * The current window (used for listening to events)
   */
  const appWindow = getCurrent();

  // Load the various contexts we need
  const searchContext = useSearchProvider();
  const [settings, { setTotalResults, resetPage }] = useSettingsContext();

  // Signal for setting raw parse status
  // This signal is exposed and is used in many components to affect how they render
  const [parsingStatus, setParsingStatus] = createSignal(STS_IDLE);

  // Signal for loading raws
  const [loadRaws, setLoadRaws] = createSignal(false);

  // Signal for previous search options
  const [previousSearchOptions, setPreviousSearchOptions] = createSignal(searchContext.searchOptions());

  // This effect is responsible for telling the backend to parse the raws. It will go off
  // whenever the loadRaws signal is set to true. It will also reset the page to 1 and clear
  // the search string.
  // When the raws are done parsing, it will set the loadRaws signal to false, which will
  // enable it to be triggered again.
  createEffect(async () => {
    if (loadRaws()) {
      resetPage();
      searchContext.setSearchString('');
      await parseRaws();
      setLoadRaws(false);
    }
  });

  // The resource for raws which is exposed to the rest of the application.
  const [searchResults, { refetch }] = createResource(updateSearchResults, {
    name: 'pageOfParsedRaws',
    initialValue: DEFAULT_SEARCH_RESULT,
  });

  // Effect to update the search results when the search options change
  createEffect(() => {
    // Only update if the search options have changed (deep compare) OR if the total results is 0 (optimistic update)
    if (
      searchResults.latest.totalResults === 0 ||
      JSON.stringify(searchContext.searchOptions()) !== JSON.stringify(previousSearchOptions())
    ) {
      refetch();
    } else {
      console.log('Search options have not changed and were loaded before, skipping update.');
    }
  });

  // Signal to update the raw module info files data
  const [updateRawsInfo, setUpdateRawsInfo] = createSignal(false);
  // Resource for raws' modules info.txt files (as restricted by the search options)
  const [rawModulesInfo] = createResource(updateRawsInfo, parseRawsInfo, {
    initialValue: [],
  });

  // Signal for raw parsing progress
  const [parsingProgress, setParsingProgress] = createSignal<ProgressPayload>(DEFAULT_PARSING_STATUS);

  // Listen to window events from Tauri
  appWindow
    .listen(
      PARSING_PROGRESS_EVENT,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ event, payload }) => {
        const progress = payload as ProgressPayload;
        setParsingProgress(progress);
        // console.debug(payload);
      },
    )
    .then(() => {
      console.log('✓ Listening for progress updates from backend.');
    })
    .catch(console.error);

  createEffect(() => {
    if (settings.directoryPath !== '') {
      setLoadRaws(true);
      resetPage();
    } else {
      setParsingStatus(STS_EMPTY);
      setParsingProgress(DEFAULT_PARSING_STATUS);
    }
  });

  /**
   * Function which tells the backend to parse the raws.
   *
   * @returns A promise which resolves when the raws are done parsing
   */
  async function parseRaws(): Promise<void> {
    // Don't parse when not ready
    if (settings.ready !== true || settings.directoryPath === '') {
      console.info('Skipped parsing because settings are not initialized / the directory is not set');
      resetPage();
      // Reset the trigger after 50ms
      setTimeout(() => {
        setLoadRaws(false);
      }, 5);
      // EXIT EARLY
      return;
    }

    // Update parsing status
    setParsingStatus(STS_PARSING);

    try {
      // See the function in dfraw_json_parser/src/lib.rs for more info
      // The function in our lib.rs simply passes this through (more or less)
      const objectTypesToParse: ObjectType[] = [
        ...settings.parseObjectTypes,
        // Include graphics details
        'Graphics',
        'TilePage',
      ];

      const parsingOptions: ParserOptions = {
        targetPath: settings.directoryPath,
        attachMetadataToRaws: true,
        skipApplyCopyTagsFrom: false,
        skipApplyCreatureVariations: false,
        rawsToParse: objectTypesToParse,
        locationsToParse: settings.parseLocations,
        job: 'All',
        serializeResultToJson: false,
        outputPath: '',
        outputToFile: false,
      };

      // Shortcut the parsing if there are no locations to parse
      if (parsingOptions.locationsToParse.length === 0) {
        return;
      }
      // Update the job if there is only one location to parse
      if (parsingOptions.locationsToParse.length === 1) {
        parsingOptions.job = 'SingleLocation';
      }

      // Have the backend parse the raws
      await invoke(COMMAND_PARSE_AND_STORE_RAWS, {
        options: parsingOptions,
      });

      // Update parsing status (reset it)
      setParsingProgress(DEFAULT_PARSING_STATUS);
      setParsingStatus(STS_IDLE);

      // Update the search results
      refetch();
      // Update the raw modules
      setUpdateRawsInfo(true);
    } catch (e) {
      console.error(e);
      setParsingProgress(DEFAULT_PARSING_STATUS);
      setParsingStatus(STS_EMPTY);
    }
  }

  /**
   * Get raws from the backend and update the total results. This executes a search.
   *
   * @returns The search results
   */
  async function updateSearchResults(): Promise<SearchResults> {
    const results = (await invoke(COMMAND_SEARCH_RAWS, {
      window: appWindow,
      searchOptions: searchContext.searchOptions(),
    })) as SearchResults;
    setTotalResults(results.totalResults);

    // Update the previous search options
    setPreviousSearchOptions(searchContext.searchOptions());

    return results;
  }

  /**
   * Parse the raws' modules info.txt files (as restricted by the search options)
   *
   * @returns The raws' modules info.txt files data
   */
  async function parseRawsInfo(): Promise<ModuleInfoFile[]> {
    // Don't parse when empty directory
    if (settings.directoryPath === '') {
      setTimeout(() => setUpdateRawsInfo(false), 5);
      return [];
    }

    // See the function in dfraw_json_parser/src/lib.rs for more info
    // The function in our lib.rs simply passes this through (more or less)
    const objectTypesToParse: ObjectType[] = [
      ...settings.parseObjectTypes,
      // Include graphics details
      'Graphics',
      'TilePage',
    ];

    const parsingOptions: ParserOptions = {
      targetPath: settings.directoryPath,
      attachMetadataToRaws: false,
      skipApplyCopyTagsFrom: false,
      skipApplyCreatureVariations: false,
      rawsToParse: objectTypesToParse,
      locationsToParse: settings.parseLocations,
      job: 'AllModuleInfoFiles',
      serializeResultToJson: false,
      outputPath: '',
      outputToFile: false,
    };

    try {
      const raw_file_data: ModuleInfoFile[] = await invoke(COMMAND_PARSE_RAWS_INFO, {
        options: parsingOptions,
      });

      // Filter unknown raw info stuff..
      const flat_raw_info = raw_file_data
        .flat()
        .filter((dfi) => dfi.identifier !== 'unknown')
        .sort((a, b) => (a.objectId < b.objectId ? -1 : 1));
      // Reset on timer
      setTimeout(() => setUpdateRawsInfo(false), 5);
      return flat_raw_info;
    } catch (e) {
      console.error(e);
    }
    // Reset
    setTimeout(() => setUpdateRawsInfo(false), 5);
    return [];
  }

  // We can check if the directory is valid and if so, load the raws
  createEffect(() => {
    if (settings.directoryPath.length > 0 && settings.ready === true) {
      setLoadRaws(true);
    }
  });

  return {
    parsingStatus,
    setLoadRaws,
    parsingProgress,
    rawModulesInfo,
    parsedRaws: searchResults,
  };
});
