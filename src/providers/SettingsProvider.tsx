import { Store as TauriStore } from '@tauri-apps/plugin-store';
import { ParentComponent, createContext, createEffect, createSignal, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';

const SETTINGS_DEFAULTS = {
  layoutAsGrid: true,
  displayGraphics: true,
  includeLocationVanilla: true,
  includeLocationMods: false,
  includeLocationInstalledMods: true,
  resultsPerPage: 32,
  directoryPath: '',
  currentPage: 1,
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
  },
];

const tauriSettingsStore = new TauriStore('settings.json');
const loadedSettings = { ...SETTINGS_DEFAULTS };

// Attempt to load the settings from disk
tauriSettingsStore.load().then(async () => {
  // If the settings file does not exist, create it
  if (!(await tauriSettingsStore.get('layoutAsGrid'))) {
    await tauriSettingsStore.set('layoutAsGrid', SETTINGS_DEFAULTS.layoutAsGrid);
  } else {
    loadedSettings.layoutAsGrid = await tauriSettingsStore.get('layoutAsGrid');
  }
  if (!(await tauriSettingsStore.get('displayGraphics'))) {
    await tauriSettingsStore.set('displayGraphics', SETTINGS_DEFAULTS.displayGraphics);
  } else {
    loadedSettings.displayGraphics = await tauriSettingsStore.get('displayGraphics');
  }
  if (!(await tauriSettingsStore.get('includeLocationVanilla'))) {
    await tauriSettingsStore.set('includeLocationVanilla', SETTINGS_DEFAULTS.includeLocationVanilla);
  } else {
    loadedSettings.includeLocationVanilla = await tauriSettingsStore.get('includeLocationVanilla');
  }
  if (!(await tauriSettingsStore.get('includeLocationMods'))) {
    await tauriSettingsStore.set('includeLocationMods', SETTINGS_DEFAULTS.includeLocationMods);
  } else {
    loadedSettings.includeLocationMods = await tauriSettingsStore.get('includeLocationMods');
  }
  if (!(await tauriSettingsStore.get('includeLocationInstalledMods'))) {
    await tauriSettingsStore.set('includeLocationInstalledMods', SETTINGS_DEFAULTS.includeLocationInstalledMods);
  } else {
    loadedSettings.includeLocationInstalledMods = await tauriSettingsStore.get('includeLocationInstalledMods');
  }
  if (!(await tauriSettingsStore.get('resultsPerPage'))) {
    await tauriSettingsStore.set('resultsPerPage', SETTINGS_DEFAULTS.resultsPerPage);
  } else {
    loadedSettings.resultsPerPage = await tauriSettingsStore.get('resultsPerPage');
  }
  if (!(await tauriSettingsStore.get('directoryPath'))) {
    await tauriSettingsStore.set('directoryPath', SETTINGS_DEFAULTS.directoryPath);
  } else {
    loadedSettings.directoryPath = await tauriSettingsStore.get('directoryPath');
  }
});

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
  },
]);

export const SettingsProvider: ParentComponent = (props) => {
  const [state, setState] = createStore({
    ...loadedSettings,
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
    },
  ];

  return <SettingsContext.Provider value={defaultSettings as SettingsStore}>{props.children}</SettingsContext.Provider>;
};

export function useSettingsContext() {
  return useContext(SettingsContext);
}
