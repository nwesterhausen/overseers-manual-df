/* @refresh reload */
import { render } from 'solid-js/web';
import './sass/main.scss';

import App from './App';
import { DirectoryProvider } from './providers/DirectoryProvider';
import { RawsProvider } from './providers/RawsProvider';
import { SearchProvider } from './providers/SearchProvider';
import { SettingsProvider } from './providers/SettingsProvider';
import { ThemeProvider } from './providers/ThemeProvider';

render(
  () => (
    <SettingsProvider>
      <ThemeProvider>
        <SearchProvider>
          <DirectoryProvider>
            <RawsProvider>
              <App />
            </RawsProvider>
          </DirectoryProvider>
        </SearchProvider>
      </ThemeProvider>
    </SettingsProvider>
  ),
  document.getElementById('root') as HTMLElement
);
