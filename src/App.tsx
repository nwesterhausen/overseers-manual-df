import { Route, Routes } from '@solidjs/router';
import { getCurrent } from '@tauri-apps/plugin-window';
import { Component } from 'solid-js';
import MenuBar from './components/menu/MenuBar';
import ReferenceManual from './components/pages/ReferenceManual';

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
        <Routes>
          <Route path='/' element={<ReferenceManual />} />
        </Routes>
      </MenuBar>
    </>
  );
};

export default App;
