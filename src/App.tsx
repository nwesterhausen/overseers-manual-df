import { Container, Tabs, Tab, Form, FormControl, Alert, Accordion } from 'solid-bootstrap';
import { emit, listen } from '@tauri-apps/api/event'
import { Accessor, Component, createMemo, createSignal } from 'solid-js';
import HeaderBar from './components/HeaderBar';
import Listing from './components/Listing';
import RawPathDisplay from './components/RawPathDisplay';

function getRawPathFromWorldDat(datpath: string) {
  if (datpath.indexOf("\\") !== -1) {

    return datpath.split("\\").slice(0, -1);
  }
  return datpath.split("/").slice(0, -1);
}

const App: Component = () => {
  const [dfpath, setDfpath] = createSignal(""); // Path to the dropped file location
  const rawFolderPath = createMemo(() => getRawPathFromWorldDat(dfpath()));

  // Listen for a file being dropped on the window to change the save location.
  listen("tauri://file-drop", (event) => {
    setDfpath(event.payload[0]);
  })


  return (<>
    <HeaderBar />
    <Container class='p-2'>
      {dfpath() === "" ? <>
        <Alert variant="warning" dismissible>
          <Alert.Heading>Dwarf Fortress Path Unset</Alert.Heading>
          <p>
            To set the path to your Dwarf Fortress Save, drag and drop the <code>world.dat</code> file from
            the save folder onto this window, or use the filepicker below to browse for the save folder.
          </p>
        </Alert>
        <Form.Group controlId="formFile" class="mb-3">
          <Form.Label>Browse to the save folder. (Ideally select the <code>world.dat</code> file.)</Form.Label>
          <Form.Control type="file" />
        </Form.Group>
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
