/* @refresh reload */
// import 'bootstrap/dist/css/bootstrap.css';
import 'bootswatch/dist/solar/bootstrap.css';
// import 'bootswatch/dist/sandstone/bootstrap.css';
import './custom.css';
import { render } from 'solid-js/web';

import App from './App';
import { DirectoryProvider } from './providers/DirectoryProvider';
import { RawsProvider } from './providers/RawsProvider';
import { SearchProvider } from './providers/SearchProvider';

render(
  () => (
    <DirectoryProvider>
      <RawsProvider>
        <SearchProvider>
          <App />
        </SearchProvider>
      </RawsProvider>
    </DirectoryProvider>
  ),
  document.getElementById('root') as HTMLElement
);
