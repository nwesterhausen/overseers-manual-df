import { getVersion } from '@tauri-apps/plugin-app';
import { appWindow } from '@tauri-apps/plugin-window';
import { Component, createEffect, createMemo, createResource } from 'solid-js';
import DFDirectoryNotSet from './components/DFDirectoryNotSet';
import Listings from './components/Listings';
import LoadingRawsProgress from './components/LoadingRawsProgress';
import ParsingProgressBar from './components/ParsingProgressBar';
import ScrollToTopBtn from './components/ScrollToTopBtn';
import SearchFilters from './components/filtering/SearchFilters';
import SettingsModal from './components/filtering/SettingsModal';
import MenuBar from './components/menu/MenuBar';
import { DIR_NONE, useDirectoryProvider } from './providers/DirectoryProvider';
import { STS_EMPTY, useRawsProvider } from './providers/RawsProvider';

// App name for title
const APP_NAME = "Overseer's Reference Manual";
// App url for github link
// const APP_REPO = "https://github.com/nwesterhausen/overseers-manual-df"

const App: Component = () => {
  const rawsContext = useRawsProvider();
  const directoryContext = useDirectoryProvider();

  // Tauri provides the app version in a promise, so we use a resource for it
  const [appVersion] = createResource(async () => {
    return await getVersion();
  });

  // When we update the currently selected save, we want to save it so we remember next time the app opens
  // Also update the title depending on the current save or app version changing
  createEffect(() => {
    appWindow.setTitle(`${APP_NAME} ${appVersion()}`);
  });

  // Helper boolean to know when to display the page or not
  const contentToDisplay = createMemo(() => {
    return rawsContext.parsingStatus() !== STS_EMPTY && directoryContext.currentDirectory().type !== DIR_NONE;
  });

  return (
    <>
      <MenuBar />
      <div class='px-2 main'>
        <div class='flex justify-center'>
          <ParsingProgressBar />
          <LoadingRawsProgress />
        </div>
        {contentToDisplay() ? <Listings /> : <DFDirectoryNotSet />}
      </div>
      <ScrollToTopBtn />
      <SearchFilters />
      <SettingsModal />
    </>
  );
};

export default App;
