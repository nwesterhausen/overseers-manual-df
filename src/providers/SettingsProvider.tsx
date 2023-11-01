import { message } from '@tauri-apps/plugin-dialog';
import { Store as TauriStore } from '@tauri-apps/plugin-store';
import { JSX, ParentProps, createContext, createEffect, createSignal, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Biome } from '../definitions/Biome';
import { ObjectType } from '../definitions/ObjectType';
import { RawModuleLocation } from '../definitions/RawModuleLocation';
import { SETTINGS_DEFAULTS, SETTINGS_FILE_NAME } from '../lib/Constants';

type SettingsStore = [
  {
    /**
     * The version of the data. This is used to determine if we need to reset the settings.
     */
    dataVersion: number;
    /**
     * Whether or not to display the results as a grid.
     */
    layoutAsGrid: boolean;
    /**
     * Whether or not to display graphics.
     */
    displayGraphics: boolean;
    /**
     * The object types to include when parsing raws.
     */
    parseObjectTypes: ObjectType[];
    /**
     * The locations to include when parsing raws.
     */
    parseLocations: RawModuleLocation[];
    /**
     * The number of results to display per page.
     */
    resultsPerPage: number;
    /**
     * The path to the game directory.
     */
    directoryPath: string;
    /**
     * The current page of results. Must always be `>= 1`.
     */
    currentPage: number;
    /**
     * The total number of results. Must always be `>= 0`.
     */
    totalResults: number;
    /**
     * The total number of pages of results. Must always be `>= 1`.
     */
    totalPages: number;
    /**
     * The object types to include when filtering results.
     */
    includeObjectTypes: ObjectType[];
    /**
     * The biomes to include when filtering results.
     */
    includeBiomes: Biome[];
    /**
     * The locations to include when filtering results.
     */
    includeLocations: RawModuleLocation[];
    /**
     * The modules to include when filtering results.
     */
    includeModules: string[];
  },
  {
    /**
     * Toggle whether or not to display the results as a grid.
     *
     * @returns void
     */
    toggleLayoutAsGrid: () => void;
    /**
     * Toggle whether or not to display graphics.
     *
     * @returns void
     */
    toggleDisplayGraphics: () => void;
    /**
     * Check if a given object type is included. This can represent either parsing or filtering.
     *
     * @param type - The object type to check
     * @param forParsing - Whether or not to only check parsing. By default, this is false (and it will check filtering).
     * @returns Whether or not the object type is included
     */
    objectTypeIncluded: (type: ObjectType, forParsing: boolean) => boolean;
    /**
     * Toggle a given object type. This can affect either parsing or filtering.
     *
     * @param type - The object type to toggle
     * @param forParsing - Whether or not to only affect parsing. By default, this is false (and it will affect filtering).
     * @returns void
     */
    toggleObjectType: (type: ObjectType, forParsing: boolean) => void;
    /**
     * Check if a given location is included. This can represent either parsing or filtering.
     *
     * @param type - The location to check
     * @param forParsing - Whether or not to only check parsing. By default, this is false (and it will check filtering).
     * @returns Whether or not the location is included
     */
    locationIncluded: (type: RawModuleLocation, forParsing: boolean) => boolean;
    /**
     * Toggle a given location. This can affect either parsing or filtering.
     *
     * @param type - The location to toggle
     * @param forParsing - Whether or not to only affect parsing. By default, this is false (and it will affect filtering).
     * @returns void
     */
    toggleLocation: (type: RawModuleLocation, forParsing: boolean) => void;
    /**
     * Set the path to the game directory.
     *
     * @param path - The path to the game directory
     * @returns void
     */
    setDirectoryPath: (path: string) => void;
    // These are for filtering
    /**
     * Reset all settings to their default values. This persists to disk.
     *
     * @returns void
     */
    resetToDefaults: () => void;
    /**
     * Add biomes to the list of biomes to filter in the results.
     *
     * @param biomes - The biomes to add
     * @returns void
     */
    updateFilteredBiomes: (biomes: Biome[]) => void;
    /**
     * Add locations to the list of locations to filter in the results.
     *
     * @param locations - The locations to add
     * @returns void
     */
    updateFilteredLocations: (locations: RawModuleLocation[]) => void;
    /**
     * Add modules to the list of modules to filter in the results.
     *
     * @param modules - The modules to add
     * @returns void
     */
    updateFilteredModules: (modules: string[]) => void;
    // These are for page-related functions
    /**
     * Load the next page of results.
     *
     * @returns void
     */
    nextPage: () => void;
    /**
     * Load the previous page of results.
     *
     * @returns void
     */
    prevPage: () => void;
    /**
     * Load the specified page of results.
     *
     * @param page - The page to load
     * @returns void
     */
    gotoPage: (page: number) => void;
    /**
     * Helper function to reset the page to 1.
     *
     * @returns void
     */
    resetPage: () => void;
    /**
     * Set the total number of results.
     *
     * @param num - The total number of results
     * @returns void
     */
    setTotalResults: (num: number) => void;
    /**
     * Set the number of results to display per page.
     *
     * @param num - The number of results to display per page
     * @returns void
     */
    setResultsPerPage: (num: number) => void;
  },
];

/**
 * The settings store that is used to store settings to disk.
 *
 * This is done via the Tauri Store plugin.
 */
const tauriSettingsStore = new TauriStore(SETTINGS_FILE_NAME);

/**
 * The settings context that is used to store settings in memory.
 *
 * It is initialized with the default settings and a dummy set of functions.
 * Once loaded from disk, the functions are updated to actually do something.
 */
const SettingsContext = createContext<SettingsStore>([
  {
    ...SETTINGS_DEFAULTS,
  },
  {
    toggleLayoutAsGrid() {
      console.log('Un-initialized settings provider.');
    },
    toggleDisplayGraphics() {
      console.log('Un-initialized settings provider.');
    },
    setResultsPerPage(num: number) {
      console.log('Un-initialized settings provider.', num);
    },
    setDirectoryPath(path: string) {
      console.log('Un-initialized settings provider.', path);
    },
    objectTypeIncluded(type: ObjectType, parsingOnly: boolean) {
      console.log('Un-initialized settings provider.', type, parsingOnly);
      return false;
    },
    toggleObjectType(type: ObjectType, parsingOnly: boolean) {
      console.log('Un-initialized settings provider.', type, parsingOnly);
    },
    resetToDefaults() {
      console.log('Un-initialized settings provider.');
    },
    updateFilteredBiomes(biomes: string[]) {
      console.log('Un-initialized settings provider.', biomes);
    },
    updateFilteredLocations(locations: RawModuleLocation[]) {
      console.log('Un-initialized settings provider.', locations);
    },
    locationIncluded(location: RawModuleLocation, parsingOnly: boolean) {
      console.log('Un-initialized settings provider.', location, parsingOnly);
      return false;
    },
    toggleLocation(location: RawModuleLocation, parsingOnly: boolean) {
      console.log('Un-initialized settings provider.', location, parsingOnly);
    },
    updateFilteredModules(modules: string[]) {
      console.log('Un-initialized settings provider.', modules);
    },
    nextPage() {
      console.log('Un-initialized settings provider.');
    },
    prevPage() {
      console.log('Un-initialized settings provider.');
    },
    gotoPage(page: number) {
      console.log('Un-initialized settings provider.', page);
    },
    resetPage() {
      console.log('Un-initialized settings provider.');
    },
    setTotalResults(num: number) {
      console.log('Un-initialized settings provider.', num);
    },
  },
]);

/**
 * Resets all saved settings to their default values.
 * @returns A promise that resolves when the settings have been reset.
 */
async function resetSavedSettingsToDefaults() {
  // Reset
  await tauriSettingsStore.clear();
  await tauriSettingsStore.reset();
  await tauriSettingsStore.save();
  // Load defaults
  await tauriSettingsStore.set('layoutAsGrid', SETTINGS_DEFAULTS.layoutAsGrid);
  await tauriSettingsStore.set('displayGraphics', SETTINGS_DEFAULTS.displayGraphics);
  await tauriSettingsStore.set('parseLocations', SETTINGS_DEFAULTS.parseLocations);
  await tauriSettingsStore.set('resultsPerPage', SETTINGS_DEFAULTS.resultsPerPage);
  await tauriSettingsStore.set('directoryPath', SETTINGS_DEFAULTS.directoryPath);
  await tauriSettingsStore.set('includeObjectTypes', SETTINGS_DEFAULTS.includeObjectTypes);
  await tauriSettingsStore.set('includeBiomes', SETTINGS_DEFAULTS.includeBiomes);
  await tauriSettingsStore.set('includeLocations', SETTINGS_DEFAULTS.includeLocations);
  await tauriSettingsStore.set('includeModules', SETTINGS_DEFAULTS.includeModules);
  await tauriSettingsStore.set('dataVersion', SETTINGS_DEFAULTS.dataVersion);
  // Save
  await tauriSettingsStore.save();
}

/**
 * The actual wrapper component that provides the settings context.
 *
 * @param props - The props to pass to the component (will be its children, i.e. the app)
 * @returns The settings context provider
 */
export function SettingsProvider(props: ParentProps): JSX.Element {
  // Create the store
  const [state, setState] = createStore({
    ...SETTINGS_DEFAULTS,
  });

  /**
   * Loads a setting from disk or sets it to the default value if it does not exist.
   *
   * @param key - The key to load
   * @returns A promise that resolves when the setting has been loaded.
   */
  async function loadFromStoreOrDefault(key: keyof typeof SETTINGS_DEFAULTS) {
    if (typeof (await tauriSettingsStore.get(key)) === 'undefined') {
      await tauriSettingsStore.set(key, SETTINGS_DEFAULTS[key]);
    } else {
      const loadedVal = await tauriSettingsStore.get(key);
      setState(key, loadedVal as (typeof SETTINGS_DEFAULTS)[typeof key]);
      console.log(`Loaded ${key}`, state[key as keyof typeof state]);
      console.log(`Loaded ${key}`, state[key]);
    }
  }

  // Attempt to load the settings from disk
  tauriSettingsStore.load().then(async () => {
    console.log('Loading settings from disk.');
    // If the settings file does not exist, create it..

    // Check for an old setting and if we find it, we need to force an update
    const dataVersion = await tauriSettingsStore.get('dataVersion');
    if (typeof dataVersion !== 'number' && dataVersion !== SETTINGS_DEFAULTS.dataVersion) {
      await message(
        `Overseer's Manual has updated and changed what settings are stored. Your settings have been reset to the defaults. Sorry for the inconvenience!`,
        {
          okLabel: 'Acknowledge',
          title: `Overseer's Manual Settings Check`,
          type: 'warning',
        },
      );
      await resetSavedSettingsToDefaults();
      return;
    }

    // Load the rest of the settings from disk.
    loadFromStoreOrDefault('layoutAsGrid');
    loadFromStoreOrDefault('displayGraphics');
    loadFromStoreOrDefault('parseObjectTypes');
    loadFromStoreOrDefault('parseLocations');
    loadFromStoreOrDefault('resultsPerPage');
    loadFromStoreOrDefault('directoryPath');
    loadFromStoreOrDefault('includeObjectTypes');
    loadFromStoreOrDefault('includeBiomes');
    loadFromStoreOrDefault('includeLocations');
    loadFromStoreOrDefault('includeModules');
  });

  // Signal to indicate if settings have changed (requiring a flush to disk)
  const [settingsChanged, setSettingsChanged] = createSignal(false);

  createEffect(async () => {
    if (settingsChanged()) {
      console.log('Settings changed. Flushing to disk.');

      // For each setting, we update the store
      await tauriSettingsStore.set('layoutAsGrid', state.layoutAsGrid);
      await tauriSettingsStore.set('displayGraphics', state.displayGraphics);
      await tauriSettingsStore.set('parseLocations', state.parseLocations);
      await tauriSettingsStore.set('resultsPerPage', state.resultsPerPage);
      await tauriSettingsStore.set('directoryPath', state.directoryPath);
      await tauriSettingsStore.set('includeObjectTypes', state.includeObjectTypes);
      await tauriSettingsStore.set('includeBiomes', state.includeBiomes);
      await tauriSettingsStore.set('includeLocations', state.includeLocations);
      await tauriSettingsStore.set('includeModules', state.includeModules);

      setSettingsChanged(false);

      await tauriSettingsStore.save();
    }
  });

  const defaultSettings = [
    state,
    {
      toggleLayoutAsGrid() {
        setState('layoutAsGrid', !state.layoutAsGrid);
        setSettingsChanged(true);
      },
      toggleDisplayGraphics() {
        setState('displayGraphics', !state.displayGraphics);
        setSettingsChanged(true);
      },
      setResultsPerPage(num: number) {
        setState('resultsPerPage', num);
        setSettingsChanged(true);
      },
      setDirectoryPath(path: string) {
        setState('directoryPath', path);
        setSettingsChanged(true);
      },
      objectTypeIncluded(type: ObjectType, parsingOnly: boolean) {
        if (parsingOnly) {
          return state.parseObjectTypes.includes(type);
        }
        return state.includeObjectTypes.includes(type);
      },
      toggleObjectType(type: ObjectType, parsingOnly: boolean) {
        if (parsingOnly) {
          if (state.parseObjectTypes.includes(type)) {
            setState(
              'parseObjectTypes',
              state.parseObjectTypes.filter((t) => t !== type),
            );
          } else {
            setState('parseObjectTypes', [...state.parseObjectTypes, type]);
          }
        } else {
          if (state.includeObjectTypes.includes(type)) {
            setState(
              'includeObjectTypes',
              state.includeObjectTypes.filter((t) => t !== type),
            );
          } else {
            setState('includeObjectTypes', [...state.includeObjectTypes, type]);
          }
        }
        setSettingsChanged(true);
      },
      resetToDefaults() {
        setState({ ...SETTINGS_DEFAULTS });
        setSettingsChanged(true);
      },
      biomeIncluded(biome: Biome) {
        return state.includeBiomes.includes(biome);
      },
      toggleBiome(biome: Biome) {
        if (state.includeBiomes.includes(biome)) {
          setState(
            'includeBiomes',
            state.includeBiomes.filter((b) => b !== biome),
          );
        } else {
          setState('includeBiomes', [...state.includeBiomes, biome]);
        }
        setSettingsChanged(true);
      },
      updateFilteredBiomes(biomes: Biome[]) {
        setState('includeBiomes', biomes);
        console.log('Updated biomes', biomes);
        setSettingsChanged(true);
      },
      updateFilteredLocations(locations: RawModuleLocation[]) {
        setState('includeLocations', locations);
        console.log('Updated locations', locations);
        setSettingsChanged(true);
      },
      locationIncluded(location: RawModuleLocation, forParsing: boolean) {
        if (forParsing) {
          return state.parseLocations.includes(location);
        }
        return state.includeLocations.includes(location);
      },
      toggleLocation(location: RawModuleLocation, forParsing: boolean) {
        if (forParsing) {
          if (state.parseLocations.includes(location)) {
            setState(
              'parseLocations',
              state.parseLocations.filter((t) => t !== location),
            );
          } else {
            setState('parseLocations', [...state.parseLocations, location]);
          }
        } else {
          if (state.includeLocations.includes(location)) {
            setState(
              'includeLocations',
              state.includeLocations.filter((t) => t !== location),
            );
          } else {
            setState('includeLocations', [...state.includeLocations, location]);
          }
        }
        setSettingsChanged(true);
      },
      updateFilteredModules(modules: string[]) {
        setState('includeModules', modules);
        console.log('Updated modules', modules);
        setSettingsChanged(true);
      },
      nextPage() {
        if (state.currentPage >= state.totalPages) {
          setState('currentPage', state.totalPages);
        } else {
          setState('currentPage', state.currentPage + 1);
        }
      },
      prevPage() {
        if (state.currentPage <= 1) {
          setState('currentPage', 1);
        } else {
          setState('currentPage', state.currentPage - 1);
        }
      },
      gotoPage(page: number) {
        if (page > state.totalPages) {
          if (state.totalPages === 1) {
            setState('currentPage', 1);
          } else {
            setState('currentPage', state.totalPages);
          }
        } else if (page <= 0) {
          setState('currentPage', 1);
        } else {
          setState('currentPage', page);
        }
      },
      resetPage() {
        setState('currentPage', 1);
      },
      setTotalResults(num: number) {
        setState('totalResults', num);
        // Guard against divide by zero
        if (state.resultsPerPage === 0 || isNaN(state.resultsPerPage)) {
          setState('resultsPerPage', SETTINGS_DEFAULTS.resultsPerPage);
          setSettingsChanged(true);
        }
        setState('totalPages', Math.ceil(num / state.resultsPerPage));
      },
    },
  ];

  return <SettingsContext.Provider value={defaultSettings as SettingsStore}>{props.children}</SettingsContext.Provider>;
}

/**
 * A hook to get the settings context.
 */
export function useSettingsContext() {
  return useContext(SettingsContext);
}
