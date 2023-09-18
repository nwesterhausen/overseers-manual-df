import { ParentComponent, createContext, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
import {
  DISPLAY_GRAPHICS,
  INCLUDE_INSTALLED,
  INCLUDE_MODS,
  INCLUDE_VANILLA,
  LAYOUT_AS_GRID,
  get,
  set,
} from '../settings';

type SettingsStore = [
  {
    displayStyleGrid: boolean;
    displayGraphics: boolean;
    includeLocationVanilla: boolean;
    includeLocationMods: boolean;
    includeLocationInstalledMods: boolean;
  },
  {
    toggleDisplayGrid: () => void;
    toggleDisplayGraphics: () => void;
    toggleIncludeLocationVanilla: () => void;
    toggleIncludeLocationMods: () => void;
    toggleIncludeLocationInstalledMods: () => void;
  },
];

const SettingsContext = createContext<SettingsStore>([
  {
    displayStyleGrid: true,
    displayGraphics: true,
    includeLocationVanilla: true,
    includeLocationMods: true,
    includeLocationInstalledMods: true,
  },
  {
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
    displayStyleGrid: true,
    displayGraphics: true,
    includeLocationVanilla: true,
    includeLocationMods: true,
    includeLocationInstalledMods: true,
  });

  const defaultSettings = [
    state,
    {
      toggleDisplayGrid() {
        setState({ displayStyleGrid: !state.displayStyleGrid });
        set(LAYOUT_AS_GRID, state.displayStyleGrid)
          .then(() => {
            console.log('Saved display style grid to', state.displayStyleGrid);
          })
          .catch((err) => {
            console.error('Error saving display style grid as', state.displayStyleGrid);
            console.error(err);
          });
      },
      toggleDisplayGraphics() {
        setState({ displayGraphics: !state.displayGraphics });
        set(DISPLAY_GRAPHICS, state.displayGraphics)
          .then(() => {
            console.log('Saved display graphics to', state.displayGraphics);
          })
          .catch((err) => {
            console.error('Error saving display graphics as', state.displayGraphics);
            console.error(err);
          });
      },
      toggleIncludeLocationVanilla() {
        setState({ includeLocationVanilla: !state.includeLocationVanilla });
        set(INCLUDE_VANILLA, state.includeLocationVanilla)
          .then(() => {
            console.log('Saved include vanilla to', state.includeLocationVanilla);
          })
          .catch((err) => {
            console.error('Error saving include vanilla as', state.includeLocationVanilla);
            console.error(err);
          });
      },
      toggleIncludeLocationMods() {
        setState({ includeLocationMods: !state.includeLocationMods });
        set(INCLUDE_MODS, state.includeLocationMods)
          .then(() => {
            console.log('Saved include mods to', state.includeLocationMods);
          })
          .catch((err) => {
            console.error('Error saving include mods as', state.includeLocationMods);
            console.error(err);
          });
      },
      toggleIncludeLocationInstalledMods() {
        setState({ includeLocationInstalledMods: !state.includeLocationInstalledMods });
        set(INCLUDE_INSTALLED, state.includeLocationInstalledMods)
          .then(() => {
            console.log('Saved include installed mods to', state.includeLocationInstalledMods);
          })
          .catch((err) => {
            console.error('Error saving include installed mods as', state.includeLocationInstalledMods);
            console.error(err);
          });
      },
    },
  ];

  get(LAYOUT_AS_GRID)
    .then((val) => {
      if (typeof val === 'boolean') {
        setState({ displayStyleGrid: val });
        console.log('Loaded saved value for displayStyleGrid', val);
      }
    })
    .catch(console.error);
  get(DISPLAY_GRAPHICS)
    .then((val) => {
      if (typeof val === 'boolean') {
        setState({ displayGraphics: val });
        console.log('Loaded saved value for displayGraphics', val);
      }
    })
    .catch(console.error);
  get(INCLUDE_INSTALLED)
    .then((val) => {
      if (typeof val === 'boolean') {
        setState({ includeLocationInstalledMods: val });
        console.log('Loaded saved value for includeLocationInstalledMods', val);
      }
    })
    .catch(console.error);
  get(INCLUDE_MODS)
    .then((val) => {
      if (typeof val === 'boolean') {
        setState({ includeLocationMods: val });
        console.log('Loaded saved value for includeLocationMods', val);
      }
    })
    .catch(console.error);
  get(INCLUDE_VANILLA)
    .then((val) => {
      if (typeof val === 'boolean') {
        setState({ includeLocationVanilla: val });
        console.log('Loaded saved value for includeLocationVanilla', val);
      }
    })
    .catch(console.error);

  return <SettingsContext.Provider value={defaultSettings as SettingsStore}>{props.children}</SettingsContext.Provider>;
};

export function useSettingsContext() {
  return useContext(SettingsContext);
}
