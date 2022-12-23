/* @refresh reload */
import { render } from 'solid-js/web';
import './custom.scss';

import App from './App';
import { DirectoryProvider } from './providers/DirectoryProvider';
import { RawsProvider } from './providers/RawsProvider';
import { SearchProvider } from './providers/SearchProvider';

render(
  () => (
    <SearchProvider>
      <DirectoryProvider>
        <RawsProvider>
          <App />
        </RawsProvider>
      </DirectoryProvider>
    </SearchProvider>
  ),
  document.getElementById('root') as HTMLElement
);
