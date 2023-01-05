import { ParentComponent, createContext, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';

type ThemeStore = [
  { theme: 'dark' | 'light' | 'dwarf' },
  { setDark: () => void; setLight: () => void; setDwarf: () => void }
]

const ThemeContext = createContext<ThemeStore>([{ theme: 'dwarf' }, {
  setDark() {
    console.log("Theme not changed");
  },
  setLight() {
    console.log("Theme not changed");
  },
  setDwarf() {
    console.log("Theme not changed");
  }
}
]);

export const ThemeProvider: ParentComponent = (props) => {
  const [state, setState] = createStore({ theme: 'dwarf' });
  document.getElementsByTagName("body")[0].setAttribute('data-bs-theme', 'dwarf');

  const themeChanger = [
    state,
    {
      setDark() {
        setState({ "theme": 'light' });
        document.getElementsByTagName("body")[0].setAttribute('data-bs-theme', 'dark');
      },
      setLight() {
        setState({ "theme": 'dark' });
        document.getElementsByTagName("body")[0].setAttribute('data-bs-theme', 'light');
      },
      setDwarf() {
        setState({ "theme": 'dwarf' });
        document.getElementsByTagName("body")[0].setAttribute('data-bs-theme', 'dwarf');
      }
    }
  ];

  return (
    <ThemeContext.Provider value={themeChanger as ThemeStore}>
      {props.children}
    </ThemeContext.Provider>
  )
}

export function useThemeChanger() {
  return useContext(ThemeContext);
}