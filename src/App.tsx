import { Container, Tabs, Tab } from 'solid-bootstrap';
import { appWindow } from '@tauri-apps/api/window';
import { Component, createEffect, createResource } from 'solid-js';
import Listing from './components/Listing';
import { init as initStore, get as getFromStore, set as saveToStore, SAVES_PATH, LAST_SAVE } from './settings';
import { getVersion } from '@tauri-apps/api/app';
import ScrollToTopBtn from './components/ScrollToTopBtn';
import { useDirectoryProvider } from './providers/DirectoryProvider';
import { STS_IDLE, useRawsProvider } from './providers/RawsProvider';
import { useSearchProvider } from './providers/SearchProvider';
import SearchBox from './components/SearchBox';
import MenuBar from './components/MenuBar';
import DFDirectoryNotSet from './components/DFDirectoryNotSet';

// App name for title
const APP_NAME = "Overseer's Reference Manual";
// App url for github link
// const APP_REPO = "https://github.com/nwesterhausen/overseers-manual-df"

const App: Component = () => {
  const directoryContext = useDirectoryProvider();
  const rawsContext = useRawsProvider();
  const searchContext = useSearchProvider();
  // Tauri provides the app version in a promise, so we use a resource for it
  const [appVersion] = createResource(async () => {
    return await getVersion();
  });
  // When we update the currently selected save, we want to save it so we remember next time the app opens
  // Also update the title depending on the current save or app version changing
  createEffect(() => {
    if (directoryContext.currentSave() !== '') {
      appWindow.setTitle(`${APP_NAME} ${appVersion()} - ${directoryContext.currentSave()}`);
      saveToStore(LAST_SAVE, directoryContext.currentSave());
      rawsContext.setLoadRaws(true);
    } else {
      appWindow.setTitle(`${APP_NAME} ${appVersion()}`);
    }
  });

  // Setting up the settings storage.
  initStore()
    // After its setup, try to get the save directory from the settings
    .then(() => {
      return getFromStore(SAVES_PATH);
    })
    // With the save folder, set it as the drag and drop path, since that's the path we set programmatically
    // and let the effects do the rest.
    .then((val) => {
      if (val !== '') {
        directoryContext.setDragAndDropPath(val);
      }
    })
    .catch(console.error);

  return (
    <>
      <MenuBar />
      <Container class='p-2'>
        <DFDirectoryNotSet />
        <SearchBox />
        {rawsContext.jsonRawsResource().length === 0 || rawsContext.parsingStatus() !== STS_IDLE ? (
          <></>
        ) : (
          <Tabs defaultActiveKey='bestiary' class='my-3'>
            {/* A bestiary (from bestiarum vocabulum) is a compendium of beasts. */}
            <Tab eventKey='bestiary' title='Bestiary'>
              <Listing data={rawsContext.jsonRawsResource()} searchString={searchContext.searchString()} />
            </Tab>
            <Tab disabled title='More to come in the future!'></Tab>
          </Tabs>
        )}
      </Container>
      <ScrollToTopBtn />
    </>
  );
};

export default App;
