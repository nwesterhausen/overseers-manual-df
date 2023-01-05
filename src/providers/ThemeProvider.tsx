import { ParentComponent, createContext, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';

type ThemeStore = [
  { dark: boolean },
  { setDark: () => void; setLight: () => void }
]

const ThemeContext = createContext<ThemeStore>([{ dark: false }, {
  setDark() {
    console.log("Theme not changed");
  },
  setLight() {
    console.log("Theme not changed");
  }
}
]);

export const ThemeProvider: ParentComponent = (props) => {
  const defaultDark = window.matchMedia('(prefers-color-scheme: dark)');
  const [state, setState] = createStore({ dark: defaultDark.matches });
  document.getElementsByTagName("body")[0].setAttribute('data-bs-theme', defaultDark ? 'dark' : 'light');

  const themeChanger = [
    state,
    {
      setDark() {
        setState({ "dark": true });
        document.getElementsByTagName("body")[0].setAttribute('data-bs-theme', 'dark');
      },
      setLight() {
        setState({ "dark": false });
        document.getElementsByTagName("body")[0].setAttribute('data-bs-theme', 'light');
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