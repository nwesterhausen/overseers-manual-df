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
            <OverlayTrigger
              placement='right'
              overlay={
                <Tooltip id='df-dir-tooltip'>
                  Select your Dwarf Fortress directory. This is the same folder that has <code>gamelog.txt</code> in it.
                </Tooltip>
              }>
              <NavDropdown.Item
                onClick={() => {
                  directoryContext.setDirectoryType(DIR_DF);
                  directoryContext.setManualFolderSelect(true);
                }}>
                <Stack direction='horizontal' gap={1}>
                  <span class='me-auto'>
                    {directoryContext.directoryPath().length > 0 ? 'Change ' : 'Set '}
                    Dwarf Fortress Directory
                  </span>
                  <BsFolderSymlinkFill />
                </Stack>
              </NavDropdown.Item>
            </OverlayTrigger>
            <OverlayTrigger
              placement='right'
              overlay={
                <Tooltip id='save-only-dir-tooltip'>
                  Instead of using your Dwarf Fortress game directory, choose a directory containing save folders (e.g.
                  an archival set of old saves or backups).
                </Tooltip>
              }>
              <NavDropdown.Item
                onClick={() => {
                  directoryContext.setDirectoryType(DIR_SAVE);
                  directoryContext.setManualFolderSelect(true);
                }}>
                <Stack direction='horizontal' gap={1}>
                  <span class='me-auto'>Choose a save-only location instead</span>
                  <BsFolderSymlinkFill />
                </Stack>
              </NavDropdown.Item>
            </OverlayTrigger>
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
