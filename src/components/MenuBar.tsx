import { Container, Nav, Navbar, NavDropdown } from 'solid-bootstrap';
import { Component, For } from 'solid-js';
import { useDirectoryProvider } from './DirectoryProvider';

const MenuBar: Component = () => {
  const directoryContext = useDirectoryProvider();

  return (
    <Navbar variant='dark'>
      <Container>
        <Nav>
          <NavDropdown title='Save Folder'>
            <NavDropdown.Header>{directoryContext.saveFolderPath().join('/')}</NavDropdown.Header>
            <NavDropdown.Item
              onClick={() => {
                directoryContext.setManualFolderSelect(true);
              }}>
              Pick new folder..
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title='Change Save' id='basic-nav-dropdown'>
            <For
              each={directoryContext.saveDirectoryOptions()}
              fallback={<NavDropdown.Header>No saves found in directory.</NavDropdown.Header>}>
              {(save) => (
                <NavDropdown.Item
                  active={save === directoryContext.currentSave()}
                  onClick={() => directoryContext.setCurrentSave(save)}>
                  {save}
                </NavDropdown.Item>
              )}
            </For>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default MenuBar;
