import { Button, Container, Nav, Navbar, NavDropdown, NavItem, OverlayTrigger, Stack, Tooltip } from 'solid-bootstrap';
import { Component, For, Match, Switch } from 'solid-js';
import { DIR_DF, DIR_NONE, DIR_SAVE, useDirectoryProvider } from '../providers/DirectoryProvider';
import { BsFolderSymlinkFill } from 'solid-icons/bs';
import { HiOutlineRefresh } from 'solid-icons/hi';
import { STS_IDLE, useRawsProvider } from '../providers/RawsProvider';

const MenuBar: Component = () => {
  const directoryContext = useDirectoryProvider();
  const rawsContext = useRawsProvider();

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

          <NavItem class='mx-2'>
            <OverlayTrigger
              placement='auto'
              overlay={<Tooltip id='refresh-button-tooltip'>Refresh valid save directory options</Tooltip>}>
              <Button variant='outline-info' class='border-0' onClick={directoryContext.refreshSaveDirs}>
                <HiOutlineRefresh class='icon-fix' />
              </Button>
            </OverlayTrigger>
          </NavItem>

          <NavDropdown
            title={directoryContext.currentSave() === '' ? 'Choose Save' : directoryContext.currentSave()}
            menuVariant='dark'>
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

          {directoryContext.currentSave() === '' ? (
            <></>
          ) : (
            <NavItem class='mx-2'>
              <OverlayTrigger
                placement='auto'
                overlay={<Tooltip id='refresh-button-tooltip'>Refresh the raws from the current save</Tooltip>}>
                <Button
                  disabled={rawsContext.currentStatus() !== STS_IDLE}
                  variant='outline-info'
                  class='border-0'
                  onClick={() => rawsContext.setLoadRaws(true)}>
                  <HiOutlineRefresh class='icon-fix' />
                </Button>
              </OverlayTrigger>
            </NavItem>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default MenuBar;
