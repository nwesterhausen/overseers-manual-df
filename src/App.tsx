import { Route, Routes } from '@solidjs/router';
import { getCurrent } from '@tauri-apps/api/window';
import { Component, lazy } from 'solid-js';
import ShowFilterButton from './components/filtering/ShowFilterButton';
import MenuBar from './components/menu/MenuBar';
import ReferenceManual from './pages/ReferenceManual';
const Settings = lazy(() => import('./pages/Settings'));
const About = lazy(() => import('./pages/About'));

// App name for title
const APP_NAME = "Overseer's Reference Manual";
// App url for github link
// const APP_REPO = "https://github.com/nwesterhausen/overseers-manual-df"

const App: Component = () => {
  const appWindow = getCurrent();
  appWindow.setTitle(APP_NAME);

  return (
    <>
      <MenuBar>
        <ShowFilterButton />
        <Routes>
          <Route path='/' element={<ReferenceManual />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/about' element={<About />} />
        </Routes>
      </MenuBar>
    </>
  );
};

export default App;
