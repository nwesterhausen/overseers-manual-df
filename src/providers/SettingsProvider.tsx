import { Store as TauriStore } from '@tauri-apps/plugin-store';
import { ParentComponent, createContext, createEffect, createSignal, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
import { ObjectType } from '../definitions/ObjectType';

const SETTINGS_DEFAULTS = {
  layoutAsGrid: true,
  displayGraphics: true,
  includeLocationVanilla: true,
  includeLocationMods: false,
  includeLocationInstalledMods: true,
  resultsPerPage: 32,
  directoryPath: '',
  currentPage: 1,
  includeObjectTypes: ['Creature', 'Plant'] as ObjectType[],
  includeBiomes: [] as string[],
};

type SettingsStore = [
  {
    layoutAsGrid: boolean;
    displayGraphics: boolean;
    includeLocationVanilla: boolean;
    includeLocationMods: boolean;
    includeLocationInstalledMods: boolean;
    resultsPerPage: number;
    directoryPath: string;
    currentPage: number;
    includeObjectTypes: ObjectType[];
    includeBiomes: string[];
  },
  {
    toggleLayoutAsGrid: () => void;
    toggleDisplayGraphics: () => void;
    toggleIncludeLocationVanilla: () => void;
    toggleIncludeLocationMods: () => void;
    toggleIncludeLocationInstalledMods: () => void;
    setResultsPerPage: (num: number) => void;
    setDirectoryPath: (path: string) => void;
    setCurrentResultsPage: (num: number) => void;
    objectTypeIncluded: (type: ObjectType) => boolean;
    toggleObjectType: (type: ObjectType) => void;
    resetToDefaults: () => void;
    biomeIncluded: (biome: string) => boolean;
    toggleBiome: (biome: string) => void;
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
    toggleIncludeLocationVanilla() {
      console.log('Un-initialized settings provider.');
    },
    toggleIncludeLocationMods() {
      console.log('Un-initialized settings provider.');
    },
    toggleIncludeLocationInstalledMods() {
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
    objectTypeIncluded(type: ObjectType) {
      console.log('Un-initialized settings provider.', type);
      return false;
    },
    toggleObjectType(type: ObjectType) {
      console.log('Un-initialized settings provider.', type);
    },
    resetToDefaults() {
      console.log('Un-initialized settings provider.');
    },
    biomeIncluded(biome: string) {
      console.log('Un-initialized settings provider.', biome);
      return false;
    },
    toggleBiome(biome: string) {
      console.log('Un-initialized settings provider.', biome);
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
    // Initialize the includeLocationVanilla setting
    if (typeof (await tauriSettingsStore.get('includeLocationVanilla')) === 'undefined') {
      await tauriSettingsStore.set('includeLocationVanilla', SETTINGS_DEFAULTS.includeLocationVanilla);
    } else {
      setState({ includeLocationVanilla: await tauriSettingsStore.get('includeLocationVanilla') });
      console.log('Loaded includeLocationVanilla', state.includeLocationVanilla);
    }
    // Initialize the includeLocationMods setting
    if (typeof (await tauriSettingsStore.get('includeLocationMods')) === 'undefined') {
      await tauriSettingsStore.set('includeLocationMods', SETTINGS_DEFAULTS.includeLocationMods);
    } else {
      setState({ includeLocationMods: await tauriSettingsStore.get('includeLocationMods') });
      console.log('Loaded includeLocationMods', state.includeLocationMods);
    }
    // Initialize the includeLocationInstalledMods setting
    if (typeof (await tauriSettingsStore.get('includeLocationInstalledMods')) === 'undefined') {
      await tauriSettingsStore.set('includeLocationInstalledMods', SETTINGS_DEFAULTS.includeLocationInstalledMods);
    } else {
      setState({ includeLocationInstalledMods: await tauriSettingsStore.get('includeLocationInstalledMods') });
      console.log('Loaded includeLocationInstalledMods', state.includeLocationInstalledMods);
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
      await tauriSettingsStore.set('includeLocationVanilla', state.includeLocationVanilla);
      await tauriSettingsStore.set('includeLocationMods', state.includeLocationMods);
      await tauriSettingsStore.set('includeLocationInstalledMods', state.includeLocationInstalledMods);
      await tauriSettingsStore.set('resultsPerPage', state.resultsPerPage);
      await tauriSettingsStore.set('directoryPath', state.directoryPath);
      await tauriSettingsStore.set('includeObjectTypes', state.includeObjectTypes);
      await tauriSettingsStore.set('includeBiomes', state.includeBiomes);

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
      toggleIncludeLocationVanilla() {
        setState('includeLocationVanilla', !state.includeLocationVanilla);
        setSettingsChanged(true);
      },
      toggleIncludeLocationMods() {
        setState('includeLocationMods', !state.includeLocationMods);
        setSettingsChanged(true);
      },
      toggleIncludeLocationInstalledMods() {
        setState('includeLocationInstalledMods', !state.includeLocationInstalledMods);
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
      objectTypeIncluded(type: ObjectType) {
        return state.includeObjectTypes.includes(type);
      },
      toggleObjectType(type: ObjectType) {
        if (state.includeObjectTypes.includes(type)) {
          setState(
            'includeObjectTypes',
            state.includeObjectTypes.filter((t) => t !== type),
          );
        } else {
          setState('includeObjectTypes', [...state.includeObjectTypes, type]);
        }
        setSettingsChanged(true);
      },
      resetToDefaults() {
        setState({ ...SETTINGS_DEFAULTS });
        setSettingsChanged(true);
      },
      biomeIncluded(biome: string) {
        return state.includeBiomes.includes(biome);
      },
      toggleBiome(biome: string) {
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
    },
  ];

  return <SettingsContext.Provider value={defaultSettings as SettingsStore}>{props.children}</SettingsContext.Provider>;
};

export function useSettingsContext() {
  return useContext(SettingsContext);
}
