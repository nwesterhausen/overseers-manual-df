/* @refresh reload */
import { render } from 'solid-js/web';
// import './sass/main.scss';

import { Route, Router } from '@solidjs/router';
import { RawsProvider } from './providers/RawsProvider';
import { SearchProvider } from './providers/SearchProvider';
import { SettingsProvider } from './providers/SettingsProvider';

import { attachConsole } from '@tauri-apps/plugin-log';
import { UpdateProvider } from './providers/UpdateProvider';

import { lazy } from 'solid-js';
import MenuBar from './components/menu/MenuBar';
import ReferenceManual from './pages/ReferenceManual';
const Settings = lazy(() => import('./pages/Settings'));
const About = lazy(() => import('./pages/About'));
const UpdateDetails = lazy(() => import('./pages/UpdateDetails'));

// Attach our console to the tauri logs
try {
const detach = await attachConsole();
}
catch (e) {
  console.log('Failed to attach console:', e);
}

const App = (props) => (
  <SettingsProvider>
    <SearchProvider>
      <RawsProvider>
        <UpdateProvider>
          <MenuBar>{props.children}</MenuBar>
        </UpdateProvider>
      </RawsProvider>
    </SearchProvider>
  </SettingsProvider>
);

render(
  () => (
    <Router root={App}>
      <Route path='/' component={ReferenceManual} />
      <Route path='/settings' component={Settings} />
      <Route path='/about' component={About} />
      <Route path='/update-details' component={UpdateDetails} />
    </Router>
  ),
  document.getElementById('root')!,
);
