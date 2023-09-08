import { Component, createMemo } from 'solid-js';
import { STS_IDLE, STS_LOADING, STS_PARSING, useRawsProvider } from '../../providers/RawsProvider';
import AdvancedFiltersButton from './AdvancedFiltersButton';
import DisplayStyleButton from './DisplayStyleButton';
import GameReferenceButton from './GameReferenceButton';
import GraphicsToggleButton from './GraphicsToggleButton';
import OpenSettingsButton from './OpenSettingsButton';
import RawTypeCheckboxes from './RawTypeCheckboxes';
import ReloadRawsButton from './ReloadRawsButton';
import SearchBox from './SearchBox';
import SetDirectoryButton from './SetDirectoryButton';

const MenuBar: Component = () => {
  const rawsContext = useRawsProvider();

  const disableButtons = createMemo(() => rawsContext.parsingStatus() !== STS_IDLE);

  return (
    <>
      <div class='navbar'>
        <div class='me-auto'>
          <div class='join'>
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

        <div class='ms-auto'>
          <div class='join'>
            <GraphicsToggleButton disabled={disableButtons()} />
            <DisplayStyleButton disabled={disableButtons()} />
            <GameReferenceButton disabled={disableButtons()} />

            {/* <ThemeChangeButton /> */}
            <OpenSettingsButton />
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuBar;
