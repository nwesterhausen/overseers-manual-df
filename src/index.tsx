/* @refresh reload */
// import 'bootstrap/dist/css/bootstrap.css';
import 'bootswatch/dist/solar/bootstrap.css';
// import 'bootswatch/dist/sandstone/bootstrap.css';
import './custom.css';
import { render } from 'solid-js/web';

import App from './App';
import { DirectoryProvider } from './components/DirectoryProvider';
import { RawsProvider } from './components/RawsProvider';

render(
  () => (
    <DirectoryProvider>
      <RawsProvider>
        <App />
      </RawsProvider>
    </DirectoryProvider>
  ),
  document.getElementById('root') as HTMLElement
);
