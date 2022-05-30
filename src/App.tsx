import { Container, Navbar, Tabs, Tab, Nav, Form, FormControl, Button } from 'solid-bootstrap';
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
    <Container class='p-2'>

      <Form class="d-flex">
        <FormControl
          type="search"
          placeholder="Filter results"
          class="me-2"
          aria-label="Search"
        />
      </Form>
    </Container>
    <Container class='p-2'>

      <Tabs defaultActiveKey="all" id="uncontrolled-tab-example" class="mb-3">
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
    </Container>
  </>
  );
};

export default App;
