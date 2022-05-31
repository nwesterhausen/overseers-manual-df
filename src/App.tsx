import { Container, Tabs, Tab, Form, FormControl, Alert, Accordion, Button } from 'solid-bootstrap';
import { emit, listen } from '@tauri-apps/api/event'
import {open as tauriOpen, OpenDialogOptions} from '@tauri-apps/api/dialog'
import { Accessor, Component, createMemo, createResource, createSignal } from 'solid-js';
import HeaderBar from './components/HeaderBar';
import Listing from './components/Listing';
import RawPathDisplay from './components/RawPathDisplay';

const openDialogOptions: OpenDialogOptions = {
  directory: true,
  title: "Select your current DF Save Folder (e.g. ...DF/data/saves/region1)"
}

async function performTauriOpenDiaglog(source, { value, refetching}) {
  try {
    let folderPath = await tauriOpen(openDialogOptions);
    if (Array.isArray(folderPath)) {
      return folderPath[0];
    }
    return folderPath;
  } catch(error) {
    console.error(error);
    return "";
  }
}

function getRawPathFromWorldDat(dadpath: string, manpath: string) {
  let targetPath = dadpath;
  if (manpath && manpath !== "") {
    targetPath = manpath; 
  }

  if (targetPath.indexOf("\\") !== -1) {

    return targetPath.split("\\").slice(0, -1);
  }
  return targetPath.split("/").slice(0, -1);
}

const App: Component = () => {
  const [dragAndDropPath, setDragAndDropPath] = createSignal(""); // Path to the dropped file location
  const [doManualFolderSelect, setManualFolderSelect] = createSignal(false); // Change to true to perform open folder diaglog
  const [manuallySpecifiedPath, { mutate, refetch }]  = createResource(doManualFolderSelect, performTauriOpenDiaglog)
  const rawFolderPath = createMemo(() => getRawPathFromWorldDat(dragAndDropPath(), manuallySpecifiedPath()));
  

  // Listen for a file being dropped on the window to change the save location.
  listen("tauri://file-drop", (event) => {
    setDragAndDropPath(event.payload[0]);
  })


  return (<>
    <HeaderBar />
    <Container class='p-2'>
      {rawFolderPath().length == 0 ? <>
        <Alert variant="warning" dismissible>
          <Alert.Heading>Dwarf Fortress Path Unset</Alert.Heading>
          <p>
            To set the path to your Dwarf Fortress Save, drag and drop the <code>world.dat</code> file from
            the save folder onto this window, or use the button below to pull up a folder selection dialog.
          </p>
          <Container class='p-3'>
            <Button variant="primary" onClick={() => {
              setManualFolderSelect(true);
            }}>Set Save Directory</Button>
          </Container>
        </Alert>
      </> : <>
        <Accordion flush>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Current Raws Folder</Accordion.Header>
            <Accordion.Body>
              <RawPathDisplay path={rawFolderPath()} />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
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
