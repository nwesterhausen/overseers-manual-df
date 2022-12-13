import { getVersion } from '@tauri-apps/api/app';
import { appWindow } from '@tauri-apps/api/window';
import { Container, Tab, Tabs } from 'solid-bootstrap';
import { Component, createEffect, createMemo, createResource } from 'solid-js';
import DFDirectoryNotSet from './components/DFDirectoryNotSet';
import Listing from './components/Listing';
import MenuBar from './components/MenuBar';
import ScrollToTopBtn from './components/ScrollToTopBtn';
import SearchBox from './components/SearchBox';
import { useDirectoryProvider } from './providers/DirectoryProvider';
import { STS_IDLE, useRawsProvider } from './providers/RawsProvider';

// App name for title
const APP_NAME = "Overseer's Reference Manual";
// App url for github link
// const APP_REPO = "https://github.com/nwesterhausen/overseers-manual-df"

const App: Component = () => {
  const directoryContext = useDirectoryProvider();
  const rawsContext = useRawsProvider();

  // Tauri provides the app version in a promise, so we use a resource for it
  const [appVersion] = createResource(async () => {
    return await getVersion();
  });

  // When we update the currently selected save, we want to save it so we remember next time the app opens
  // Also update the title depending on the current save or app version changing
  createEffect(() => {
    if (directoryContext.currentSave() !== '') {
      appWindow.setTitle(`${APP_NAME} ${appVersion()} - ${directoryContext.currentSave()}`);
    } else {
      appWindow.setTitle(`${APP_NAME} ${appVersion()}`);
    }
  });

  // Helper boolean to know when to display the page or not
  const contentToDisplay = createMemo(() => {
    return rawsContext.rawsJson().length === 0 || rawsContext.currentStatus() !== STS_IDLE;
  });

  return (
    <>
      <MenuBar />
      <Container class='p-2'>
        <DFDirectoryNotSet />
        <SearchBox />
        {contentToDisplay() ? (
          <></>
        ) : (
          <Tabs defaultActiveKey='bestiary' class='my-3'>
            {/* A bestiary (from bestiarum vocabulum) is a compendium of beasts. */}
            <Tab eventKey='bestiary' title='Bestiary'>
              <Listing />
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
