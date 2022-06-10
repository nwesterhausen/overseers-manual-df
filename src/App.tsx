import { Container, Navbar, Nav, NavDropdown, Tabs, Tab, Form, Button, Spinner, Stack } from 'solid-bootstrap';
import { listen } from '@tauri-apps/api/event';
import { debounce } from '@solid-primitives/scheduled';
import { open as tauriOpen, OpenDialogOptions } from '@tauri-apps/api/dialog';
import { appWindow } from '@tauri-apps/api/window';
import { Component, createEffect, createMemo, createResource, createSignal, For } from 'solid-js';
import Listing from './components/Listing';
import { init as initStore, get as getFromStore, set as saveToStore, SAVES_PATH, LAST_SAVE } from './settings';
import { readDir } from '@tauri-apps/api/fs';
import { getVersion } from '@tauri-apps/api/app';
import { invoke } from '@tauri-apps/api/tauri';
import { AssignBasedOn, Creature, GenerateSearchString } from './definitions/Creature';
import ScrollToTopBtn from './components/ScrollToTopBtn';
import { FilterInvalidRaws } from './definitions/Raw';

// App name for title
const APP_NAME = "Overseer's Reference Manual";
// App url for github link
// const APP_REPO = "https://github.com/nwesterhausen/overseers-manual-df"

// Statuses for the parsing status
const STS_PARSING = 'Parsing',
  STS_LOADING = 'Loading',
  STS_IDLE = 'Idle',
  STS_EMPTY = 'Idle/No Raws';

/**
 * Dialog options for the select directory window
 */
const openDialogOptions: OpenDialogOptions = {
  directory: true,
  title: 'Select your current DF Save Folder (e.g. ...DF/data/saves)',
};

/**
 * Helper function to turn the path from a drag and dropped file OR the manually selected save folder
 * into an array of directories ending with the Dwarf Fortress save folder. This is done pretty crudely,
 * it splits the path based on `/` unless if finds `\` in the path, then it spits by `\`. After splitting
 * the path, keeps removing indeces at the end of the array until the final index is 'save' (or the array
 * is empty).
 * @param dadpath - path from drag-and-dropped file
 * @param manpath - path from the open directory dialog
 * @returns array of directories leading to the save directory
 */
function getSavePathFromWorldDat(dadpath: string, manpath: string): string[] {
  let targetPath = dadpath;
  if (manpath && manpath !== '') {
    targetPath = manpath;
  }
  let pathDelimation = '/';
  if (targetPath.indexOf('\\') !== -1) {
    pathDelimation = '\\';
  }
  let pathArr = targetPath.split(pathDelimation);
  while (pathArr[pathArr.length - 1] !== 'save') {
    pathArr = pathArr.slice(0, -1);
    if (pathArr.length === 0) {
      return [];
    }
  }
  return pathArr;
}

const App: Component = () => {
  // Tauri provides the app version in a promise, so we use a resource for it
  const [appVersion] = createResource(async () => {
    return await getVersion();
  });
  // Path to the dropped file location
  const [dragAndDropPath, setDragAndDropPath] = createSignal('');
  // Signal to open the directory open dialog, change to true to open it
  const [doManualFolderSelect, setManualFolderSelect] = createSignal(false);
  // This resource calls the Tauri API to open a file dialog
  const [manuallySpecifiedPath] = createResource(doManualFolderSelect, performTauriOpenDiaglog);
  // Since we are splitting (and verifying) the path, we use a memo which reacts if either a file is dropped or if the
  // resource is updated
  const saveFolderPath = createMemo(() => getSavePathFromWorldDat(dragAndDropPath(), manuallySpecifiedPath()));
  // Based on the memo changing, we update the save folder path (and save it to our settings storage)
  createEffect(() => {
    if (saveFolderPath().length) {
      saveToStore(SAVES_PATH, saveFolderPath().join('/')); // Decided to deliminate with `/` in the settings file
    }
  });
  // List of possible save folders (each can have their own raws)
  const [saveDirectoryOptions, setSaveDirectoryOptions] = createSignal<string[]>([]);
  // Currently selected save signal
  const [currentSave, setCurrentSave] = createSignal<string>('');
  // When we update the save directory, we need to update the list of possible saves
  createEffect(() => {
    if (saveFolderPath().length) {
      readDir(saveFolderPath().join('/'))
        .then((values) => {
          console.log(values);
          const saveArr = [];
          values.forEach((fileEntry) => {
            saveArr.push(fileEntry.name);
          });
          setSaveDirectoryOptions(saveArr);
        })
        .catch(console.error);
    } else {
      setManualFolderSelect(false);
    }
  });
  // Signal for loading raws
  const [loadRaws, setLoadRaws] = createSignal(false);
  // Resource for raws
  const [jsonRawsResource] = createResource(loadRaws, parseRawsInSave, {
    initialValue: [],
  });
  // When we update the currently selected save, we want to save it so we remember next time the app opens
  // Also update the title depending on the current save or app version changing
  createEffect(() => {
    if (currentSave() !== '') {
      appWindow.setTitle(`${APP_NAME} ${appVersion()} - ${currentSave()}`);
      saveToStore(LAST_SAVE, currentSave());
      setLoadRaws(true);
    } else {
      appWindow.setTitle(`${APP_NAME} ${appVersion()}`);
    }
  });
  // Signal for the search filter
  const [searchString, setSearchString] = createSignal('');
  // Signal for setting raw parse status
  const [parsingStatus, setParsingStatus] = createSignal(STS_IDLE);
  // Element to show progress
  const searchBarHtml = createMemo(() => {
    switch (parsingStatus()) {
      case STS_IDLE:
        if (jsonRawsResource().length === 0) {
          return (
            <>
              <p class='text-center'>Please choose a save to load raws from:</p>
              <Container class='justify-content-center d-flex mx-auto w-50'>
                <Stack gap={1}>
                  <For each={saveDirectoryOptions()}>
                    {(dir) => (
                      <Button onClick={() => setCurrentSave(dir)} variant='outline-secondary'>
                        {dir}
                      </Button>
                    )}
                  </For>
                </Stack>
              </Container>
            </>
          );
        }
        return (
          <>
            <Form.Control
              type='search'
              placeholder='Filter results'
              aria-label='Search'
              onInput={debounce((event) => {
                const targetEl = event.target as HTMLInputElement;
                setSearchString(targetEl.value.toLowerCase());
              }, 100)}
            />
          </>
        );
      case STS_LOADING:
        return (
          <Stack class='justify-content-center d-flex' direction='horizontal' gap={3}>
            <Spinner animation='grow' />
            <span>Loading raws...</span>
          </Stack>
        );
      case STS_PARSING:
        return (
          <Stack class='justify-content-center d-flex' direction='horizontal' gap={3}>
            <Spinner animation='grow' />
            <span>Parsing raw files...</span>
          </Stack>
        );
      case STS_EMPTY:
        return (
          <>
            <p class='text-center'>
              No raws found in <strong>{currentSave()}</strong>
            </p>
            <p class='text-center'>Please choose a save to load raws from:</p>
            <Container class='justify-content-center d-flex mx-auto w-50'>
              <Stack gap={1}>
                <For each={saveDirectoryOptions()}>
                  {(dir) => (
                    <Button onClick={() => setCurrentSave(dir)} variant='outline-secondary'>
                      {dir}
                    </Button>
                  )}
                </For>
              </Stack>
            </Container>
          </>
        );
    }
  });

  /**
   * This opens a directory selection dialog using the settings defined earlier.
   * @returns The selected path (or first selected path if more than one is chosen). Returns an empty string if it
   * encounters an error.
   */
  async function performTauriOpenDiaglog(): Promise<string> {
    // setManualFolderSelect(false);
    try {
      const folderPath = await tauriOpen(openDialogOptions);
      if (Array.isArray(folderPath)) {
        return folderPath[0];
      }
      return folderPath;
    } catch (error) {
      console.error(error);
      return '';
    }
  }

  /**
   * This calls the parse function in our rust code and gets the JSON response
   * back. Currently we only parse creature raws, so this is set to return
   * creature objects. But in the future we will probably have to use a few different
   * functions or at least handle them differently.
   */
  async function parseRawsInSave(): Promise<Creature[]> {
    // setLoadRaws(false);
    const dir = [...saveFolderPath(), currentSave(), 'raw'].join('/');
    console.log(`Sending ${dir} to be parsed.`);
    setParsingStatus(STS_PARSING);
    const jsonStr = await invoke('parse_raws_at_path', {
      path: dir,
    });
    setParsingStatus(STS_LOADING);
    if (typeof jsonStr !== 'string') {
      console.debug(jsonStr);
      console.error("Did not get 'string' back");
      setParsingStatus(STS_IDLE);
      setLoadRaws(false);
      return [];
    }
    const result = JSON.parse(jsonStr);
    if (Array.isArray(result)) {
      const sortResult = result.filter(FilterInvalidRaws).sort((a, b) => (a.name < b.name ? -1 : 1));
      const mergedResult = sortResult.map((val: Creature, i, a: Creature[]) => {
        if (val.based_on && val.based_on.length) {
          const matches = a.filter((c) => c.objectId === val.based_on);
          if (matches.length === 1) {
            return AssignBasedOn(val, matches[0]);
          }
          console.warn(`${matches.length} matches for ${val.based_on}`);
        }
        return val;
      });
      const searchableResult = mergedResult.map((v: Creature) => {
        v.searchString = GenerateSearchString(v);
        return v;
      });
      console.log('raws parsed', searchableResult.length);
      if (searchableResult.length === 0) {
        setParsingStatus(STS_EMPTY);
      } else {
        setParsingStatus(STS_IDLE);
      }
      setTimeout(() => {
        setLoadRaws(false);
      }, 50);
      return searchableResult;
    }
    console.debug(result);
    console.error('Result was not an array');
    setParsingStatus(STS_IDLE);
    setLoadRaws(false);
    return [];
  }

  setTimeout(() => {
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
          setDragAndDropPath(val);
        }
      })
      .catch(console.error);
  }, 10);

  // Listen for a file being dropped on the window to change the save location.
  listen('tauri://file-drop', (event) => {
    setDragAndDropPath(event.payload[0]);
  });

  return (
    <>
      <Navbar variant='dark'>
        <Container>
          <Nav>
            <NavDropdown title='Save Folder'>
              <NavDropdown.Header>{saveFolderPath().join('/')}</NavDropdown.Header>
              <NavDropdown.Item
                onClick={() => {
                  setManualFolderSelect(true);
                }}>
                Pick new folder..
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title='Change Save' id='basic-nav-dropdown'>
              <For
                each={saveDirectoryOptions()}
                fallback={<NavDropdown.Header>No saves found in directory.</NavDropdown.Header>}>
                {(save) => (
                  <NavDropdown.Item active={save === currentSave()} onClick={() => setCurrentSave(save)}>
                    {save}
                  </NavDropdown.Item>
                )}
              </For>
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>
      <Container class='p-2'>
        {saveFolderPath().length == 0 ? (
          <>
            <Stack gap={2}>
              <h2>Dwarf Fortress save directory path is unset!</h2>
              <p>
                To set the path to your Dwarf Fortress Save, drag and drop a <code>world.dat</code> file from any of the
                saves in your save folder onto this window, or use the button below to pull up a folder selection
                dialog.
              </p>
              <Container class='p-3'>
                <Button
                  variant='secondary'
                  onClick={() => {
                    setManualFolderSelect(true);
                  }}>
                  Set Save Directory
                </Button>
              </Container>
            </Stack>
          </>
        ) : (
          <>
            {searchBarHtml()}
            {jsonRawsResource().length === 0 || parsingStatus() !== STS_IDLE ? (
              <></>
            ) : (
              <Tabs defaultActiveKey='bestiary' class='my-3'>
                {/* A bestiary (from bestiarum vocabulum) is a compendium of beasts. */}
                <Tab eventKey='bestiary' title='Bestiary'>
                  <Listing data={jsonRawsResource()} searchString={searchString()} />
                </Tab>
                <Tab disabled title='More to come in the future!'></Tab>
              </Tabs>
            )}
          </>
        )}
      </Container>
      <ScrollToTopBtn />
    </>
  );
};

export default App;
