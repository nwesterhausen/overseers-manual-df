import { ParentComponent, Show, createMemo } from 'solid-js';
import { STS_IDLE, STS_LOADING, STS_PARSING, useRawsProvider } from '../../providers/RawsProvider';
import { useSearchProvider } from '../../providers/SearchProvider';
import AdvancedFiltersButton from './AdvancedFiltersButton';
import AppDrawerButton from './AppDrawerButton';
import AppDrawerContent from './AppDrawerContent';
import GameReferenceButton from './GameReferenceButton';
import GraphicsToggleButton from './GraphicsToggleButton';
import OpenSettingsButton from './OpenSettingsButton';
import RawTypeCheckboxes from './RawTypeCheckboxes';
import ReloadRawsButton from './ReloadRawsButton';
import SearchBox from './SearchBox';
import SetDirectoryButton from './SetDirectoryButton';

const MenuBar: ParentComponent = (props) => {
  const rawsContext = useRawsProvider();
  const searchContext = useSearchProvider();

  const disableButtons = createMemo(() => rawsContext.parsingStatus() !== STS_IDLE);

  return (
    <>
      <div class='navbar'>
        <div class='me-auto'>
          <div class='join'>
            <AppDrawerButton />
            <SetDirectoryButton
              disabled={rawsContext.parsingStatus() === STS_PARSING && rawsContext.parsingStatus() === STS_LOADING}
            />
            <ReloadRawsButton disabled={disableButtons()} />
          </div>
        </div>

        <div class='mx-auto'>
          <div class='join'>
            <SearchBox disabled={disableButtons()} />
            <RawTypeCheckboxes disabled={disableButtons()} />
            {/* <TagRestrictionButton disabled={disableButtons()} /> */}
            <AdvancedFiltersButton disabled={disableButtons()} />
          </div>
        </div>
        <Show when={searchContext.active()}>
          <div class='mx-2 text-xs text-accent'>
            {rawsContext.searchFilteredRaws().length >= 50 ? 'More than ' : ''}
            {rawsContext.searchFilteredRaws().length} results
          </div>
        </Show>
        <div class='mx-2 text-xs text-info'>{rawsContext.totalRawCount()} raws loaded</div>
        <div class='ms-auto'>
          <div class='join'>
            <GraphicsToggleButton disabled={disableButtons()} />
            <GameReferenceButton disabled={disableButtons()} />

            {/* <ThemeChangeButton /> */}
            <OpenSettingsButton />
          </div>
        </div>
      </div>
      <div class='drawer'>
        <input id='my-drawer' type='checkbox' class='drawer-toggle' />
        <div class='drawer-content'>
          {/* Page content here */}
          {props.children}
        </div>
        <AppDrawerContent />
      </div>
    </>
  );
};

export default MenuBar;
