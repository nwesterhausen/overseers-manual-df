import { Container, Navbar, Tabs, Tab, Nav } from 'solid-bootstrap';
import type { Component } from 'solid-js';
import Listing from './components/Listing';
import { LIB_VERSION } from './version';

const App: Component = () => {
  return (<>
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>
          {"An Overseer's Reference Manual"}
        </Navbar.Brand>
        <Nav>
          Version: {LIB_VERSION}
        </Nav>
      </Container>
    </Navbar>
    <div class="p-2 container">

      <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" class="mb-3">
        <Tab eventKey="all" title="All">
          <Listing />
        </Tab>
        <Tab eventKey="bestiary" title="Bestiary">
          <Listing />
        </Tab>
        <Tab eventKey="materials" title="Materials">
          <Listing />
        </Tab>
      </Tabs>
    </div>
  </>
  );
};

export default App;
