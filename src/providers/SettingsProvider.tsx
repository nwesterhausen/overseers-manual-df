import { ParentComponent, createContext, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';

type SettingsStore = [
  {
    show: boolean;
    displayStyleGrid: boolean;
    displayGraphics: boolean;
    includeLocationVanilla: boolean;
    includeLocationMods: boolean;
    includeLocationInstalledMods: boolean;
  },
  {
    handleOpen: () => void;
    handleClose: () => void;
    toggleDisplayGrid: () => void;
    toggleDisplayGraphics: () => void;
    toggleIncludeLocationVanilla: () => void;
    toggleIncludeLocationMods: () => void;
    toggleIncludeLocationInstalledMods: () => void;
  }
];

const SettingsContext = createContext<SettingsStore>([
  {
    show: false,
    displayStyleGrid: true,
    displayGraphics: true,
    includeLocationVanilla: true,
    includeLocationMods: true,
    includeLocationInstalledMods: true,
  },
  {
    handleOpen() {
      console.log('Un-initialized handleOpen');
    },
    handleClose() {
      console.log('Un-initialized handleClose');
    },
    toggleDisplayGrid() {
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
  },
]);

export const SettingsProvider: ParentComponent = (props) => {
  const [state, setState] = createStore({
    show: false,
    displayStyleGrid: true,
    displayGraphics: true,
    includeLocationVanilla: true,
    includeLocationMods: true,
    includeLocationInstalledMods: true,
  });

  const defaultSettings = [
    state,
    {
      handleOpen() {
        setState({ show: true });
      },
      handleClose() {
        setState({ show: false });
      },
      toggleDisplayGrid() {
        setState({ displayStyleGrid: !state.displayStyleGrid });
      },
      toggleDisplayGraphics() {
        setState({ displayGraphics: !state.displayGraphics });
      },
      toggleIncludeLocationVanilla() {
        setState({ includeLocationVanilla: !state.includeLocationVanilla });
      },
      toggleIncludeLocationMods() {
        setState({ includeLocationMods: !state.includeLocationMods });
      },
      toggleIncludeLocationInstalledMods() {
        setState({ includeLocationInstalledMods: !state.includeLocationInstalledMods });
      },
    },
  ];

  return <SettingsContext.Provider value={defaultSettings as SettingsStore}>{props.children}</SettingsContext.Provider>;
};

export function useSettingsContext() {
  return useContext(SettingsContext);
}
