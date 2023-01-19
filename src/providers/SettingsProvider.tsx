import { ParentComponent, createContext, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';

type SettingsStore = [
  { show: boolean; displayStyleGrid: boolean },
  { handleOpen: () => void; handleClose: () => void; toggleDisplayGrid: () => void }
];

const SettingsContext = createContext<SettingsStore>([
  { show: false, displayStyleGrid: true },
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
  },
]);

export const SettingsProvider: ParentComponent = (props) => {
  const [state, setState] = createStore({ show: false, displayStyleGrid: true });

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
    },
  ];

  return <SettingsContext.Provider value={defaultSettings as SettingsStore}>{props.children}</SettingsContext.Provider>;
};

export function useSettingsContext() {
  return useContext(SettingsContext);
}
