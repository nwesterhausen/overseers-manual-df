import { Event, listen } from '@tauri-apps/api/event';
import { message } from '@tauri-apps/plugin-dialog';
import { Store as TauriStore } from '@tauri-apps/plugin-store';
import { JSX, ParentProps, createContext, createEffect, createSignal, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Biome } from '../definitions/Biome';
import { ObjectType } from '../definitions/ObjectType';
import { RawModuleLocation } from '../definitions/RawModuleLocation';
import { SETTINGS_DEFAULTS, SETTINGS_FILE_NAME } from '../lib/Constants';
import { getDwarfDirectoryPath } from '../lib/DirectoryActions';

export type ParsingSettings = {
  /**
   * The object types to include when parsing raws.
   */
  objectTypes: ObjectType[];
  /**
   * The locations to include when parsing raws.
   */
  locations: RawModuleLocation[];
  /**
   * Individual raw files to parse.
   */
  rawFiles: string[];
  /**
   * Individual raw modules to parse.
   */
  rawModules: string[];
  /**
   * Specific legends exports to parse.
   */
  legendsExports: string[];
  /**
   * Specific module `info.txt` files to parse.
   */
  moduleInfoFiles: string[];
  /**
   * Dwarf Fortress game directory.
   */
  directoryPath: string;
};

export type FilteringSettings = {
  /**
   * The object types to include when filtering results.
   */
  objectTypes: ObjectType[];
  /**
   * The biomes to include when filtering results.
   */
  biomes: Biome[];
  /**
   * The modules to include when filtering results (by objectId).
   */
  modules: string[];
  /**
   * The tags to include when filtering results.
   */
  tags: TagFilter[];
};

export type SettingsStore = [
  {
    /**
     * The version of the data. This is used to determine if we need to reset the settings.
     */
    dataVersion: number;
    /**
     * Parsing settings.
     */
    parsing: ParsingSettings;
    /**
     * Filtering settings.
     */
    filtering: FilteringSettings;
    /**
     * Whether or not to display the results as a grid.
     */
    layoutAsGrid: boolean;
    /**
     * Whether or not to display graphics.
     */
    displayGraphics: boolean;
    /**
     * The number of results to display per page.
     */
    resultsPerPage: number;
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
     * If the settings have been initialized and are ready to use.
     */
    ready: boolean;
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
    /**
     * Opens a dialog to ask the user to select a directory.
     *
     * @returns void
     */
    openDirectorySelection: () => void;
    /**
     * Resets the directory path to an empty string.
     *
     * @returns void
     */
    resetDirectorySelection: () => void;
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
    openDirectorySelection() {
      console.log('Un-initialized settings provider.');
    },
    resetDirectorySelection() {
      console.log('Un-initialized settings provider.');
    },
  },
]);

/**
 * Resets all saved settings saved on disk to their default values.
 *
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
  await tauriSettingsStore.set('resultsPerPage', SETTINGS_DEFAULTS.resultsPerPage);
  await tauriSettingsStore.set('dataVersion', SETTINGS_DEFAULTS.dataVersion);
  await tauriSettingsStore.set('parsing', SETTINGS_DEFAULTS.parsing);
  await tauriSettingsStore.set('filtering', SETTINGS_DEFAULTS.filtering);
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
   * Checks the settings to make sure they are valid. Verifies that each setting value is
   * of the correct type. If it isn't, it tries to reset it to default.
   *
   * If any setting is reset, the settings changed flag is set to true.
   *
   * @returns void
   */
  function validateSettings() {
    let failedValidation = false;
    console.info('Validating settings.');
    // Check each setting
    Object.keys(SETTINGS_DEFAULTS).forEach((key) => {
      if (key === 'ready') return; // Don't check the ready flag.

      const setting = key as keyof typeof SETTINGS_DEFAULTS;
      // If the setting is not of the correct type, reset it to default
      if (typeof state[setting] !== typeof SETTINGS_DEFAULTS[setting]) {
        console.warn(`Setting ${setting} is not of the correct type. Resetting to default.`);
        setState(setting, SETTINGS_DEFAULTS[setting]);
        failedValidation = true;
      }
    });
    // If we failed validation, set the settings changed flag
    if (failedValidation) {
      setSettingsChanged(true);
    }
    // Update the ready flag
    setState('ready', !failedValidation);
    console.log(`Settings are ${failedValidation ? 'invalid' : 'valid'}`);
  }

  /**
   * Loads a setting from disk or sets it to the default value if it does not exist.
   *
   * @param key - The key to load
   * @returns A promise that resolves when the setting has been loaded.
   */
  async function loadFromStoreOrDefault(key: keyof typeof SETTINGS_DEFAULTS) {
    const loadedVal = await tauriSettingsStore.get(key);
    if (typeof loadedVal === 'undefined' || typeof loadedVal !== typeof SETTINGS_DEFAULTS[key]) {
      await tauriSettingsStore.set(key, SETTINGS_DEFAULTS[key]);
      console.log(`Set ${key} to default`, state[key]);
    } else {
      setState(key, loadedVal as (typeof SETTINGS_DEFAULTS)[typeof key]);
      console.log(`Loaded ${key}`, state[key as keyof typeof state]);
    }
  }

  // Attempt to load the settings from disk
  tauriSettingsStore
    .load()
    .then(async () => {
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
        // Set "ready"
        setState('ready', true);
        // Return early before loading the settings we just reset..
        return;
      }

      // Load the rest of the settings from disk.
      loadFromStoreOrDefault('layoutAsGrid');
      loadFromStoreOrDefault('displayGraphics');
      loadFromStoreOrDefault('resultsPerPage');
      loadFromStoreOrDefault('parsing');
      loadFromStoreOrDefault('filtering');

      // Set "ready"
      setState('ready', true);
    })
    .catch(console.error);

  // Signal to indicate if settings have changed (requiring a flush to disk)
  const [settingsChanged, setSettingsChanged] = createSignal(false);

  createEffect(async () => {
    if (settingsChanged()) {
      console.log('Settings changed. Flushing to disk.');

      // For each setting, we update the store
      await tauriSettingsStore.set('dataVersion', SETTINGS_DEFAULTS.dataVersion);
      await tauriSettingsStore.set('layoutAsGrid', state.layoutAsGrid);
      await tauriSettingsStore.set('displayGraphics', state.displayGraphics);
      await tauriSettingsStore.set('parsing', state.parsing);
      await tauriSettingsStore.set('filtering', state.filtering);

      setSettingsChanged(false);

      await tauriSettingsStore.save();
    }
  });

  // Listen for a file being dropped on the window to change the save location.
  listen('tauri://file-drop', (event: Event<string[]>) => {
    if (event.payload.length > 0) {
      const file = event.payload[0];
      if (file.endsWith('gamelog.txt')) {
        console.log('File dropped', file);
        getDwarfDirectoryPath(file)
          .then((directory) => {
            if (directory.length > 0) {
              setState({
                parsing: {
                  ...state.parsing,
                  directoryPath: directory.join('/'),
                },
              });
              setSettingsChanged(true);
            }
          })
          .catch(console.error);
      }
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
        setState({
          parsing: {
            ...state.parsing,
            directoryPath: path,
          },
        });
        setSettingsChanged(true);
      },
      objectTypeIncluded(type: ObjectType, parsingOnly: boolean) {
        if (parsingOnly) {
          return state.parsing.objectTypes.includes(type);
        }
        return state.filtering.objectTypes.includes(type);
      },
      toggleObjectType(type: ObjectType, parsingOnly: boolean) {
        if (parsingOnly) {
          if (state.parsing.objectTypes.includes(type)) {
            setState({
              parsing: {
                ...state.parsing,
                objectTypes: state.parsing.objectTypes.filter((t) => t !== type),
              },
            });
          } else {
            setState({
              parsing: {
                ...state.parsing,
                objectTypes: [...state.parsing.objectTypes, type],
              },
            });
          }
        } else {
          if (state.filtering.objectTypes.includes(type)) {
            setState({
              filtering: {
                ...state.filtering,
                objectTypes: state.filtering.objectTypes.filter((t) => t !== type),
              },
            });
          } else {
            setState({
              filtering: {
                ...state.filtering,
                objectTypes: [...state.filtering.objectTypes, type],
              },
            });
          }
        }
        setSettingsChanged(true);
      },
      resetToDefaults() {
        setState({ ...SETTINGS_DEFAULTS });
        setSettingsChanged(true);
      },
      biomeIncluded(biome: Biome) {
        return state.filtering.biomes.includes(biome);
      },
      toggleBiome(biome: Biome) {
        if (state.filtering.biomes.includes(biome)) {
          setState({
            filtering: {
              ...state.filtering,
              biomes: state.filtering.biomes.filter((t) => t !== biome),
            },
          });
        } else {
          setState({
            filtering: {
              ...state.filtering,
              biomes: [...state.filtering.biomes, biome],
            },
          });
        }
        setSettingsChanged(true);
      },
      updateFilteredBiomes(biomes: Biome[]) {
        // Avoid setting the state if the biomes are the same
        if (
          biomes.length === state.filtering.biomes.length &&
          biomes.every((v, i) => v === state.filtering.biomes[i])
        ) {
          return;
        }

        setState({
          filtering: {
            ...state.filtering,
            biomes,
          },
        });
        console.log('Updated biomes', biomes);
        setSettingsChanged(true);
      },
      updateFilteredLocations(locations: RawModuleLocation[]) {
        setState({
          filtering: {
            ...state.filtering,
            locations,
          },
        });
        console.log('Updated locations', locations);
        setSettingsChanged(true);
      },
      locationIncluded(location: RawModuleLocation, forParsing: boolean) {
        if (forParsing) {
          return state.parsing.locations.includes(location);
        }
        return state.filtering.locations.includes(location);
      },
      toggleLocation(location: RawModuleLocation, forParsing: boolean) {
        if (forParsing) {
          if (state.parsing.locations.includes(location)) {
            setState({
              parsing: {
                ...state.parsing,
                locations: state.parsing.locations.filter((t) => t !== location),
              },
            });
          } else {
            setState({
              parsing: {
                ...state.parsing,
                locations: [...state.parsing.locations, location],
              },
            });
          }
        } else {
          if (state.filtering.locations.includes(location)) {
            setState({
              filtering: {
                ...state.filtering,
                locations: state.filtering.locations.filter((t) => t !== location),
              },
            });
          } else {
            setState({
              filtering: {
                ...state.filtering,
                locations: [...state.filtering.locations, location],
              },
            });
          }
        }
        setSettingsChanged(true);
      },
      updateFilteredModules(modules: string[]) {
        // Avoid setting the state if the modules are the same
        if (
          modules.length === state.filtering.modules.length &&
          modules.every((v, i) => v === state.filtering.modules[i])
        ) {
          return;
        }

        setState({
          filtering: {
            ...state.filtering,
            modules,
          },
        });
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
      openDirectorySelection() {
        getDwarfDirectoryPath()
          .then((directory) => {
            if (directory.length > 0) {
              setState({
                parsing: {
                  ...state.parsing,
                  directoryPath: directory.join('/'),
                },
              });
              setSettingsChanged(true);
            }
          })
          .catch(console.error);
      },
      resetDirectorySelection() {
        setState({
          parsing: {
            ...state.parsing,
            directoryPath: '',
          },
        });
        setSettingsChanged(true);
      },
    },
  ];

  // Set a timeout to validate the settings after 5 seconds.
  // This is to ensure that the settings are loaded before we validate them.
  setTimeout(() => {
    if (!state.ready) validateSettings();
  }, 5 * 1000);

  return <SettingsContext.Provider value={defaultSettings as SettingsStore}>{props.children}</SettingsContext.Provider>;
}

/**
 * A hook to get the settings context.
 */
export function useSettingsContext() {
  return useContext(SettingsContext);
}
