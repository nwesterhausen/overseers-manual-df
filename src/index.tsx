/* @refresh reload */
import { render } from 'solid-js/web';
// import './sass/main.scss';

import { Router } from '@solidjs/router';
import App from './App';
import { RawsProvider } from './providers/RawsProvider';
import { SearchProvider } from './providers/SearchProvider';
import { SettingsProvider } from './providers/SettingsProvider';

import { attachConsole } from '@tauri-apps/plugin-log';

// Attach our console to the tauri logs
attachConsole().catch(console.error);

render(
  () => (
    <Router>
      <SettingsProvider>
        <SearchProvider>
          <RawsProvider>
            <App />
          </RawsProvider>
        </SearchProvider>
      </SettingsProvider>
    </Router>
  ),
  document.getElementById('root') as HTMLElement,
);
