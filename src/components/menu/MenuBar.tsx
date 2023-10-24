import { A, useLocation } from '@solidjs/router';
import { ParentComponent, Show, createMemo } from 'solid-js';
import { STS_IDLE, useRawsProvider } from '../../providers/RawsProvider';
import ScrollToTopBtn from '../ScrollToTopBtn';
import SearchFilters from '../filtering/SearchFilters';
import AppDrawerButton from './AppDrawerButton';
import AppDrawerContent from './AppDrawerContent';
import OpenSettingsButton from './OpenSettingsButton';
import Pagination from './Pagination';
import ReloadRawsButton from './ReloadRawsButton';
import SearchBox from './SearchBox';

const MenuBar: ParentComponent = (props) => {
  const rawsContext = useRawsProvider();
  const location = useLocation();
  const disableButtons = createMemo(() => rawsContext.parsingStatus() !== STS_IDLE);

  console.log('MenuBar', location.pathname);
  return (
    <>
      <div class='navbar mb-2 bg-slate-700 bg-opacity-50 rounded-b-lg px-2 py-0'>
        <div class='me-auto'>
          <ul class='menu menu-horizontal'>
            <AppDrawerButton />
            <Show when={location.pathname === '/' && rawsContext.parsingStatus() == STS_IDLE}>
              <ReloadRawsButton />
            </Show>
            <Show when={location.pathname === '/settings'}>
              <li>
                <A href='/'>Back</A>
              </li>
            </Show>
          </ul>
        </div>

        <div class='mx-auto grow'>
          <Show when={!disableButtons()}>
            <SearchBox />
          </Show>
        </div>

        <div class='ms-auto'>
          <ul class='menu menu-horizontal'>
            <OpenSettingsButton />
          </ul>
        </div>
      </div>
      <div class='drawer'>
        <input id='my-drawer' type='checkbox' class='drawer-toggle' />
        <div class='drawer-content'>
          {/* Page content here */}
          {props.children}

          <Show when={rawsContext.parsingStatus() == STS_IDLE && location.pathname === '/'}>
            <Pagination />
          </Show>
        </div>
        <AppDrawerContent />
        <ScrollToTopBtn />
        {/*  MODALS  */}
        <SearchFilters />
      </div>
    </>
  );
};

export default MenuBar;
