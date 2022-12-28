import { getVersion } from '@tauri-apps/api/app';
import { appWindow } from '@tauri-apps/api/window';
import { Container, Tab, Tabs } from 'solid-bootstrap';
import { Component, createEffect, createMemo, createResource } from 'solid-js';
import DFDirectoryNotSet from './components/DFDirectoryNotSet';
import ListingBestiary from './components/ListingBestiary';
import LoadingRawsProgress from './components/LoadingRawsProgress';
import MenuBar from './components/MenuBar';
import ParsingProgressBar from './components/ParsingProgressBar';
import ScrollToTopBtn from './components/ScrollToTopBtn';
import SearchBox from './components/SearchBox';
import SearchFilters from './components/filtering/SearchFilters';
import TagFilterModal from './components/filtering/TagFilterModal';
import { STS_IDLE, useRawsProvider } from './providers/RawsProvider';

// App name for title
const APP_NAME = "Overseer's Reference Manual";
// App url for github link
// const APP_REPO = "https://github.com/nwesterhausen/overseers-manual-df"

const App: Component = () => {
  const rawsContext = useRawsProvider();

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
    return rawsContext.parsingStatus() !== STS_IDLE;
  });

  return (
    <>
      <MenuBar />
      <Container class='p-2' fluid>
        <DFDirectoryNotSet />
        <SearchBox />
        <SearchFilters />
        <TagFilterModal />
        <ParsingProgressBar />
        <LoadingRawsProgress />
        {contentToDisplay() ? (
          <></>
        ) : (
          <Tabs defaultActiveKey='bestiary' class='my-3'>
            {/* A bestiary (from bestiarum vocabulum) is a compendium of beasts. */}
            <Tab eventKey='bestiary' title='Bestiary' disabled={rawsContext.creatureRaws().length === 0}>
              <ListingBestiary />
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
