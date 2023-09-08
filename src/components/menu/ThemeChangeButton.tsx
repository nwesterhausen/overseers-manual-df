import { HiSolidMoon, HiSolidSun } from 'solid-icons/hi';
import { Component } from 'solid-js';
import { useThemeChanger } from '../../providers/ThemeProvider';

const ThemeChangeButton: Component = () => {
  const [theme, { setDark, setLight }] = useThemeChanger();

  return (
    <div class='tooltip tooltip-bottom' data-tip={`Use ${theme.dark ? 'light' : 'dark'} theme`}>
      <button
        class='btn btn-sm btn-ghost btn-circle'
        onClick={() => {
          if (theme.dark) {
            setLight();
          } else {
            setDark();
          }
        }}>
        {theme.dark ? <HiSolidSun size={'1.5rem'} /> : <HiSolidMoon size={'1.5rem'} />}
      </button>
    </div>
  );
};

export default ThemeChangeButton;
