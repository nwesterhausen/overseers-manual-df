import { Store as TauriStore } from '@tauri-apps/plugin-store';
import { ParentComponent, createContext, createEffect, createSignal, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Biome } from '../definitions/Biome';
import { ObjectType } from '../definitions/ObjectType';
import { RawModuleLocation } from '../definitions/RawModuleLocation';

const SETTINGS_DEFAULTS = {
  layoutAsGrid: true,
  displayGraphics: true,
  resultsPerPage: 32,
  directoryPath: '',
  currentPage: 1,
  includeObjectTypes: ['Creature', 'Plant'] as ObjectType[],
  parseObjectTypes: ['Creature', 'Plant'] as ObjectType[],
  includeBiomes: [] as Biome[],
  parseLocations: ['Vanilla'] as RawModuleLocation[],
  includeLocations: ['Vanilla'] as RawModuleLocation[],
};

type SettingsStore = [
  {
    layoutAsGrid: boolean;
    displayGraphics: boolean;
    parseObjectTypes: ObjectType[];
    parseLocations: RawModuleLocation[];
    resultsPerPage: number;
    directoryPath: string;
    currentPage: number;
    includeObjectTypes: ObjectType[];
    includeBiomes: Biome[];
    includeLocations: RawModuleLocation[];
  },
  {
    toggleLayoutAsGrid: () => void;
    toggleDisplayGraphics: () => void;
    // These are for parsing
    objectTypeIncluded: (type: ObjectType, parsingOnly: boolean) => boolean;
    toggleObjectType: (type: ObjectType, parsingOnly: boolean) => void;
    locationIncluded: (type: RawModuleLocation, parsingOnly: boolean) => boolean;
    toggleLocation: (type: RawModuleLocation, parsingOnly: boolean) => void;
    // These are for filtering
    setResultsPerPage: (num: number) => void;
    setDirectoryPath: (path: string) => void;
    setCurrentResultsPage: (num: number) => void;
    resetToDefaults: () => void;
    updateFilteredBiomes: (biomes: Biome[]) => void;
    updateFilteredLocations: (locations: RawModuleLocation[]) => void;
  },
];

const tauriSettingsStore = new TauriStore('settings.json');

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
    setCurrentResultsPage(num: number) {
      console.log('Un-initialized settings provider.', num);
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
  },
]);

export const SettingsProvider: ParentComponent = (props) => {
  const [state, setState] = createStore({
    ...SETTINGS_DEFAULTS,
  });

  // Attempt to load the settings from disk
  tauriSettingsStore.load().then(async () => {
    console.log('Loading settings from disk.');
    // If the settings file does not exist, create it..

    // Initialize the layoutAsGrid setting
    if (typeof (await tauriSettingsStore.get('layoutAsGrid')) === 'undefined') {
      await tauriSettingsStore.set('layoutAsGrid', SETTINGS_DEFAULTS.layoutAsGrid);
    } else {
      setState({ layoutAsGrid: await tauriSettingsStore.get('layoutAsGrid') });
      console.log('Loaded layoutAsGrid', state.layoutAsGrid);
    }
    // Initialize the displayGraphics setting
    if (typeof (await tauriSettingsStore.get('displayGraphics')) === 'undefined') {
      await tauriSettingsStore.set('displayGraphics', SETTINGS_DEFAULTS.displayGraphics);
    } else {
      setState({ displayGraphics: await tauriSettingsStore.get('displayGraphics') });
      console.log('Loaded displayGraphics', state.displayGraphics);
    }
    // Initialize the parsed location settings
    if (typeof (await tauriSettingsStore.get('parseLocations')) === 'undefined') {
      await tauriSettingsStore.set('parseLocations', SETTINGS_DEFAULTS.parseLocations);
    } else {
      setState({ parseLocations: await tauriSettingsStore.get('parseLocations') });
      console.log('Loaded parseLocations', state.parseLocations);
    }
    // Initialize the filtered location settings
    if (typeof (await tauriSettingsStore.get('includeLocations')) === 'undefined') {
      await tauriSettingsStore.set('includeLocations', SETTINGS_DEFAULTS.includeLocations);
    } else {
      setState({ includeLocations: await tauriSettingsStore.get('includeLocations') });
      console.log('Loaded includeLocations', state.includeLocations);
    }
    // Initialize the results per page setting
    if (typeof (await tauriSettingsStore.get('resultsPerPage')) === 'undefined') {
      await tauriSettingsStore.set('resultsPerPage', SETTINGS_DEFAULTS.resultsPerPage);
    } else {
      setState({ resultsPerPage: await tauriSettingsStore.get('resultsPerPage') });
      console.log('Loaded resultsPerPage', state.resultsPerPage);
    }
    // Initialize the directory path setting
    if (typeof (await tauriSettingsStore.get('directoryPath')) === 'undefined') {
      await tauriSettingsStore.set('directoryPath', SETTINGS_DEFAULTS.directoryPath);
    } else {
      setState({ directoryPath: await tauriSettingsStore.get('directoryPath') });
      console.log('Loaded directoryPath', state.directoryPath);
    }
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
      setCurrentResultsPage(num: number) {
        setState('currentPage', num);
        // This is not recorded to disk.
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
      locationIncluded(location: RawModuleLocation, parsingOnly: boolean) {
        if (parsingOnly) {
          return state.parseLocations.includes(location);
        }
        return state.includeLocations.includes(location);
      },
      toggleLocation(location: RawModuleLocation, parsingOnly: boolean) {
        if (parsingOnly) {
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
    },
  ];

  return <SettingsContext.Provider value={defaultSettings as SettingsStore}>{props.children}</SettingsContext.Provider>;
};

export function useSettingsContext() {
  return useContext(SettingsContext);
}
