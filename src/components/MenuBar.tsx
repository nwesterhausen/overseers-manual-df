import { Container, Nav, Navbar, NavDropdown, OverlayTrigger, Stack, Tooltip } from 'solid-bootstrap';
import { Component, For, Match, Switch } from 'solid-js';
import { DIR_DF, DIR_NONE, DIR_SAVE, useDirectoryProvider } from '../providers/DirectoryProvider';
import { BsFolderSymlinkFill } from 'solid-icons/bs';

const MenuBar: Component = () => {
  const directoryContext = useDirectoryProvider();

  return (
    <Navbar variant='dark'>
      <Container class='p-0'>
        <Nav>
          <NavDropdown title='Directory' menuVariant='dark'>
            <OverlayTrigger
              placement='auto'
              overlay={
                <Tooltip id='directory-type-details'>
                  <Switch>
                    <Match when={directoryContext.directoryType() === DIR_DF}>Dwarf Fortress Directory</Match>
                    <Match when={directoryContext.directoryType() === DIR_SAVE}>Save Archive Directory</Match>
                    <Match when={directoryContext.directoryType() === DIR_NONE}>Please set the directory!</Match>
                  </Switch>
                </Tooltip>
              }>
              <NavDropdown.Header>
                {directoryContext.directoryPath().length > 0
                  ? directoryContext.directoryPath().join('/')
                  : 'No Directory Set'}
              </NavDropdown.Header>
            </OverlayTrigger>
            <NavDropdown.Divider />
            <NavDropdown.Item
              onClick={() => {
                directoryContext.setManualFolderSelect(true);
              }}>
              <Stack direction='horizontal' gap={1}>
                <span class='me-auto'>
                  {directoryContext.directoryPath().length > 0 ? 'Change ' : 'Set '}
                  Directory
                </span>
                <BsFolderSymlinkFill />
              </Stack>
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title='Change Save' menuVariant='dark'>
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
