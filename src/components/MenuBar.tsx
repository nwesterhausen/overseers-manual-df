import { Container, Nav, NavItem, Navbar, OverlayTrigger, Stack, Tooltip } from 'solid-bootstrap';
import { BsFolderSymlinkFill } from 'solid-icons/bs';
import { HiOutlineRefresh } from 'solid-icons/hi';
import { Component, Match, Switch } from 'solid-js';
import { DIR_DF, DIR_NONE, useDirectoryProvider } from '../providers/DirectoryProvider';
import { STS_IDLE, useRawsProvider } from '../providers/RawsProvider';

const MenuBar: Component = () => {
  const directoryContext = useDirectoryProvider();
  const rawsContext = useRawsProvider();

  return (
    <Navbar variant='dark'>
      <Container class='p-0' fluid>
        <Nav>
          <NavItem class='mx-2 btn btn-primary'
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
          </NavItem>

          <OverlayTrigger
            placement='auto'
            overlay={
              <Tooltip id='directory-type-details'>
                <Switch>
                  <Match when={directoryContext.directoryType() === DIR_DF}>Dwarf Fortress Directory</Match>
                  <Match when={directoryContext.directoryType() === DIR_NONE}>Please set the directory!</Match>
                </Switch>
              </Tooltip>
            }>
            <NavItem class='mx-2 btn btn-secondary disabled'>
              {directoryContext.directoryPath().length > 0
                ? directoryContext.directoryPath().join('/')
                : 'No Directory Set'}
            </NavItem>
          </OverlayTrigger>

          <NavItem class='mx-2'>
            <OverlayTrigger
              placement='auto'
              overlay={<Tooltip id='refresh-button-tooltip'>Refresh the raws</Tooltip>}>

              <NavItem class='mx-2 btn btn-info' classList={{
                "disabled": rawsContext.currentStatus() !== STS_IDLE
              }}
                onClick={() => rawsContext.setLoadRaws(true)}>
                <Stack direction='horizontal' gap={1}>
                  <span class='me-auto' >Re-read Raw Modules
                  </span>
                  <HiOutlineRefresh />
                </Stack>
              </NavItem>
            </OverlayTrigger>
          </NavItem>

          {/* <NavItem class='mx-2 btn btn-secondary'>
            <Stack direction='horizontal' gap={1}>
              <span class='me-auto'>
                Parser Settings
              </span>
              <BsGearFill />
            </Stack>
          </NavItem> */}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default MenuBar;
