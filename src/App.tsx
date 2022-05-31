import { Container, Navbar, Nav, NavDropdown, Tabs, Tab, Form, FormControl, Alert, Button } from 'solid-bootstrap';
import { listen } from '@tauri-apps/api/event'
import { open as tauriOpen, OpenDialogOptions } from '@tauri-apps/api/dialog'
import { Component, createEffect, createMemo, createResource, createSignal } from 'solid-js';
import Listing from './components/Listing';
import { init as initStore, get as getFromStore, set as saveToStore, SAVES_PATH } from './settings';
import { LIB_VERSION } from './version';
import { AiFillGithub } from 'solidjs-icons/ai';

const openDialogOptions: OpenDialogOptions = {
  directory: true,
  title: "Select your current DF Save Folder (e.g. ...DF/data/saves)"
}

function getSavePathFromWorldDat(dadpath: string, manpath: string) {
  let targetPath = dadpath;
  if (manpath && manpath !== "") {
    targetPath = manpath;
  }
  let pathDelimation = "/";
  if (targetPath.indexOf("\\") !== -1) {
    pathDelimation = "\\";
  }
  let pathArr = targetPath.split(pathDelimation);
  while (pathArr[pathArr.length - 1] !== "save") {
    pathArr = pathArr.slice(0, -1);
    if (pathArr.length === 0) {
      return [];
    }
  }
  return pathArr;

}

const App: Component = () => {
  const [dragAndDropPath, setDragAndDropPath] = createSignal(""); // Path to the dropped file location
  const [doManualFolderSelect, setManualFolderSelect] = createSignal(false); // Change to true to perform open folder diaglog
  const [manuallySpecifiedPath, { mutate, refetch }] = createResource(doManualFolderSelect, performTauriOpenDiaglog)
  const saveFolderPath = createMemo(() => getSavePathFromWorldDat(dragAndDropPath(), manuallySpecifiedPath()));
  createEffect(() => {
    if (saveFolderPath().length) {
      saveToStore(SAVES_PATH, saveFolderPath().join("/"));
    }
  })

  async function performTauriOpenDiaglog(source, { value, refetching }) {
    setManualFolderSelect(false);
    try {
      let folderPath = await tauriOpen(openDialogOptions);
      if (Array.isArray(folderPath)) {
        return folderPath[0];
      }
      return folderPath;
    } catch (error) {
      console.error(error);
      return "";
    }
  }

  initStore().then(() => {
    return getFromStore(SAVES_PATH);
  })
    .then(val => {
      if (val !== "") {
        setDragAndDropPath(val);
      }
    })
    .catch(console.error)

  // Listen for a file being dropped on the window to change the save location.
  listen("tauri://file-drop", (event) => {
    setDragAndDropPath(event.payload[0]);
  })


  return (<>
    <Navbar>
      <Container>
        <Nav>
          <NavDropdown title="Save Folder">
            <NavDropdown.Header >{saveFolderPath().join("/")}</NavDropdown.Header>
            <NavDropdown.Item onClick={() => {
              setManualFolderSelect(true);
            }}>Pick new folder..</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Change Save" id="basic-nav-dropdown" >
            <NavDropdown.Item href="#action/3.1">current</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.1">region1</NavDropdown.Item>
            <NavDropdown.Item active href="#action/3.1">region2</NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Nav>
          <ul class='list-inline'>

            <li class='list-inline-item small'>
              Version {LIB_VERSION}
            </li>
            <li class='list-inline-item'>
              <a href="" target="_blank" class='link-dark icon-link'><AiFillGithub /></a>
            </li>

          </ul>
        </Nav>
      </Container>
    </Navbar>
    <Container class='p-2'>
      {saveFolderPath().length == 0 ? <>
        <Alert variant="warning">
          <Alert.Heading>Dwarf Fortress save directory path is unset!</Alert.Heading>
          <p>
            To set the path to your Dwarf Fortress Save, drag and drop a <code>world.dat</code> file from
            any of the saves in your save folder onto this window, or use the button below to pull up a folder
            selection dialog.
          </p>
          <Container class='p-3'>
            <Button variant="primary" onClick={() => {
              setManualFolderSelect(true);
            }}>Set Save Directory</Button>
          </Container>
        </Alert>
      </> : <>
        <Form class="d-flex">
          <FormControl
            type="search"
            placeholder="Filter results"
            class="me-2"
            aria-label="Search"

          />
        </Form>

        <Tabs defaultActiveKey="all" class="mb-3">
          <Tab eventKey="all" title="All">
            <Listing />
          </Tab>
          <Tab eventKey="bestiary" title="Bestiary">
            <Listing />
          </Tab>
          <Tab eventKey="materials" title="Materials">
            <Listing />
          </Tab>
        </Tabs></>
      }
    </Container>
  </>
  );
};

export default App;
