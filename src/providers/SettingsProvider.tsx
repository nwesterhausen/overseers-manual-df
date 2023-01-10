import { ParentComponent, createContext, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
import SettingsModal from '../components/filtering/SettingsModal';

type SettingsStore = [
  { show: boolean },
  { handleOpen: () => void; handleClose: () => void; }
]

const SettingsContext = createContext<SettingsStore>([{ show: false }, {
  handleOpen() {
    console.log("Un-initialized handleOpen");
  },
  handleClose() {
    console.log("Un-initialized handleClose");
  }
}
]);

export const SettingsProvider: ParentComponent = (props) => {
  const [state, setState] = createStore({ show: false });

  const defaultSettings = [
    state,
    {
      handleOpen() {
        setState({ "show": true });
      },
      handleClose() {
        setState({ "show": false });
      }
    }
  ];

  return (
    <SettingsContext.Provider value={defaultSettings as SettingsStore}>
      {props.children}
      <SettingsModal />
    </SettingsContext.Provider>
  )
}

export function useSettingsContext() {
  return useContext(SettingsContext);
}